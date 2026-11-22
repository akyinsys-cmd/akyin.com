/**
 * AKYIN VENTURES — Google Apps Script Backend
 * Integrates Google Sheets (7 tabs), Google Calendar, MailApp, LockService,
 * PropertiesService, and CacheService for https://akyin.com
 *
 * Timezone: Asia/Kolkata (IST)
 * Deployment: Web App -> Execute as: Me | Who has access: Anyone
 */

const TIMEZONE = 'Asia/Kolkata';
const SESSION_TTL_SECONDS = 1800; // 30 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_SECONDS = 900; // 15 minutes
const SESSION_CACHE_PREFIX = 'AKYIN_SESSION_';
const LOGIN_FAIL_PREFIX = 'AKYIN_FAIL_';

const PROP_KEYS = {
  SPREADSHEET_ID: 'AKYIN_SPREADSHEET_ID',
  CALENDAR_ID: 'AKYIN_CALENDAR_ID',
  ADMIN_HASH: 'AKYIN_ADMIN_HASH',
  ADMIN_SALT: 'AKYIN_ADMIN_SALT',
  ALLOWED_ORIGINS: 'AKYIN_ALLOWED_ORIGINS',
};

const SHEET_SCHEMAS = {
  Appointments: [
    'Booking ID',
    'Created At',
    'Customer Name',
    'Phone',
    'Email',
    'City',
    'Country',
    'Business Name',
    'Website',
    'Business Stage',
    'Consultation Topic',
    'Business Challenge',
    'Appointment Date',
    'Start Time',
    'End Time',
    'Payment Status',
    'Booking Status',
    'Admin Notes',
    'Calendar Event ID',
    'Updated At',
  ],
  Enquiries: [
    'Enquiry ID',
    'Created At',
    'Name',
    'Business',
    'Phone',
    'Email',
    'City',
    'Country',
    'Business Vertical',
    'Enquiry Type',
    'Message',
    'Enquiry Status',
    'Admin Notes',
  ],
  Availability: [
    'Day',
    'Enabled',
    'Start Time',
    'End Time',
    'Slot Duration',
    'Maximum Bookings',
  ],
  BlockedDates: ['Date', 'Reason', 'Created By', 'Created At'],
  WebsiteSettings: ['Key', 'Category', 'Value', 'Updated At'],
  Ventures: [
    'ID',
    'Title',
    'Slug',
    'Category',
    'Description',
    'External URL',
    'Image URL',
    'Active',
    'Sort Order',
  ],
  AdminLogs: ['Log ID', 'Timestamp', 'Actor', 'Action', 'Target ID', 'Summary'],
};

const VALID_BOOKING_STATUSES = [
  'Pending',
  'Contact Required',
  'Payment Awaited',
  'Payment Received',
  'Confirmed',
  'Completed',
  'Cancelled',
  'Rescheduled',
];

const VALID_PAYMENT_STATUSES = [
  'Payment Awaited',
  'Payment Received',
  'Not Required',
  'Refunded',
];

const VALID_ENQUIRY_STATUSES = [
  'New',
  'Contacted',
  'In Progress',
  'Resolved',
  'Archived',
];

const DEFAULT_SETTINGS = [
  ['advisoryHeadline', 'Business Advisory', 'Your Business. Your Vision. A Clearer Direction.'],
  ['advisorySubheadline', 'Business Advisory', 'Structured 1-on-1 commercial clarity, positioning, and growth planning sessions with AKYIN Ventures.'],
  ['consultationFee', 'Business Advisory', 'Contact Us for Consultation Fee.'],
  ['advisorySlotDuration', 'Business Advisory', '30'],
  ['advisoryMaxBookings', 'Business Advisory', '2'],
  ['notificationEmail', 'Contact Settings', 'connect@akyin.com'],
  ['contactEmail', 'Contact Settings', 'connect@akyin.com'],
  ['contactPhone', 'Contact Settings', '+91-6305694011'],
  ['whatsappNumber', 'Contact Settings', '916305694011'],
  ['heroHeadline', 'Website Settings', 'Building Ideas Into Businesses.'],
  ['heroSubheadline', 'Website Settings', 'AKYIN Ventures brings together diverse business initiatives across publishing, marketing, retail, digital technology, B2B commerce and business consulting.'],
  ['footerTagline', 'Website Settings', 'Parent corporate group bringing together operating ventures across publishing, automotive marketing, value retail, AI utility software, B2B stock commerce, and business consulting.'],
  ['brandWordmark', 'Branding', 'AKYIN'],
  ['logoUrl', 'Branding', ''],
  ['instagramUrl', 'Social Links', 'https://www.instagram.com/akyinmarketing/'],
  ['facebookUrl', 'Social Links', 'https://www.facebook.com/akyinmarketing/'],
  ['xUrl', 'Social Links', 'https://x.com/akyinmarketing'],
  ['youtubeUrl', 'Social Links', 'https://www.youtube.com/@akyinmarketing'],
  ['amazonUrl', 'Social Links', 'https://www.amazon.com/stores/Akyin-S/author/B0H6SY7N3T'],
  ['googlePlayBooksUrl', 'Social Links', 'https://play.google.com/store/books/details/Akyin_s_THE_DISCIPLINE_CODE?id=seHuEQAAQBAJ'],
];

const DEFAULT_AVAILABILITY = [
  ['Monday', true, '18:00', '19:00', 30, 2],
  ['Tuesday', true, '18:00', '19:00', 30, 2],
  ['Wednesday', true, '18:00', '19:00', 30, 2],
  ['Thursday', true, '18:00', '19:00', 30, 2],
  ['Friday', true, '18:00', '19:00', 30, 2],
  ['Saturday', true, '18:00', '19:00', 30, 2],
  ['Sunday', true, '18:00', '19:00', 30, 2],
];

