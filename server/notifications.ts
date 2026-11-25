import crypto from 'crypto';
import net from 'net';
import tls from 'tls';
import {
  NotificationEventKey,
  NotificationLogEntry,
  SuiteDatabase,
} from './types';

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export function getSmtpConfig(): SmtpConfig | null {
  const host = (process.env.SMTP_HOST || '').trim();
  const port = Number(process.env.SMTP_PORT || 465);
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  const from = (process.env.SMTP_FROM || user || 'connect@akyin.com').trim();
  if (!host || !user || !pass) return null;
  return {
    host,
    port: Number.isFinite(port) && port > 0 ? port : 465,
    user,
    pass,
    from,
  };
}

function sanitizeHeaderValue(val: string): string {
  return val.replace(/[\r\n]+/g, ' ').trim();
}

async function sendViaSmtp(
  cfg: SmtpConfig,
  to: string,
  subject: string,
  textBody: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanTo = sanitizeHeaderValue(to);
    const cleanFrom = sanitizeHeaderValue(cfg.from);
    const cleanSubject = sanitizeHeaderValue(subject);

    const connectTls = () =>
      tls.connect({
        host: cfg.host,
        port: cfg.port,
        servername: cfg.host,
        timeout: 10_000,
      });

    let socket: net.Socket | tls.TLSSocket =
      cfg.port === 465
        ? tls.connect({
            host: cfg.host,
            port: cfg.port,
            servername: cfg.host,
            timeout: 10_000,
          })
        : net.connect({ host: cfg.host, port: cfg.port, timeout: 10_000 });

    let step:
      | 'greeting'
      | 'ehlo_plain'
      | 'starttls'
      | 'ehlo_tls'
      | 'auth_user'
      | 'auth_pass'
      | 'auth_done'
      | 'mail_from'
      | 'rcpt_to'
      | 'data_cmd'
      | 'data_body'
      | 'quit' = 'greeting';
    let buffer = '';
    let settled = false;
    let tlsUpgraded = cfg.port === 465;
    let ehloSupportsStarttls = false;

    const finish = (err?: Error) => {
      if (settled) return;
      settled = true;
      try {
        socket.end();
        socket.destroy();
      } catch {
        // ignore
      }
      if (err) reject(err);
      else resolve();
    };

    const sendCmd = (cmd: string) => {
      socket.write(`${cmd}\r\n`);
    };

    const attachSocketListeners = (sock: net.Socket | tls.TLSSocket) => {
      sock.on('timeout', () => finish(new Error('SMTP connection timed out')));
      sock.on('error', (err) => finish(err));
      sock.on('data', (chunk) => {
        buffer += chunk.toString('utf8');
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line) continue;
          if (step === 'ehlo_plain' && /STARTTLS/i.test(line)) {
            ehloSupportsStarttls = true;
          }
          // Multi-line SMTP replies have '-' at index 3 (e.g. "250-")
          if (line.length >= 4 && line[3] === '-') continue;
          const code = Number(line.slice(0, 3));
          if (Number.isFinite(code)) {
            handleLine(code, line);
          }
        }
      });
    };

    const handleLine = (code: number, line: string) => {
      if (code >= 400) {
        finish(new Error(`SMTP ${code}: ${line}`));
        return;
      }
      if (step === 'greeting' && code === 220) {
        if (tlsUpgraded) {
          step = 'ehlo_tls';
        } else {
          step = 'ehlo_plain';
        }
        sendCmd('EHLO akyin.com');
      } else if (step === 'ehlo_plain' && code === 250) {
        if (!tlsUpgraded && (ehloSupportsStarttls || cfg.port === 587)) {
          step = 'starttls';
          sendCmd('STARTTLS');
        } else {
          step = 'auth_user';
          sendCmd('AUTH LOGIN');
        }
      } else if (step === 'starttls' && code === 220) {
        const plainSock = socket;
        plainSock.removeAllListeners('data');
        plainSock.removeAllListeners('error');
        plainSock.removeAllListeners('timeout');
        buffer = '';
        const tlsSock = tls.connect(
          {
            socket: plainSock,
            servername: cfg.host,
            timeout: 10_000,
          },
          () => {
            tlsUpgraded = true;
            step = 'ehlo_tls';
            sendCmd('EHLO akyin.com');
          }
        );
        socket = tlsSock;
        attachSocketListeners(tlsSock);
      } else if (step === 'ehlo_tls' && code === 250) {
        step = 'auth_user';
        sendCmd('AUTH LOGIN');
      } else if (step === 'auth_user' && code === 334) {
        step = 'auth_pass';
        sendCmd(Buffer.from(cfg.user, 'utf8').toString('base64'));
      } else if (step === 'auth_pass' && code === 334) {
        step = 'auth_done';
        sendCmd(Buffer.from(cfg.pass, 'utf8').toString('base64'));
      } else if (step === 'auth_done' && code === 235) {
        step = 'mail_from';
        sendCmd(`MAIL FROM:<${cleanFrom}>`);
      } else if (step === 'mail_from' && code === 250) {
        step = 'rcpt_to';
        sendCmd(`RCPT TO:<${cleanTo}>`);
      } else if (step === 'rcpt_to' && (code === 250 || code === 251)) {
        step = 'data_cmd';
        sendCmd('DATA');
      } else if (step === 'data_cmd' && code === 354) {
        step = 'data_body';
        const safeText = textBody.replace(/^\./gm, '..');
        const message = [
          `From: AKYIN Ventures <${cleanFrom}>`,
          `To: <${cleanTo}>`,
          `Subject: ${cleanSubject}`,
          `Date: ${new Date().toUTCString()}`,
          'MIME-Version: 1.0',
          'Content-Type: text/plain; charset=utf-8',
          '',
          safeText,
          '.',
        ].join('\r\n');
        socket.write(`${message}\r\n`);
      } else if (step === 'data_body' && code === 250) {
        step = 'quit';
        sendCmd('QUIT');
      } else if (step === 'quit') {
        finish();
      }
    };

    attachSocketListeners(socket);
  });
}

