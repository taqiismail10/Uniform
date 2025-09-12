# Testing Guide / QA Checklist

This guide outlines end-to-end testing steps for the Uniform project across backend and frontend, including PDF export, caching, and rate limiting.

## Prerequisites
- Node.js and npm installed
- Two terminals (backend and frontend)
- .env files configured (tokens/URLs as needed)

## Start The App
- Backend:
  - From `backend`: `npm install && npm run server`
  - Default port: `http://localhost:5000`
- Frontend:
  - From `uniform-frontend`: `npm install && npm run dev`
  - Default port: `http://localhost:5173`

---

## Backend Checks

### 1) Health + CORS
- GET `http://localhost:5000/` → `{ message: "Hello, it's working..." }`
- Confirm CORS allows `http://localhost:5173` (requests from the frontend succeed).

### 2) Rate Limiting (Student endpoints)
- Endpoint examples: `/api/auth/login`, `/api/auth/register`, student writes like `/api/applications`.
- Attempt >10 login posts within 15 minutes for the same email+IP → expect `429 Too Many Requests`.
- For write-heavy actions, exceed 120/hour per student → expect `429`.

### 3) User‑Scoped Caching
- Some GET routes are cached after auth (e.g., student eligibility, certain admin/system lists):
  - Make the same GET twice as the same authenticated user → second response should be faster and may include `X-Cache: HIT` (server sets headers on some cached paths).
  - Perform a write (e.g., update/create) under the same scope → next GET should be fresh (cache invalidated).

### 4) Static Asset Caching
- Request a file under `/public` (e.g., an uploaded image): `curl -I http://localhost:5000/public/<file>`
  - Expect headers: `Cache-Control: public, max-age=86400, immutable`, `ETag`, `Last-Modified`.

---

## Frontend Checks

### 1) Color Scheme (Light Only)
- Open the app with OS/browser in Light mode → UI is light.
- Switch OS to Dark mode and reload → UI remains light (no dark auto-theming, scrollbars and form controls stay light).

### 2) Student – My Applications
- Navigate: `/student/applications`.
- For each row:
  - Status: Approved or Pending ("Under Review" displays as "Pending").
  - Actions:
    - Pending → shows text "Pending" (no details link).
    - Approved → shows "View Admit Card" linking to `/student/admit/$id`.

### 3) Student – Admit Card (Preview)
- Open: `/student/admit/<applicationId>` for an approved application.
- Verify preview contents:
  - Header with institution logo/name, ADMIT CARD badge, meta strip (Application ID, Issued).
  - Candidate & Institution section: photo, name, email, phone, curriculum/medium, institution, unit.
  - Exam details: seat no, date, time, center.
  - Academic info (SSC/HSC or Dakhil/Alim depending on curriculum).
  - Signature lines and instructions.

### 4) Student – Admit Card (Print / Save as PDF)
- Click "Print / Save as PDF":
  - A4 portrait, content centered with margins.
  - Sections should not split across pages (no-break applied).

### 5) Student – Admit Card (Download PDF)
- Click "Download PDF":
  - Should open a new tab with the PDF.
  - PDF should match on-page layout (raster capture) and include all content with margins.
  - Mobile:
    - Android Chrome → opens PDF viewer; can Save/Share.
    - iOS Safari → opens PDF; Save/Share via system sheet.
  - If cross-origin logo/photo lacks CORS, a placeholder is used but PDF still renders.

### 6) Institution – Applications List
- Navigate: `/institution/applications`.
- Filters: Unit, Status (Approved/Under Review), Curriculum, Medium, Board, Center, Search → confirm filtering updates table.
- Row details: open a row details dialog and verify student/institution/unit info loads.

### 7) Institution – Applications PDF Export
- Click "Download PDF" on the Applications page.
- Verify PDF elements:
  - Header with institution logo/name (if available) and title.
  - Meta panel (Exported time, totals, filters, contact/institution).
  - Table:
    - Columns fit on a single page (landscape) with wrapping.
    - Applied/Reviewed columns are not included (per requirements).
    - Abbreviated headers (e.g., `Med`, `SSC Bd`, `HSC Yr`) to save space.
  - Page numbers on each page.

- Column width tuning:
  - Columns are defined with per-column widths; adjust in code and re-export to confirm expected widths are applied.

---

## Mobile QA Checklist
- iOS Safari (latest):
  - App loads and routes work.
  - "Download PDF" opens a new tab with the PDF; Share/Save works.
  - Print from Safari works; scaling correct.
- Android Chrome (latest):
  - "Download PDF" opens viewer; Save from menu works.
  - Print dialog works and renders correctly.

---

## Accessibility & UX
- Keyboard navigation on major screens (tab order, focus states).
- Sufficient contrast (especially in action buttons and text on cards).
- Buttons have clear labels; links are descriptive.

---

## Performance Smoke Checks
- Cached pages return quickly on repeat (post-auth cached GETs).
- Large lists paginate efficiently (institution applications with filters).
- PDF generation (institution export and admit card download) completes within a reasonable time (< 3–5s on typical devices).

---

## Error Scenarios
- Invalid auth token → protected routes redirect or 401 in API.
- Approve/delete on nonexistent ID → friendly error toasts.
- Missing images (logo/photo) → placeholders; no crashes.

---

## Known Limitations
- Client-side PDF capture relies on html2canvas; complex cross-origin images may be replaced by placeholders for reliability.
- In multi-instance deployments, the in-memory cache is per instance (consider Redis-backed cache if needed).

---

## Where To Adjust Behaviors
- Frontend Print/PDF styling: `uniform-frontend/src/components/student/AdmitCard.tsx`
- Student applications UI: `uniform-frontend/src/routes/student/applications.tsx`
- Institution applications export: `uniform-frontend/src/routes/institution/applications.tsx`
- Backend rate limiters: `backend/middleware/rateLimiters.js`
- Backend caching: `backend/middleware/cache.js`, `backend/middleware/cacheBust.js`
- Static asset cache headers: `backend/server.js`

---

## Reporting
For issues, please provide:
- Browser/OS and version
- Exact route and action performed
- Console/network logs or response payloads
- PDFs/screenshots when relevant