const DEFAULT_VENTURES = [
  ['publishing', 'AKYIN Publishing', '/ventures/publishing', 'Book & Digital Publishing', 'Independent book and digital publishing initiative creating and distributing titles across Amazon and Google Play Books.', 'https://www.amazon.com/stores/Akyin-S/author/B0H6SY7N3T', '', true, 1],
  ['marketing', 'AKYIN Marketing', '/ventures/marketing', 'Automotive Marketing & Sales Training', 'Specialized automotive marketing division helping dealerships attract buyers, qualify enquiries, and train showroom sales teams.', '', '', true, 2],
  ['store', 'AKYIN Store · AKYIN Thrift', '/ventures/store', 'Clothing & Fashion Retail', 'Consumer clothing retail brand featuring AKYIN THRIFT, focused on curated men’s and women’s apparel at exceptional discounted prices.', '', '', true, 3],
  ['aicalc', 'AICalc.in', '/ventures/aicalc', 'AI Utility & Calculator Technology', 'Independent web platform enabling users to solve calculation problems using natural-language AI queries alongside manual tools.', 'https://aicalc.in', '', true, 4],
  ['kartigo', 'Kartigo.online', '/ventures/kartigo', 'B2B Stock Supply & Commerce', 'Dedicated B2B-oriented stock supply platform supporting business buyers and wholesale suppliers.', 'https://kartigo.online', '', true, 5],
  ['biznxt', 'BizNXT.online', '/ventures/biznxt', 'Business Guidance & Consulting', 'BizNXT focuses on business guidance, consulting and helping entrepreneurs explore business opportunities and make informed decisions.', 'https://biznxt.online', '', true, 6],
  ['budget-bazaar', 'Budget Bazaar', '/ventures/budget-bazaar', 'Affordable Retail & Everyday Goods', 'Value-driven consumer retail venture offering everyday essentials and affordable household products through budgetbazaar.org.', 'https://budgetbazaar.org', '', true, 7],
];

/**
 * Web App Entry Points
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const view = String(params.view || '').trim();
    const action = String(params.action || '').trim();

    if (view === 'booking') {
      return HtmlService.createTemplateFromFile('PublicBooking')
        .evaluate()
        .setTitle('AKYIN Business Advisory — Consultation Booking')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    if (view === 'admin') {
      return HtmlService.createTemplateFromFile('AdminPortal')
        .evaluate()
        .setTitle('AKYIN Ventures — Admin Portal')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    if (action === 'bootstrap') {
      return jsonResponse({ ok: true, data: getPublicBootstrap_() });
    }

    if (action === 'availability') {
      const dateStr = sanitizeStr_(params.date, 10);
      return jsonResponse({ ok: true, data: getAvailabilityForDate_(dateStr) });
    }

    if (action === 'adminStatus') {
      return jsonResponse({
        ok: true,
        data: {
          passwordConfigured: isAdminPasswordConfigured_(),
          spreadsheetReady: Boolean(getSpreadsheetIdSafe_()),
          timezone: TIMEZONE,
        },
      });
    }

    return jsonResponse({
      ok: true,
      service: 'AKYIN Ventures Apps Script API',
      timezone: TIMEZONE,
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Server error' });
  }
}

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const body = JSON.parse(raw);
    const action = sanitizeStr_(body.action, 50);

    switch (action) {
      case 'bookAppointment':
        return jsonResponse({ ok: true, data: createPublicBooking_(body.payload || {}) });

      case 'submitEnquiry':
        return jsonResponse({ ok: true, data: createPublicEnquiry_(body.payload || {}) });

      case 'setupAdminPassword':
        return jsonResponse({ ok: true, data: setupInitialAdminPassword_(body.password) });

      case 'adminLogin':
        return jsonResponse({ ok: true, data: authenticateAdmin_(body.password) });

      case 'adminLogout':
        return jsonResponse({ ok: true, data: logoutAdmin_(body.token) });

      case 'validateSession':
        requireAdminSession_(body.token);
        return jsonResponse({ ok: true, data: { valid: true } });

      case 'getAdminDashboard':
        requireAdminSession_(body.token);
        return jsonResponse({ ok: true, data: getAdminDashboardData_() });

      case 'saveAppointment':
        requireAdminSession_(body.token);
        return jsonResponse({ ok: true, data: adminSaveAppointment_(body.payload || {}) });

      case 'saveAvailability':
        requireAdminSession_(body.token);
        return jsonResponse({ ok: true, data: adminSaveAvailability_(body.rules || []) });

      case 'blockDate':
        requireAdminSession_(body.token);
        return jsonResponse({ ok: true, data: adminBlockDate_(body.date, body.reason) });

      case 'unblockDate':
        requireAdminSession_(body.token);
        return jsonResponse({ ok: true, data: adminUnblockDate_(body.date) });

      case 'updateEnquiry':
        requireAdminSession_(body.token);
        return jsonResponse({ ok: true, data: adminUpdateEnquiry_(body.payload || {}) });

      case 'saveWebsiteSettings':
        requireAdminSession_(body.token);
        return jsonResponse({ ok: true, data: adminSaveWebsiteSettings_(body.settings || {}) });

      case 'saveVentures':
        requireAdminSession_(body.token);
        return jsonResponse({ ok: true, data: adminSaveVentures_(body.ventures || []) });

      case 'changeAdminPassword':
        requireAdminSession_(body.token);
        return jsonResponse({
          ok: true,
          data: adminChangePassword_(body.currentPassword, body.newPassword),
        });

      case 'sendTestEmail':
        requireAdminSession_(body.token);
        return jsonResponse({ ok: true, data: sendTestAdminEmail_() });

      default:
        throw new Error('Unsupported action.');
    }
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || 'Request failed.' });
  }
}

/**
 * Spreadsheet & Tab Auto-Initialization
 */
function getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  let ssId = props.getProperty(PROP_KEYS.SPREADSHEET_ID);
  let ss = null;

  if (ssId) {
    try {
      ss = SpreadsheetApp.openById(ssId);
    } catch (e) {
      ss = null;
    }
  }

  if (!ss) {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
      ss = null;
    }
  }

  if (!ss) {
    ss = SpreadsheetApp.create('AKYIN Ventures Operations Database');
  }

  if (ss.getId() !== ssId) {
    props.setProperty(PROP_KEYS.SPREADSHEET_ID, ss.getId());
  }

  ensureAllTabs_(ss);
  return ss;
}

function getSpreadsheetIdSafe_() {
  return PropertiesService.getScriptProperties().getProperty(PROP_KEYS.SPREADSHEET_ID) || '';
}

function ensureAllTabs_(ss) {
  const nowStr = formatNowIst_();

  Object.keys(SHEET_SCHEMAS).forEach(function (tabName) {
    let sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
    }

    const headers = SHEET_SCHEMAS[tabName];
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);

      if (tabName === 'Availability') {
        sheet.getRange(2, 1, DEFAULT_AVAILABILITY.length, headers.length).setValues(DEFAULT_AVAILABILITY);
      } else if (tabName === 'WebsiteSettings') {
        const rows = DEFAULT_SETTINGS.map(function (item) {
          return [item[0], item[1], item[2], nowStr];
        });
        sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      } else if (tabName === 'Ventures') {
        sheet.getRange(2, 1, DEFAULT_VENTURES.length, headers.length).setValues(DEFAULT_VENTURES);
      }
    }
  });
}

