import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const distDir = path.join(__dirname, 'dist');
const indexFile = path.join(distDir, 'index.html');
const port = Number.parseInt(process.env.PORT || '3000', 10);

app.disable('x-powered-by');

// Basic response hardening. The application also defines its own CSP in index.html.
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

if (!fs.existsSync(indexFile)) {
  console.error('Production build not found: dist/index.html is missing. Run npm run build before starting the server.');
  process.exit(1);
}

app.use(express.static(distDir, {
  dotfiles: 'deny',
  index: false,
  maxAge: '1d',
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (/\.(?:js|css|woff2?|png|jpe?g|svg|webp|ico)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
}));

// SPA fallback: allow direct visits and refreshes on React routes.
app.use((req, res, next) => {
  if (req.method !== 'GET' || !req.accepts('html')) {
    return next();
  }
  res.sendFile(indexFile, (error) => {
    if (error) next(error);
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((error, _req, res, _next) => {
  console.error('Request error:', error);
  if (!res.headersSent) res.status(500).send('Internal server error');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`AKYIN production server listening on 0.0.0.0:${port}`);
});
