# Security Summary

**Reviewed Files**: 28  
**Issues Resolved**: 6  

### Issues Resolved

| Area | File | Line | What Was Happening | Impact | Status | How It Was Fixed |
|---|---|---|---|---|---|---|
| Missing Access Control in Apps Script Admin Portal | `apps-script/AdminPortal.html`, `apps-script/Code.gs` | `81–116`, `793–805` | The fallback Apps Script Admin HTML called internal `_`-suffixed functions (`authenticateAdmin_`, `getAdminDashboardData_`) without passing a session token, and `getAdminDashboardData_` did not validate a session inside the function. | High | Fixed | Added public wrappers `portalLogin(password)` and `portalGetDashboard(token)` that enforce `requireAdminSession_(token)` before returning dashboard records, and updated `AdminPortal.html` to pass `sessionToken` and clear the password field on submit. |
| Unrestricted Backend Endpoint Override | `src/utils/AkyinApiClient.ts` | `84–106` | `setEndpointUrl` and `getEndpointUrl` accepted any `https://` URL from browser storage, which could let a tampered endpoint capture admin sign-in passwords, tokens, and enquiry data. | High | Fixed | Restricted Apps Script endpoint URLs strictly to `https://script.google.com/macros/...` and `https://script.googleusercontent.com/...`. |
| Missing Rate Limiting, JSON Size Caps & Raw Error Leakage | `server.ts` | `237–318`, `534–785` | Express lacked IP rate limiting on paid/sensitive endpoints (`/api/automotive-news`, `/api/razorpay/*`, `/api/mcp`), lacked a tight JSON payload cap and syntax error handler, and forwarded raw upstream error messages in `/api/automotive-news`. | Medium | Fixed | Added sliding-window IP rate limiters, a 5-minute topic cache for news lookups, a `64kb` JSON body limit with a clean `400 INVALID_JSON` handler, tighter phone format validation, and sanitized client error responses. |
| Dotfile Exposure & Missing HTTP Security Headers | `server.ts`, `public/.htaccess` | `238–252`, `785–836`, `.htaccess:5–42` | Express served `dist/` with `dotfiles: 'allow'` (allowing `/.htaccess` downloads) and omitted baseline response security headers; `.htaccess` also lacked directory index blocking, sensitive file denial rules, `Permissions-Policy`, and `Strict-Transport-Security`. | Medium | Fixed | Switched static serving to `dotfiles: 'ignore'` (preserving `/.well-known/mcp/server-card.json`), disabled `x-powered-by`, added `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and HTTPS-conditional `Strict-Transport-Security`, cached `dist/index.html` in memory, and hardened `.htaccess`. |
| Admin Session Token Persistence & Weak Preview Hashing | `src/utils/AkyinApiClient.ts` | `112–154`, `488–550`, `938–995` | Admin session tokens were saved in persistent `localStorage`, preview password hashing used a single SHA-256 digest, and reference IDs used `Math.random()`. | Medium | Fixed | Moved admin session tokens to tab-scoped `sessionStorage` (purging legacy `localStorage` entries), upgraded preview password hashing to 100,000-iteration PBKDF2 with automatic upgrade from legacy preview hashes, and switched `randomId` to `crypto.getRandomValues`. |
| Unvalidated Admin Appointment Dates & Settings URLs | `apps-script/Code.gs` | `836–926`, `996–1025` | Manual admin appointment saves lacked `YYYY-MM-DD` / `HH:mm` validation, and `adminSaveWebsiteSettings_` stored URL settings without protocol allowlisting. | Medium | Fixed | Enforced `YYYY-MM-DD` and `HH:mm` format checks on create and update in `adminSaveAppointment_`, and sanitized URL settings keys with `sanitizeSafeUrl_`. |

### Safeguards Verified

| Area | File | How It's Protected |
|---|---|---|
| API Keys & Gateway Secrets | `.env.example`, `server.ts` | `GEMINI_API_KEY`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` are read strictly on the server from `process.env`; `.gitignore` excludes `.env*`. |
| Server-Authoritative Payments | `server.ts`, `src/data/paymentCatalog.ts` | Checkout amounts and `INR` currency are resolved server-side from `PAYMENT_CATALOG_BY_SKU`, and payment signatures are verified using HMAC-SHA256 with `crypto.timingSafeEqual`. |
| Cross-Site Scripting & Open Redirects | `src/utils/security.ts`, `src/components/ContactDispatcher.tsx`, `src/components/AutomotiveIndustryNews.tsx` | Zero raw HTML injection sinks (`dangerouslySetInnerHTML`, `eval`, `innerHTML`) exist in React source; external links pass through `sanitizeHref`, blocking `javascript:`, `data:`, and protocol-relative `//` URLs. |
| Cross-Origin Messaging (`postMessage`) | `src/pages/AdvisoryPage.tsx`, `apps-script/PublicBooking.html` | Parent listeners verify `event.origin` against the configured Apps Script origin and `https://script.googleusercontent.com`; child iframe posts explicitly to `https://akyin.com`. |
| Spreadsheet Formula Injection | `apps-script/Code.gs`, `src/components/admin/AdminEnquiriesPanel.tsx` | All user-supplied fields written to Google Sheets or exported to CSV prefix leading `=`, `+`, `-`, `@`, `\t`, or `\r` characters with `'`. |
| Google Workspace OAuth Tokens | `src/services/googleWorkspaceAuth.ts`, `src/components/admin/GoogleWorkspacePanel.tsx` | OAuth access tokens remain strictly in browser memory and mutating Calendar/Sheets operations require explicit modal confirmation. |

