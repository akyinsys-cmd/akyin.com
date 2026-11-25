// Generates a deterministic, valid 3-page PDF 1.4 document using standard PDF Type1 fonts
// so dealership principals can download an offline copy of the AKYIN Automotive Dossier.

function toPdfAscii(input: string): string {
  return input
    .replace(/₹/g, 'INR ')
    .replace(/[—–]/g, '-')
    .replace(/[•·]/g, '*')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E]/g, ' ');
}

function escapePdfText(input: string): string {
  return toPdfAscii(input)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

interface PdfLine {
  text: string;
  x: number;
  y: number;
  size: number;
  bold?: boolean;
  color?: [number, number, number];
}

function buildPageStream(
  lines: PdfLine[],
  rules: Array<{ x1: number; y1: number; x2: number; y2: number; width?: number; gray?: number }>,
  footerPageNum: number
): string {
  const ops: string[] = [];

  // Header accent bar
  ops.push('0.96 0.96 0.98 rg');
  ops.push('0 778 595 64 re f');

  // Rules
  for (const r of rules) {
    ops.push(`${(r.gray ?? 0.88).toFixed(2)} G`);
    ops.push(`${(r.width ?? 0.75).toFixed(2)} w`);
    ops.push(`${r.x1} ${r.y1} m ${r.x2} ${r.y2} l S`);
  }

  // Header branding
  ops.push('BT');
  ops.push('/F2 9 Tf');
  ops.push('0.49 0.23 0.93 rg');
  ops.push('48 812 Td (AKYIN MARKETING  |  AUTOMOTIVE DEALERSHIP GROWTH DOSSIER) Tj');
  ops.push('ET');

  ops.push('BT');
  ops.push('/F1 8 Tf');
  ops.push('0.43 0.43 0.45 rg');
  ops.push('48 796 Td (Official Capabilities & Regional Benchmark Summary  *  akyin.com/marketing/automotive) Tj');
  ops.push('ET');

  // Main lines
  for (const line of lines) {
    const [r, g, b] = line.color ?? [0.11, 0.11, 0.12];
    const font = line.bold ? '/F2' : '/F1';
    ops.push('BT');
    ops.push(`${font} ${line.size} Tf`);
    ops.push(`${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} rg`);
    ops.push(`${line.x} ${line.y} Td (${escapePdfText(line.text)}) Tj`);
    ops.push('ET');
  }

  // Footer
  ops.push('0.88 G 0.6 w 48 44 m 547 44 l S');
  ops.push('BT');
  ops.push('/F1 8 Tf');
  ops.push('0.43 0.43 0.45 rg');
  ops.push(
    `48 28 Td (AKYIN Ventures  *  16 Years Automotive Industry Experience  *  Page ${footerPageNum} of 3) Tj`
  );
  ops.push('ET');

  return ops.join('\n');
}

function buildDossierPages(): string[] {
  // Page 1: Executive Summary & Regional Benchmark Highlights
  const page1Lines: PdfLine[] = [
    {
      text: 'Marketing That Moves Dealerships Forward.',
      x: 48,
      y: 744,
      size: 20,
      bold: true,
    },
    {
      text: 'From customer enquiries to showroom performance, AKYIN helps automotive dealerships',
      x: 48,
      y: 720,
      size: 10.5,
      color: [0.35, 0.35, 0.38],
    },
    {
      text: 'improve visibility, organise leads, and strengthen commercial sales teams.',
      x: 48,
      y: 706,
      size: 10.5,
      color: [0.35, 0.35, 0.38],
    },

    { text: '01. DEALERSHIP PERFORMANCE BENCHMARKS', x: 48, y: 668, size: 11, bold: true, color: [0.49, 0.23, 0.93] },
    { text: 'Metric                                  Industry Avg      AKYIN Partner     Uplift', x: 48, y: 646, size: 9.5, bold: true },
    { text: 'Lead-to-Showroom Visit Rate             12.7%             31.2%             +18.5 pts', x: 48, y: 626, size: 9.5 },
    { text: 'Test Drive Completion Rate              34.0%             72.0%             2.1x Higher', x: 48, y: 610, size: 9.5 },
    { text: 'Qualified Lead Share                    36.0%             66.0%             +30.0 pts', x: 48, y: 594, size: 9.5 },
    { text: 'Sales Executive Follow-Up SLA           42.0%             91.0%             +49.0 pts', x: 48, y: 578, size: 9.5 },

    { text: '02. REGIONAL SHOWROOM BENCHMARK SNAPSHOT', x: 48, y: 538, size: 11, bold: true, color: [0.49, 0.23, 0.93] },
    { text: 'Metro Tier-1 (Mumbai / Bengaluru / Delhi):  33.4% conversion vs. 13.8% industry average.', x: 48, y: 518, size: 9.5 },
    { text: 'South Automotive Corridor (Chennai / Hyderabad / Kochi):  31.8% vs. 12.9% industry avg.', x: 48, y: 502, size: 9.5 },
    { text: 'North & NCR Hub (Gurugram / Noida / Chandigarh):  29.6% vs. 12.1% industry avg.', x: 48, y: 486, size: 9.5 },
    { text: 'Tier-2 Growth Hubs (Pune / Jaipur / Lucknow / Indore):  30.4% vs. 11.4% industry avg.', x: 48, y: 470, size: 9.5 },

    { text: '03. FOUR INTEGRATED GROWTH PILLARS', x: 48, y: 430, size: 11, bold: true, color: [0.49, 0.23, 0.93] },
    { text: 'Pillar A - Precision Demand & Lead Capture:', x: 48, y: 410, size: 10, bold: true },
    { text: 'Geo-fenced Meta, Google Search, YouTube, Local Google Business & landing page CRO.', x: 48, y: 396, size: 9.5, color: [0.35, 0.35, 0.38] },
    { text: 'Pillar B - Two-Tier Lead Filtering & Qualification:', x: 48, y: 374, size: 10, bold: true },
    { text: 'Separate, dedicated telephonic & AI vetting classifying Hot, Warm, and Cold buyers.', x: 48, y: 360, size: 9.5, color: [0.35, 0.35, 0.38] },
    { text: 'Pillar C - Showroom Activation & Brand Trust:', x: 48, y: 338, size: 10, bold: true },
    { text: 'Test drive campaigns, festive exchange carnivals, automotive creators, & 4K video shoots.', x: 48, y: 324, size: 9.5, color: [0.35, 0.35, 0.38] },
    { text: 'Pillar D - Proprietary Analytics & Sales Training:', x: 48, y: 302, size: 10, bold: true },
    { text: '24/7 ROI dashboards, custom lead/target web apps, and showroom sales team workshops.', x: 48, y: 288, size: 9.5, color: [0.35, 0.35, 0.38] },

    { text: 'Note: Metrics reflect typical AKYIN automotive benchmark observations across partner showrooms.', x: 48, y: 80, size: 8.5, color: [0.45, 0.45, 0.48] },
  ];

  // Page 2: Complete 16-Service Catalogue
  const servicesList = [
    '01. Lead Generation - Geo-fenced Meta, Google Search & YouTube buyer capture.',
    '02. Lead Filtering & Qualification - Two-tier screening for budget & timeline.',
    '03. Influencer Marketing - Trusted automotive creators, reviewers & local voices.',
    '04. Social Media Marketing - Daily showroom Reels, deliveries & community presence.',
    '05. Video & Creative Production - 4K walkthroughs, handovers & broadcast-grade ads.',
    '06. Product Launch & Event Management - Model unveilings & VIP showroom previews.',
    '07. Test Drive Campaigns - Dedicated booking creatives with SMS/WhatsApp reminders.',
    '08. Exchange & Festive Campaigns - Seasonal surges & used-car valuation drives.',
    '09. Google Business & Local Marketing - Local map pack dominance & review velocity.',
    '10. Customer Retention Campaigns - Service dues, insurance renewals & upgrades.',
    '11. Pre-Owned Vehicle Marketing - Certified stock funnels & sell-your-car leads.',
    '12. Corporate & Fleet Marketing - B2B, HR, taxi fleet & institutional bulk outreach.',
    '13. Website & Landing Page Marketing - High-speed model pages & EMI calculators.',
    '14. Reporting & Marketing Analytics - Live 24/7 CPL, test-drive & delivery ROI.',
    '15. Custom App Development - Lightweight showroom lead & daily target tracking apps.',
    '16. Sales Team Training & Development - Lead etiquette, scripts & walk-in conversion.',
  ];

  const page2Lines: PdfLine[] = [
    { text: 'Complete 16-Service Automotive Catalogue', x: 48, y: 744, size: 18, bold: true },
    {
      text: 'Numbered in official presentation sequence from Lead Generation to Sales Training.',
      x: 48,
      y: 724,
      size: 10,
      color: [0.35, 0.35, 0.38],
    },
  ];

  servicesList.forEach((svc, idx) => {
    page2Lines.push({
      text: svc,
      x: 48,
      y: 684 - idx * 34,
      size: 9.8,
      bold: idx === 0 || idx === 1 || idx === 15,
    });
  });

  // Page 3: Modular Automotive Engagements & 90-Day Dealership Deployment Roadmap
  const page3Lines: PdfLine[] = [
    { text: 'Standalone Modules & 90-Day Showroom Rollout', x: 48, y: 744, size: 18, bold: true },
    {
      text: 'Modular standalone engagements for single showrooms, multi-city groups, and regional dealers.',
      x: 48,
      y: 724,
      size: 10,
      color: [0.35, 0.35, 0.38],
    },

    { text: 'STANDALONE AUTOMOTIVE TRACKS (SELECT INDIVIDUALLY)', x: 48, y: 682, size: 11, bold: true, color: [0.49, 0.23, 0.93] },
    { text: 'Track 1: Showroom Test-Drive & Local Acquisition', x: 48, y: 660, size: 10.5, bold: true },
    { text: '* Geo-fenced Meta & Google test-drive lead generation with transparent client ad billing.', x: 58, y: 644, size: 9.5, color: [0.35, 0.35, 0.38] },
    { text: 'Track 2: Dedicated Enquiry Qualification & CRM Filtering', x: 48, y: 618, size: 10.5, bold: true },
    { text: '* Independent telephonic & AI-assisted buyer screening, budget/timeline vetting, and', x: 58, y: 602, size: 9.5, color: [0.35, 0.35, 0.38] },
    { text: '  daily Excel qualification reports without interfering with your existing ad agency.', x: 58, y: 588, size: 9.5, color: [0.35, 0.35, 0.38] },
    { text: 'Track 3: Showroom Launch, Exchange Camps & Floor Coaching', x: 48, y: 562, size: 10.5, bold: true },
    { text: '* Standalone launch/exchange event campaigns and on-site dealership sales training.', x: 58, y: 546, size: 9.5, color: [0.35, 0.35, 0.38] },

    { text: '90-DAY IMPLEMENTATION CADENCE', x: 48, y: 498, size: 11, bold: true, color: [0.49, 0.23, 0.93] },
    { text: 'Days 1 - 15: Showroom Audit, Pixel & CRM Hygiene, Google Business & Landing Page Setup.', x: 48, y: 474, size: 9.8 },
    { text: 'Days 16 - 45: Campaign Launch, Two-Tier Lead Filtering Activation, WhatsApp Slot Reminders.', x: 48, y: 454, size: 9.8 },
    { text: 'Days 46 - 90: Sales Team Coaching, Festive/Test-Drive Acceleration & Monthly Attribution Review.', x: 48, y: 434, size: 9.8 },

    { text: 'NEXT STEPS & DIRECT CONSULTATION', x: 48, y: 380, size: 11, bold: true, color: [0.49, 0.23, 0.93] },
    { text: 'Schedule a complimentary dealership marketing audit at: akyin.com/marketing/automotive', x: 48, y: 358, size: 10 },
    { text: 'AKYIN Ventures  *  Automotive Marketing & Dealership Growth Division', x: 48, y: 340, size: 9.5, color: [0.35, 0.35, 0.38] },
  ];

  return [
    buildPageStream(
      page1Lines,
      [
        { x1: 48, y1: 688, x2: 547, y2: 688 },
        { x1: 48, y1: 639, x2: 547, y2: 639, gray: 0.78 },
        { x1: 48, y1: 558, x2: 547, y2: 558 },
        { x1: 48, y1: 450, x2: 547, y2: 450 },
      ],
      1
    ),
    buildPageStream(
      page2Lines,
      [{ x1: 48, y1: 706, x2: 547, y2: 706 }],
      2
    ),
    buildPageStream(
      page3Lines,
      [
        { x1: 48, y1: 704, x2: 547, y2: 704 },
        { x1: 48, y1: 520, x2: 547, y2: 520 },
        { x1: 48, y1: 404, x2: 547, y2: 404 },
      ],
      3
    ),
  ];
}

export function generateDealershipDossierPdfBlob(): Blob {
  const streams = buildDossierPages();
  const objects: string[] = [];

  // 1: Catalog, 2: Pages, 3..5: Page objects, 6..8: Content streams, 9: Helvetica, 10: Helvetica-Bold
  objects[1] = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  objects[2] = '2 0 obj\n<< /Type /Pages /Kids [3 0 R 4 0 R 5 0 R] /Count 3 >>\nendobj\n';

  for (let i = 0; i < 3; i++) {
    const pageObjId = 3 + i;
    const contentObjId = 6 + i;
    const stream = streams[i];
    objects[pageObjId] =
      `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 9 0 R /F2 10 0 R >> >> /Contents ${contentObjId} 0 R >>\nendobj\n`;
    objects[contentObjId] =
      `${contentObjId} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`;
  }

  objects[9] =
    '9 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  objects[10] =
    '10 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (let id = 1; id <= 10; id++) {
    offsets[id] = pdf.length;
    pdf += objects[id];
  }

  const xrefStart = pdf.length;
  pdf += 'xref\n0 11\n0000000000 65535 f \n';
  for (let id = 1; id <= 10; id++) {
    pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size 11 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}