/**
 * Public Bootstrap & IST Availability Engine
 */
function getPublicBootstrap_() {
  const ss = getSpreadsheet_();
  const settingsMap = readWebsiteSettingsMap_(ss);
  const ventures = readVentures_(ss).filter(function (v) {
    return v.active;
  });
  const availability = readAvailabilityRules_(ss);
  const blockedDates = readBlockedDates_(ss).map(function (b) {
    return b.date;
  });

  return {
    settings: settingsMap,
    ventures: ventures,
    availability: availability,
    blockedDates: blockedDates,
    timezone: TIMEZONE,
    passwordConfigured: isAdminPasswordConfigured_(),
  };
}

function getAvailabilityForDate_(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error('Please choose a valid YYYY-MM-DD date.');
  }

  const ss = getSpreadsheet_();
  const settings = readWebsiteSettingsMap_(ss);
  const todayIst = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd');
  if (dateStr < todayIst) {
    return {
      date: dateStr,
      blocked: true,
      reason: 'Past dates cannot be booked.',
      slots: [],
      consultationFee: settings.consultationFee || 'Contact Us for Consultation Fee.',
    };
  }

  const blocked = readBlockedDates_(ss).find(function (b) {
    return b.date === dateStr;
  });
  if (blocked) {
    return {
      date: dateStr,
      blocked: true,
      reason: blocked.reason || 'This date is currently unavailable.',
      slots: [],
      consultationFee: settings.consultationFee || 'Contact Us for Consultation Fee.',
    };
  }

  const dayName = getDayNameIst_(dateStr);
  const rules = readAvailabilityRules_(ss);
  const rule = rules.find(function (r) {
    return r.day === dayName;
  });

  if (!rule || !rule.enabled) {
    return {
      date: dateStr,
      blocked: true,
      reason: 'Advisory consultations are not scheduled on ' + dayName + '.',
      slots: [],
      consultationFee: settings.consultationFee || 'Contact Us for Consultation Fee.',
    };
  }

  const slots = buildIntervals_(rule.startTime, rule.endTime, Number(rule.slotDuration) || 30);
  const appointments = readAppointments_(ss).filter(function (a) {
    return (
      a.appointmentDate === dateStr &&
      a.bookingStatus !== 'Cancelled'
    );
  });

  const maxBookings = Math.max(1, Number(rule.maximumBookings) || 2);
  if (appointments.length >= maxBookings) {
    return {
      date: dateStr,
      blocked: false,
      reason: 'Daily consultation capacity reached for this date.',
      slots: slots.map(function (s) {
        return {
          startTime: s.startTime,
          endTime: s.endTime,
          label: formatTimeRange12h_(s.startTime, s.endTime),
          available: false,
          reason: 'Booked',
        };
      }),
      consultationFee: settings.consultationFee || 'Contact Us for Consultation Fee.',
    };
  }

  const nowMinutesIst = getCurrentMinutesIst_();
  const calendarBusy = getCalendarBusyIntervals_(dateStr);

  const computedSlots = slots.map(function (s) {
    const startMin = parseHmMinutes_(s.startTime);
    const endMin = parseHmMinutes_(s.endTime);

    if (dateStr === todayIst && startMin <= nowMinutesIst + 15) {
      return {
        startTime: s.startTime,
        endTime: s.endTime,
        label: formatTimeRange12h_(s.startTime, s.endTime),
        available: false,
        reason: 'Elapsed',
      };
    }

    const isTakenByBooking = appointments.some(function (a) {
      return a.startTime === s.startTime;
    });

    const isBusyInCalendar = calendarBusy.some(function (evt) {
      return startMin < evt.endMin && endMin > evt.startMin;
    });

    return {
      startTime: s.startTime,
      endTime: s.endTime,
      label: formatTimeRange12h_(s.startTime, s.endTime),
      available: !isTakenByBooking && !isBusyInCalendar,
      reason: isTakenByBooking ? 'Reserved' : isBusyInCalendar ? 'Unavailable' : 'Available',
    };
  });

  return {
    date: dateStr,
    blocked: false,
    reason: '',
    slots: computedSlots,
    consultationFee: settings.consultationFee || 'Contact Us for Consultation Fee.',
  };
}

/**
 * Atomic Booking Creation (LockService + CalendarApp + MailApp)
 */