---

## PoC Verification

### 1. Missing Authorization on Apps Script Admin Portal Dashboard

#### Summary
| Field | Value |
|---|---|
| Issue Type | Missing Server-Side Sign-In Check |
| Impact | High |
| Affected File | `apps-script/AdminPortal.html:110`, `apps-script/Code.gs:793` |
| Test Scenario | Calling `portalGetDashboard("")` or `portalGetDashboard("invalid-token")` without a valid owner session token. |

#### How It Was Fixed
Added a dedicated public HtmlService wrapper `portalGetDashboard(token)` in `apps-script/Code.gs` that calls `requireAdminSession_(token)` before returning `getAdminDashboardData_()`, and updated `AdminPortal.html` to invoke `portalLogin` and `portalGetDashboard(sessionToken)`.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | Caller invokes `portalGetDashboard("")` or supplies an expired/invalid token. | Request enters `portalGetDashboard(token)` at `apps-script/Code.gs:797`. |
| 2 | `requireAdminSession_(token)` (`Code.gs:747-760`) trims the token and verifies it against `CacheService.getScriptCache()`. | Empty or unknown token throws `Authentication required.` / `Session expired or invalid.` |
| 3 | Execution aborts before `getAdminDashboardData_()` is reached. | **Handled Safely** |

#### Conclusion
**Fix Verified** - Dashboard appointments, enquiries, and admin logs cannot be read through the Apps Script portal wrapper without a valid server-cached session token.

---

### 2. Arbitrary External Endpoint Injection for Admin Credentials

#### Summary
| Field | Value |
|---|---|
| Issue Type | Untrusted Destination URL Binding |
| Impact | High |
| Affected File | `src/utils/AkyinApiClient.ts:84-118` |
| Test Scenario | Calling `akyinApiClient.setEndpointUrl("https://evil.example/collect")` or storing that URL in `localStorage`. |

#### How It Was Fixed
Added `isValidAppsScriptEndpoint()` in `src/utils/AkyinApiClient.ts` so both `setEndpointUrl()` and `getEndpointUrl()` reject any URL whose hostname is not `script.google.com` (under `/macros/`) or `script.googleusercontent.com`.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | `setEndpointUrl("https://evil.example/collect")` is called from UI or storage. | Reaches `isValidAppsScriptEndpoint()` at `src/utils/AkyinApiClient.ts:84`. |
| 2 | Hostname check compares `parsed.hostname` against `script.google.com` and `script.googleusercontent.com`. | Fails allowlist check and throws validation error (or returns `""` on read). |
| 3 | Client falls back safely without sending login credentials or PII to the untrusted domain. | **Handled Safely** |

#### Conclusion
**Fix Verified** - Admin passwords, session tokens, and enquiry payloads can only be dispatched to official Google Apps Script origins.

---

### 3. Dotfile Exposure, Malformed JSON & Unthrottled API Requests in Express

#### Summary
| Field | Value |
|---|---|
| Issue Type | Missing Rate Limiting & Exposed Configuration Dotfile |
| Impact | Medium |
| Affected File | `server.ts:242-345, 534, 775-785` |
| Test Scenario | Live HTTP requests against built production `server.js`: `GET /.htaccess`, `POST /api/razorpay/create-order` with `{bad_json`, and 21 rapid `POST /api/razorpay/create-order` requests. |

#### How It Was Fixed
Configured `app.use(express.static(distDir, { dotfiles: 'ignore' }))`, added a `64kb` JSON limit + `SyntaxError` handler returning `400 INVALID_JSON`, added baseline security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HTTPS `Strict-Transport-Security`), and enforced sliding-window IP rate limiting on `/api/razorpay/*`, `/api/automotive-news`, and `/api/mcp`.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | `GET /.htaccess` reaches `express.static(distDir, { dotfiles: 'ignore' })` (`server.ts:779`). | Static middleware ignores `.htaccess`; SPA fallback serves `index.html` (`HTACCESS_EXPOSED=false`). |
| 2 | `POST /api/razorpay/create-order` with `{bad_json` hits `express.json({ limit: '64kb' })` and the JSON error middleware (`server.ts:310-316`). | Returns HTTP `400` `{"error":"Invalid JSON request payload.","code":"INVALID_JSON"}` with no stack trace. |
| 3 | 21 consecutive `POST /api/razorpay/create-order` requests hit `paymentOrderRateLimiter` (`server.ts:532`). | Request #21 is blocked with HTTP `429`, `Retry-After: 60`, and `PAYMENT_RATE_LIMITED`. |

#### Conclusion
**Fix Verified** - Verified via live production server tests that configuration dotfiles are never disclosed, malformed JSON returns structured errors, and burst abuse triggers HTTP `429` throttling.