export async function dispatchNotification(
  db: SuiteDatabase,
  options: {
    event: NotificationEventKey;
    recipient?: string;
    subject: string;
    body: string;
  }
): Promise<NotificationLogEntry> {
  const targetEmail =
    options.recipient?.trim() ||
    db.notificationSettings?.ownerNotificationEmail ||
    db.websiteSettings?.notificationEmail ||
    'connect@akyin.com';

  const enabled = Boolean(db.notificationSettings?.events?.[options.event]);
  const entry: NotificationLogEntry = {
    id: `NTF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    timestamp: new Date().toISOString(),
    event: options.event,
    recipient: targetEmail,
    subject: options.subject,
    deliveryStatus: 'logged_unconfigured',
  };

  if (!enabled) {
    entry.deliveryStatus = 'skipped_disabled';
    db.notificationLogs.unshift(entry);
    db.notificationLogs = db.notificationLogs.slice(0, 500);
    return entry;
  }

  const smtp = getSmtpConfig();
  if (!smtp) {
    entry.deliveryStatus = 'logged_unconfigured';
    db.notificationLogs.unshift(entry);
    db.notificationLogs = db.notificationLogs.slice(0, 500);
    return entry;
  }

  try {
    await sendViaSmtp(smtp, targetEmail, options.subject, options.body);
    entry.deliveryStatus = 'sent';
  } catch (err) {
    entry.deliveryStatus = 'failed';
    entry.errorMessage = err instanceof Error ? err.message : 'SMTP delivery failed';
  }

  db.notificationLogs.unshift(entry);
  db.notificationLogs = db.notificationLogs.slice(0, 500);
  return entry;
}