function createPublicBooking_(raw) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    throw new Error('Booking desk is temporarily busy. Please try again in a few seconds.');
  }

  try {
    const ss = getSpreadsheet_();
    const settings = readWebsiteSettingsMap_(ss);

    const payload = {
      customerName: requireText_(raw.customerName, 2, 100, 'Customer Name'),
      phone: requirePhone_(raw.phone),
      email: requireEmail_(raw.email),
      city: requireText_(raw.city, 2, 80, 'City'),
      country: requireText_(raw.country, 2, 80, 'Country'),
      businessName: sanitizeStr_(raw.businessName, 120),
      website: sanitizeSafeUrl_(raw.website),
      businessStage: requireText_(raw.businessStage, 2, 80, 'Business Stage'),
      consultationTopic: requireText_(raw.consultationTopic, 2, 120, 'Consultation Topic'),
      businessChallenge: requireText_(raw.businessChallenge, 10, 1500, 'Business Challenge'),
      appointmentDate: sanitizeStr_(raw.appointmentDate, 10),
      startTime: sanitizeStr_(raw.startTime, 5),
      endTime: sanitizeStr_(raw.endTime, 5),
    };

    const availability = getAvailabilityForDate_(payload.appointmentDate);
    if (availability.blocked) {
      throw new Error(availability.reason || 'Selected date is unavailable.');
    }

    const chosenSlot = availability.slots.find(function (s) {
      return s.startTime === payload.startTime && s.endTime === payload.endTime;
    });

    if (!chosenSlot || !chosenSlot.available) {
      throw new Error('The selected time slot is no longer available. Please choose another slot.');
    }

    // Duplicate booking guard (same email/phone + date + slot while active)
    const existing = readAppointments_(ss);
    const duplicate = existing.find(function (a) {
      return (
        a.bookingStatus !== 'Cancelled' &&
        a.appointmentDate === payload.appointmentDate &&
        a.startTime === payload.startTime &&
        (a.email.toLowerCase() === payload.email.toLowerCase() ||
          a.phone.replace(/\D/g, '') === payload.phone.replace(/\D/g, ''))
      );
    });
    if (duplicate) {
      throw new Error('A consultation request for this slot already exists (' + duplicate.bookingId + ').');
    }

    const bookingId = generateId_('AKY');
    const nowStr = formatNowIst_();
    let calendarEventId = '';

    try {
      const cal = getTargetCalendar_();
      const startDt = combineIstDateTime_(payload.appointmentDate, payload.startTime);
      const endDt = combineIstDateTime_(payload.appointmentDate, payload.endTime);
      const evt = cal.createEvent(
        '[Pending Verification] AKYIN Advisory – ' + payload.customerName + ' (' + bookingId + ')',
        startDt,
        endDt,
        {
          description:
            'Booking ID: ' + bookingId + '\n' +
            'Topic: ' + payload.consultationTopic + '\n' +
            'Business: ' + (payload.businessName || 'Not specified') + '\n' +
            'Phone: ' + payload.phone + '\n' +
            'Email: ' + payload.email + '\n' +
            'Status: Pending Payment Verification',
        }
      );
      calendarEventId = evt.getId();
    } catch (calErr) {
      calendarEventId = '';
    }

    const sheet = ss.getSheetByName('Appointments');
    sheet.appendRow([
      escapeFormula_(bookingId),
      nowStr,
      escapeFormula_(payload.customerName),
      escapeFormula_(payload.phone),
      escapeFormula_(payload.email),
      escapeFormula_(payload.city),
      escapeFormula_(payload.country),
      escapeFormula_(payload.businessName),
      escapeFormula_(payload.website),
      escapeFormula_(payload.businessStage),
      escapeFormula_(payload.consultationTopic),
      escapeFormula_(payload.businessChallenge),
      payload.appointmentDate,
      payload.startTime,
      payload.endTime,
      'Payment Awaited',
      'Pending',
      '',
      calendarEventId,
      nowStr,
    ]);

    const emailReport = sendBookingEmails_(bookingId, payload, settings);

    return {
      bookingId: bookingId,
      bookingStatus: 'Pending',
      paymentStatus: 'Payment Awaited',
      slotLabel: formatTimeRange12h_(payload.appointmentDate ? payload.startTime : '18:00', payload.endTime),
      appointmentDate: payload.appointmentDate,
      startTime: payload.startTime,
      endTime: payload.endTime,
      calendarEventCreated: Boolean(calendarEventId),
      emailStatus: emailReport,
      confirmationNotice:
        'Your appointment request has been received. Our team will contact you to discuss the consultation and payment confirmation. Your appointment is not confirmed until AKYIN verifies payment.',
    };
  } finally {
    lock.releaseLock();
  }
}

function createPublicEnquiry_(raw) {
  const ss = getSpreadsheet_();
  const settings = readWebsiteSettingsMap_(ss);
  const enquiryId = generateId_('ENQ');
  const nowStr = formatNowIst_();

  const name = requireText_(raw.name, 2, 100, 'Name');
  const business = sanitizeStr_(raw.company || raw.business, 120);
  const phone = requirePhone_(raw.phone);
  const email = requireEmail_(raw.email);
  const city = requireText_(raw.city, 2, 80, 'City');
  const country = requireText_(raw.country, 2, 80, 'Country');
  const vertical = sanitizeStr_(raw.vertical, 120);
  const enquiryType = sanitizeStr_(raw.enquiryType, 160);
  const message = sanitizeStr_(raw.message, 1500);

  ss.getSheetByName('Enquiries').appendRow([
    escapeFormula_(enquiryId),
    nowStr,
    escapeFormula_(name),
    escapeFormula_(business),
    escapeFormula_(phone),
    escapeFormula_(email),
    escapeFormula_(city),
    escapeFormula_(country),
    escapeFormula_(vertical),
    escapeFormula_(enquiryType),
    escapeFormula_(message),
    'New',
    '',
  ]);

  let emailStatus = { adminNotified: false, error: '' };
  try {
    const adminEmail = settings.notificationEmail || 'connect@akyin.com';
    MailApp.sendEmail({
      to: adminEmail,
      subject: '[AKYIN Enquiry ' + enquiryId + '] ' + vertical + ' — ' + name,
      body:
        'New enquiry submitted via akyin.com\n\n' +
        'Enquiry ID: ' + enquiryId + '\n' +
        'Name: ' + name + '\n' +
        'Business: ' + (business || 'Not specified') + '\n' +
        'Phone: ' + phone + '\n' +
        'Email: ' + email + '\n' +
        'Location: ' + city + ', ' + country + '\n' +
        'Vertical: ' + vertical + '\n' +
        'Type: ' + enquiryType + '\n\n' +
        'Message:\n' + (message || '(None)') + '\n',
    });
    emailStatus.adminNotified = true;
  } catch (err) {
    emailStatus.error = err.message || 'MailApp quota or permission issue.';
  }

  return {
    enquiryId: enquiryId,
    createdAt: nowStr,
    emailStatus: emailStatus,
  };
}

/**
 * Admin Authentication & Session Management (PropertiesService + CacheService)
 */
function isAdminPasswordConfigured_() {
  const props = PropertiesService.getScriptProperties();
  return Boolean(props.getProperty(PROP_KEYS.ADMIN_HASH) && props.getProperty(PROP_KEYS.ADMIN_SALT));
}

function setupInitialAdminPassword_(password) {
  if (isAdminPasswordConfigured_()) {
    throw new Error('Admin password is already configured. Please sign in.');
  }
  const clean = String(password || '');
  if (clean.length < 8) {
    throw new Error('Admin password must be at least 8 characters long.');
  }

  const salt = Utilities.getUuid();
  const hash = hashPassword_(clean, salt);
  const props = PropertiesService.getScriptProperties();
  props.setProperty(PROP_KEYS.ADMIN_SALT, salt);
  props.setProperty(PROP_KEYS.ADMIN_HASH, hash);

  const ss = getSpreadsheet_();
  appendAdminLog_(ss, 'Owner', 'INITIAL_SETUP', 'ADMIN_SECURITY', 'Configured initial admin password.');
  return issueSessionToken_();
}

function authenticateAdmin_(password) {
  const cache = CacheService.getScriptCache();
  const failKey = LOGIN_FAIL_PREFIX + 'OWNER';
  const failCount = Number(cache.get(failKey) || '0');
  if (failCount >= MAX_LOGIN_ATTEMPTS) {
    throw new Error('Too many failed sign-in attempts. Please wait 15 minutes before trying again.');
  }

  const props = PropertiesService.getScriptProperties();
  const salt = props.getProperty(PROP_KEYS.ADMIN_SALT);
  const expectedHash = props.getProperty(PROP_KEYS.ADMIN_HASH);
  if (!salt || !expectedHash) {
    throw new Error('Admin password is not configured yet.');
  }

  const actualHash = hashPassword_(String(password || ''), salt);
  if (actualHash !== expectedHash) {
    cache.put(failKey, String(failCount + 1), LOGIN_LOCKOUT_SECONDS);
    throw new Error('Invalid administrator password.');
  }

  cache.remove(failKey);
  const ss = getSpreadsheet_();
  appendAdminLog_(ss, 'Owner', 'ADMIN_LOGIN', 'SESSION', 'Administrator signed in.');
  return issueSessionToken_();
}

function logoutAdmin_(token) {
  if (token) {
    CacheService.getScriptCache().remove(SESSION_CACHE_PREFIX + String(token));
  }
  return { loggedOut: true };
}

function requireAdminSession_(token) {
  const clean = String(token || '').trim();
  if (!clean) {
    throw new Error('Authentication required.');
  }
  const cache = CacheService.getScriptCache();
  const valid = cache.get(SESSION_CACHE_PREFIX + clean);
  if (!valid) {
    throw new Error('Session expired or invalid. Please sign in again.');
  }
  // Sliding expiration refresh
  cache.put(SESSION_CACHE_PREFIX + clean, valid, SESSION_TTL_SECONDS);
  return true;
}

function issueSessionToken_() {
  const token = Utilities.getUuid() + '-' + Utilities.getUuid();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  CacheService.getScriptCache().put(
    SESSION_CACHE_PREFIX + token,
    'OWNER',
    SESSION_TTL_SECONDS
  );
  return { token: token, expiresAt: expiresAt };
}

function hashPassword_(password, salt) {
  let digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    salt + ':' + password + ':AKYIN_V1',
    Utilities.Charset.UTF_8
  );
  for (let i = 0; i < 64; i++) {
    const hex = toHex_(digest);
    digest = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      hex + ':' + salt,
      Utilities.Charset.UTF_8
    );
  }
  return toHex_(digest);
}

/**
 * Admin Workspace Operations
 */
function getAdminDashboardData_() {
  const ss = getSpreadsheet_();
  return {
    appointments: readAppointments_(ss),
    enquiries: readEnquiries_(ss),
    availability: readAvailabilityRules_(ss),
    blockedDates: readBlockedDates_(ss),
    settings: readWebsiteSettingsMap_(ss),
    ventures: readVentures_(ss),
    logs: readAdminLogs_(ss),
    timezone: TIMEZONE,
  };
}

function adminSaveAppointment_(payload) {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName('Appointments');
  const rows = readAppointments_(ss);
  const nowStr = formatNowIst_();

  const bookingStatus = VALID_BOOKING_STATUSES.indexOf(payload.bookingStatus) >= 0
    ? payload.bookingStatus
    : 'Pending';
  const paymentStatus = VALID_PAYMENT_STATUSES.indexOf(payload.paymentStatus) >= 0
    ? payload.paymentStatus
    : 'Payment Awaited';

  const existing = payload.bookingId
    ? rows.find(function (r) { return r.bookingId === payload.bookingId; })
    : null;

  if (!existing) {
    const bookingId = generateId_('AKY');
    let calendarEventId = '';
    try {
      const cal = getTargetCalendar_();
      const evt = cal.createEvent(
        '[' + bookingStatus + '] AKYIN Advisory – ' + sanitizeStr_(payload.customerName, 100) + ' (' + bookingId + ')',
        combineIstDateTime_(payload.appointmentDate, payload.startTime),
        combineIstDateTime_(payload.appointmentDate, payload.endTime),
        { description: 'Manual admin booking ' + bookingId }
      );
      calendarEventId = evt.getId();
    } catch (e) {
      calendarEventId = '';
    }

    sheet.appendRow([
      escapeFormula_(bookingId),
      nowStr,
      escapeFormula_(sanitizeStr_(payload.customerName, 100)),
      escapeFormula_(sanitizeStr_(payload.phone, 24)),
      escapeFormula_(sanitizeStr_(payload.email, 160)),
      escapeFormula_(sanitizeStr_(payload.city, 80)),
      escapeFormula_(sanitizeStr_(payload.country, 80)),
      escapeFormula_(sanitizeStr_(payload.businessName, 120)),
      escapeFormula_(sanitizeSafeUrl_(payload.website)),
      escapeFormula_(sanitizeStr_(payload.businessStage, 80)),
      escapeFormula_(sanitizeStr_(payload.consultationTopic, 120)),
      escapeFormula_(sanitizeStr_(payload.businessChallenge, 1500)),
      sanitizeStr_(payload.appointmentDate, 10),
      sanitizeStr_(payload.startTime, 5),
      sanitizeStr_(payload.endTime, 5),
      paymentStatus,
      bookingStatus,
      escapeFormula_(sanitizeStr_(payload.adminNotes, 1000)),
      calendarEventId,
      nowStr,
    ]);
    appendAdminLog_(ss, 'Owner', 'CREATE_APPOINTMENT', bookingId, 'Added appointment (' + bookingStatus + ').');
    return { bookingId: bookingId };
  }

  const rowIdx = existing._rowIndex;
  let calendarEventId = existing.calendarEventId;
  if (calendarEventId) {
    try {
      const cal = getTargetCalendar_();
      const evt = cal.getEventById(calendarEventId);
      if (evt) {
        if (bookingStatus === 'Cancelled') {
          evt.deleteEvent();
          calendarEventId = '';
        } else {
          evt.setTitle('[' + bookingStatus + '] AKYIN Advisory – ' + sanitizeStr_(payload.customerName || existing.customerName, 100) + ' (' + existing.bookingId + ')');
          if (payload.appointmentDate && payload.startTime && payload.endTime) {
            evt.setTime(
              combineIstDateTime_(payload.appointmentDate, payload.startTime),
              combineIstDateTime_(payload.appointmentDate, payload.endTime)
            );
          }
        }
      }
    } catch (e) {
      // Preserve spreadsheet update even if calendar item was removed externally
    }
  }

  sheet.getRange(rowIdx, 3, 1, 18).setValues([[
    escapeFormula_(sanitizeStr_(payload.customerName || existing.customerName, 100)),
    escapeFormula_(sanitizeStr_(payload.phone || existing.phone, 24)),
    escapeFormula_(sanitizeStr_(payload.email || existing.email, 160)),
    escapeFormula_(sanitizeStr_(payload.city || existing.city, 80)),
    escapeFormula_(sanitizeStr_(payload.country || existing.country, 80)),
    escapeFormula_(sanitizeStr_(payload.businessName !== undefined ? payload.businessName : existing.businessName, 120)),
    escapeFormula_(sanitizeSafeUrl_(payload.website !== undefined ? payload.website : existing.website)),
    escapeFormula_(sanitizeStr_(payload.businessStage || existing.businessStage, 80)),
    escapeFormula_(sanitizeStr_(payload.consultationTopic || existing.consultationTopic, 120)),
    escapeFormula_(sanitizeStr_(payload.businessChallenge !== undefined ? payload.businessChallenge : existing.businessChallenge, 1500)),
    sanitizeStr_(payload.appointmentDate || existing.appointmentDate, 10),
    sanitizeStr_(payload.startTime || existing.startTime, 5),
    sanitizeStr_(payload.endTime || existing.endTime, 5),
    paymentStatus,
    bookingStatus,
    escapeFormula_(sanitizeStr_(payload.adminNotes !== undefined ? payload.adminNotes : existing.adminNotes, 1000)),
    calendarEventId,
    nowStr,
  ]]);

  appendAdminLog_(ss, 'Owner', 'UPDATE_APPOINTMENT', existing.bookingId, 'Status: ' + bookingStatus + ', Payment: ' + paymentStatus);
  return { bookingId: existing.bookingId };
}

function adminSaveAvailability_(rules) {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName('Availability');
  const existingAppointments = readAppointments_(ss).filter(function (a) {
    return a.bookingStatus === 'Confirmed' || a.bookingStatus === 'Pending';
  });

  const rows = rules.map(function (r) {
    return [
      sanitizeStr_(r.day, 20),
      Boolean(r.enabled),
      sanitizeStr_(r.startTime, 5),
      sanitizeStr_(r.endTime, 5),
      Math.max(15, Math.min(120, Number(r.slotDuration) || 30)),
      Math.max(1, Math.min(20, Number(r.maximumBookings) || 2)),
    ];
  });

  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).clearContent();
  }
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 6).setValues(rows);
  }
  appendAdminLog_(ss, 'Owner', 'UPDATE_AVAILABILITY', 'WEEKLY_SCHEDULE', 'Updated weekly availability rules.');
  return { updated: rows.length, activeBookingsProtected: existingAppointments.length };
}

function adminBlockDate_(dateStr, reason) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr || ''))) {
    throw new Error('Invalid date format.');
  }
  const ss = getSpreadsheet_();
  const existingConfirmed = readAppointments_(ss).filter(function (a) {
    return a.appointmentDate === dateStr && (a.bookingStatus === 'Confirmed' || a.bookingStatus === 'Pending');
  });

  const sheet = ss.getSheetByName('BlockedDates');
  const current = readBlockedDates_(ss);
  if (!current.some(function (b) { return b.date === dateStr; })) {
    sheet.appendRow([
      dateStr,
      escapeFormula_(sanitizeStr_(reason || 'Unavailable', 200)),
      'Owner',
      formatNowIst_(),
    ]);
  }
  appendAdminLog_(ss, 'Owner', 'BLOCK_DATE', dateStr, sanitizeStr_(reason, 120));
  return {
    blocked: dateStr,
    conflictWarningCount: existingConfirmed.length,
  };
}

function adminUnblockDate_(dateStr) {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName('BlockedDates');
  const rows = readBlockedDates_(ss);
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i].date === dateStr) {
      sheet.deleteRow(rows[i]._rowIndex);
    }
  }
  appendAdminLog_(ss, 'Owner', 'UNBLOCK_DATE', String(dateStr), 'Unblocked calendar date.');
  return { unblocked: dateStr };
}

function adminUpdateEnquiry_(payload) {
  const ss = getSpreadsheet_();
  const rows = readEnquiries_(ss);
  const target = rows.find(function (r) { return r.enquiryId === payload.enquiryId; });
  if (!target) {
    throw new Error('Enquiry record not found.');
  }
  const status = VALID_ENQUIRY_STATUSES.indexOf(payload.enquiryStatus) >= 0
    ? payload.enquiryStatus
    : target.enquiryStatus;
  const notes = sanitizeStr_(payload.adminNotes !== undefined ? payload.adminNotes : target.adminNotes, 1000);
  ss.getSheetByName('Enquiries').getRange(target._rowIndex, 12, 1, 2).setValues([[status, escapeFormula_(notes)]]);
  appendAdminLog_(ss, 'Owner', 'UPDATE_ENQUIRY', target.enquiryId, 'Status: ' + status);
  return { enquiryId: target.enquiryId, enquiryStatus: status };
}

function adminSaveWebsiteSettings_(settings) {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName('WebsiteSettings');
  const nowStr = formatNowIst_();
  const keys = Object.keys(settings || {});
  const data = sheet.getDataRange().getValues();

  keys.forEach(function (k) {
    const cleanKey = sanitizeStr_(k, 80);
    const cleanVal = sanitizeStr_(String(settings[k] || ''), 2000);
    let foundRow = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === cleanKey) {
        foundRow = i + 1;
        break;
      }
    }
    if (foundRow > 0) {
      sheet.getRange(foundRow, 3, 1, 2).setValues([[escapeFormula_(cleanVal), nowStr]]);
    } else {
      sheet.appendRow([escapeFormula_(cleanKey), 'Website Settings', escapeFormula_(cleanVal), nowStr]);
    }
  });

  appendAdminLog_(ss, 'Owner', 'UPDATE_SETTINGS', 'WEBSITE_SETTINGS', 'Updated ' + keys.length + ' configuration keys.');
  return { savedKeys: keys.length };
}

function adminSaveVentures_(ventures) {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName('Ventures');
  const rows = (ventures || []).map(function (v, idx) {
    return [
      escapeFormula_(sanitizeStr_(v.id, 60)),
      escapeFormula_(sanitizeStr_(v.title, 120)),
      escapeFormula_(sanitizeStr_(v.slug, 120)),
      escapeFormula_(sanitizeStr_(v.category, 120)),
      escapeFormula_(sanitizeStr_(v.description, 1000)),
      escapeFormula_(sanitizeSafeUrl_(v.externalUrl)),
      escapeFormula_(sanitizeSafeUrl_(v.imageUrl)),
      Boolean(v.active),
      Number(v.sortOrder) || idx + 1,
    ];
  });
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).clearContent();
  }
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 9).setValues(rows);
  }
  appendAdminLog_(ss, 'Owner', 'UPDATE_VENTURES', 'VENTURES', 'Saved ' + rows.length + ' venture entries.');
  return { count: rows.length };
}

function adminChangePassword_(currentPassword, newPassword) {
  const props = PropertiesService.getScriptProperties();
  const salt = props.getProperty(PROP_KEYS.ADMIN_SALT);
  const expectedHash = props.getProperty(PROP_KEYS.ADMIN_HASH);
  if (hashPassword_(String(currentPassword || ''), salt) !== expectedHash) {
    throw new Error('Current password does not match.');
  }
  if (String(newPassword || '').length < 8) {
    throw new Error('New password must be at least 8 characters.');
  }
  const newSalt = Utilities.getUuid();
  props.setProperty(PROP_KEYS.ADMIN_SALT, newSalt);
  props.setProperty(PROP_KEYS.ADMIN_HASH, hashPassword_(String(newPassword), newSalt));

  const ss = getSpreadsheet_();
  appendAdminLog_(ss, 'Owner', 'ROTATE_PASSWORD', 'ADMIN_SECURITY', 'Rotated admin password.');
  return { updated: true };
}

function sendTestAdminEmail_() {
  const ss = getSpreadsheet_();
  const settings = readWebsiteSettingsMap_(ss);
  const to = settings.notificationEmail || 'connect@akyin.com';
  MailApp.sendEmail({
    to: to,
    subject: 'AKYIN Ventures — Admin Email Notification Verification',
    body: 'This is a verification notice confirming MailApp notifications are active for ' + to + ' (' + formatNowIst_() + ' IST).',
  });
  appendAdminLog_(ss, 'Owner', 'TEST_EMAIL', to, 'Dispatched test notification email.');
  return { sentTo: to };
}

/**
 * MailApp Notifications & Sheet Readers
 */
function sendBookingEmails_(bookingId, payload, settings) {
  const report = {
    customerNotified: false,
    adminNotified: false,
    error: '',
  };

  const slotLabel = formatTimeRange12h_(payload.startTime, payload.endTime);
  const feeLabel = settings.consultationFee || 'Contact Us for Consultation Fee.';
  const adminEmail = settings.notificationEmail || 'connect@akyin.com';

  try {
    MailApp.sendEmail({
      to: payload.email,
      subject: 'AKYIN Business Advisory Request Received (' + bookingId + ')',
      body:
        'Dear ' + payload.customerName + ',\n\n' +
        'Your appointment request has been received. Our team will contact you to discuss the consultation and payment confirmation. Your appointment is not confirmed until AKYIN verifies payment.\n\n' +
        'Booking Reference: ' + bookingId + '\n' +
        'Requested Date: ' + payload.appointmentDate + '\n' +
        'Requested Time (IST): ' + slotLabel + '\n' +
        'Consultation Topic: ' + payload.consultationTopic + '\n' +
        'Consultation Fee Info: ' + feeLabel + '\n\n' +
        'Warm regards,\nAKYIN Ventures\nhttps://akyin.com\n' +
        (settings.contactPhone || '+91-6305694011'),
    });
    report.customerNotified = true;
  } catch (err) {
    report.error = 'Customer email error: ' + err.message;
  }

  try {
    MailApp.sendEmail({
      to: adminEmail,
      subject: '[New Advisory Request ' + bookingId + '] ' + payload.customerName + ' (' + payload.appointmentDate + ')',
      body:
        'New Business Advisory appointment request received:\n\n' +
        'Booking ID: ' + bookingId + '\n' +
        'Name: ' + payload.customerName + '\n' +
        'Phone: ' + payload.phone + '\n' +
        'Email: ' + payload.email + '\n' +
        'Location: ' + payload.city + ', ' + payload.country + '\n' +
        'Business: ' + (payload.businessName || 'Not specified') + '\n' +
        'Website: ' + (payload.website || 'Not specified') + '\n' +
        'Stage: ' + payload.businessStage + '\n' +
        'Topic: ' + payload.consultationTopic + '\n' +
        'Requested Slot (IST): ' + payload.appointmentDate + ' · ' + slotLabel + '\n\n' +
        'Business Challenge:\n' + payload.businessChallenge + '\n',
    });
    report.adminNotified = true;
  } catch (err) {
    report.error = (report.error ? report.error + ' | ' : '') + 'Admin email error: ' + err.message;
  }

  return report;
}

function getTargetCalendar_() {
  const calId = PropertiesService.getScriptProperties().getProperty(PROP_KEYS.CALENDAR_ID);
  if (calId) {
    const cal = CalendarApp.getCalendarById(calId);
    if (cal) return cal;
  }
  return CalendarApp.getDefaultCalendar();
}

function getCalendarBusyIntervals_(dateStr) {
  try {
    const cal = getTargetCalendar_();
    const startOfDay = combineIstDateTime_(dateStr, '00:00');
    const endOfDay = combineIstDateTime_(dateStr, '23:59');
    const events = cal.getEvents(startOfDay, endOfDay);
    return events
      .filter(function (evt) {
        return !evt.isAllDayEvent();
      })
      .map(function (evt) {
        const sHm = Utilities.formatDate(evt.getStartTime(), TIMEZONE, 'HH:mm');
        const eHm = Utilities.formatDate(evt.getEndTime(), TIMEZONE, 'HH:mm');
        return {
          startMin: parseHmMinutes_(sHm),
          endMin: parseHmMinutes_(eHm),
        };
      });
  } catch (e) {
    return [];
  }
}

function readAppointments_(ss) {
  const sheet = ss.getSheetByName('Appointments');
  const values = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    if (!r[0]) continue;
    out.push({
      _rowIndex: i + 1,
      bookingId: String(r[0]),
      createdAt: String(r[1]),
      customerName: String(r[2]),
      phone: String(r[3]),
      email: String(r[4]),
      city: String(r[5]),
      country: String(r[6]),
      businessName: String(r[7]),
      website: String(r[8]),
      businessStage: String(r[9]),
      consultationTopic: String(r[10]),
      businessChallenge: String(r[11]),
      appointmentDate: formatDateCell_(r[12]),
      startTime: formatTimeCell_(r[13]),
      endTime: formatTimeCell_(r[14]),
      paymentStatus: String(r[15] || 'Payment Awaited'),
      bookingStatus: String(r[16] || 'Pending'),
      adminNotes: String(r[17] || ''),
      calendarEventId: String(r[18] || ''),
      updatedAt: String(r[19] || ''),
    });
  }
  return out.reverse();
}

function readEnquiries_(ss) {
  const values = ss.getSheetByName('Enquiries').getDataRange().getValues();
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    if (!r[0]) continue;
    out.push({
      _rowIndex: i + 1,
      enquiryId: String(r[0]),
      createdAt: String(r[1]),
      name: String(r[2]),
      business: String(r[3]),
      phone: String(r[4]),
      email: String(r[5]),
      city: String(r[6]),
      country: String(r[7]),
      vertical: String(r[8]),
      enquiryType: String(r[9]),
      message: String(r[10]),
      enquiryStatus: String(r[11] || 'New'),
      adminNotes: String(r[12] || ''),
    });
  }
  return out.reverse();
}

function readAvailabilityRules_(ss) {
  const values = ss.getSheetByName('Availability').getDataRange().getValues();
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    if (!r[0]) continue;
    out.push({
      day: String(r[0]),
      enabled: Boolean(r[1]),
      startTime: formatTimeCell_(r[2]),
      endTime: formatTimeCell_(r[3]),
      slotDuration: Number(r[4]) || 30,
      maximumBookings: Number(r[5]) || 2,
    });
  }
  return out;
}

function readBlockedDates_(ss) {
  const values = ss.getSheetByName('BlockedDates').getDataRange().getValues();
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    if (!r[0]) continue;
    out.push({
      _rowIndex: i + 1,
      date: formatDateCell_(r[0]),
      reason: String(r[1] || ''),
      createdBy: String(r[2] || 'Owner'),
      createdAt: String(r[3] || ''),
    });
  }
  return out;
}

function readWebsiteSettingsMap_(ss) {
  const values = ss.getSheetByName('WebsiteSettings').getDataRange().getValues();
  const map = {};
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    if (!r[0]) continue;
    map[String(r[0])] = String(r[2] || '');
  }
  return map;
}

function readVentures_(ss) {
  const values = ss.getSheetByName('Ventures').getDataRange().getValues();
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    if (!r[0]) continue;
    out.push({
      id: String(r[0]),
      title: String(r[1]),
      slug: String(r[2]),
      category: String(r[3]),
      description: String(r[4]),
      externalUrl: String(r[5] || ''),
      imageUrl: String(r[6] || ''),
      active: Boolean(r[7]),
      sortOrder: Number(r[8]) || i,
    });
  }
  return out.sort(function (a, b) { return a.sortOrder - b.sortOrder; });
}

function readAdminLogs_(ss) {
  const values = ss.getSheetByName('AdminLogs').getDataRange().getValues();
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    if (!r[0]) continue;
    out.push({
      logId: String(r[0]),
      timestamp: String(r[1]),
      actor: String(r[2]),
      action: String(r[3]),
      targetId: String(r[4]),
      summary: String(r[5]),
    });
  }
  return out.reverse().slice(0, 100);
}

function appendAdminLog_(ss, actor, action, targetId, summary) {
  ss.getSheetByName('AdminLogs').appendRow([
    generateId_('LOG'),
    formatNowIst_(),
    escapeFormula_(sanitizeStr_(actor, 40)),
    escapeFormula_(sanitizeStr_(action, 60)),
    escapeFormula_(sanitizeStr_(targetId, 80)),
    escapeFormula_(sanitizeStr_(summary, 300)),
  ]);
}

/**
 * Helpers & Sanitization
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function formatNowIst_() {
  return Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
}

function getDayNameIst_(dateStr) {
  const d = combineIstDateTime_(dateStr, '12:00');
  return Utilities.formatDate(d, TIMEZONE, 'EEEE');
}

function getCurrentMinutesIst_() {
  const hm = Utilities.formatDate(new Date(), TIMEZONE, 'HH:mm');
  return parseHmMinutes_(hm);
}

function combineIstDateTime_(dateStr, hmStr) {
  return new Date(dateStr + 'T' + hmStr + ':00+05:30');
}

function parseHmMinutes_(hm) {
  const parts = String(hm || '00:00').split(':');
  return Number(parts[0]) * 60 + Number(parts[1] || 0);
}

function buildIntervals_(startHm, endHm, stepMinutes) {
  const start = parseHmMinutes_(startHm);
  const end = parseHmMinutes_(endHm);
  const list = [];
  for (let m = start; m + stepMinutes <= end; m += stepMinutes) {
    list.push({
      startTime: minutesToHm_(m),
      endTime: minutesToHm_(m + stepMinutes),
    });
  }
  return list;
}

function minutesToHm_(total) {
  const hh = String(Math.floor(total / 60)).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return hh + ':' + mm;
}

function formatTimeRange12h_(startHm, endHm) {
  return to12h_(startHm) + ' – ' + to12h_(endHm) + ' IST';
}

function to12h_(hm) {
  const parts = String(hm || '18:00').split(':');
  let h = Number(parts[0]);
  const m = parts[1] || '00';
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + m + ' ' + suffix;
}

function formatDateCell_(val) {
  if (val instanceof Date) {
    return Utilities.formatDate(val, TIMEZONE, 'yyyy-MM-dd');
  }
  return String(val || '').slice(0, 10);
}

function formatTimeCell_(val) {
  if (val instanceof Date) {
    return Utilities.formatDate(val, TIMEZONE, 'HH:mm');
  }
  return String(val || '').slice(0, 5);
}

function generateId_(prefix) {
  const rand = Utilities.getUuid().replace(/-/g, '').slice(0, 6).toUpperCase();
  return prefix + '-' + rand;
}

function sanitizeStr_(val, maxLen) {
  return String(val || '')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
    .trim()
    .slice(0, maxLen || 200);
}

function escapeFormula_(str) {
  const s = String(str || '');
  if (/^[=+\-@\t\r]/.test(s)) {
    return "'" + s;
  }
  return s;
}

function sanitizeSafeUrl_(raw) {
  const s = sanitizeStr_(raw, 300);
  if (!s) return '';
  return /^https:\/\/[a-zA-Z0-9.-]+/.test(s) ? s : '';
}

function requireText_(val, minLen, maxLen, label) {
  const s = sanitizeStr_(val, maxLen);
  if (s.length < minLen) {
    throw new Error(label + ' must be at least ' + minLen + ' characters.');
  }
  return s;
}

function requireEmail_(val) {
  const s = sanitizeStr_(val, 160);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) {
    throw new Error('Please provide a valid email address.');
  }
  return s;
}

function requirePhone_(val) {
  const s = sanitizeStr_(val, 24);
  const digits = s.replace(/[\s\-()]/g, '');
  if (!/^\+?[0-9]{8,15}$/.test(digits)) {
    throw new Error('Please provide a valid phone number.');
  }
  return s;
}

function toHex_(bytes) {
  return bytes
    .map(function (b) {
      const v = (b + 256) % 256;
      return ('0' + v.toString(16)).slice(-2);
    })
    .join('');
}
