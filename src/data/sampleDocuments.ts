export interface SampleDocumentItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  iconName: string;
  imageUrl: string;
  textContext: string;
}

// Crisp SVG data-urls simulating real world documents with high complexity
const createSampleDocSvg = (header: string, sub: string, lines: string[], stamp: string, alertColor: string) => {
  const lineEls = lines
    .map(
      (line, i) =>
        `<text x="40" y="${160 + i * 26}" font-family="Arial, sans-serif" font-size="14" fill="#334155">${line}</text>`
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 850" width="700" height="850">
    <rect width="700" height="850" fill="#ffffff" />
    <rect x="0" y="0" width="700" height="12" fill="${alertColor}" />
    <rect x="25" y="30" width="650" height="790" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" rx="8" />
    
    <!-- Header -->
    <rect x="40" y="45" width="620" height="70" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" rx="6" />
    <text x="60" y="75" font-family="Arial, sans-serif" font-weight="bold" font-size="19" fill="#0f172a">${header}</text>
    <text x="60" y="100" font-family="Arial, sans-serif" font-size="13" fill="#64748b">${sub}</text>

    <!-- Stamp / Badge -->
    <g transform="translate(510, 52)">
      <rect width="130" height="30" fill="${alertColor}" rx="4" />
      <text x="65" y="20" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">${stamp}</text>
    </g>

    <line x1="40" y1="135" x2="660" y2="135" stroke="#cbd5e1" stroke-width="1.5" />

    <!-- Content Lines -->
    ${lineEls}

    <!-- Callout Box -->
    <rect x="40" y="620" width="620" height="110" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.5" rx="6" />
    <text x="60" y="650" font-family="Arial, sans-serif" font-weight="bold" font-size="15" fill="#1e3a8a">CRITICAL ACTION REQUIRED / AVISO IMPORTANTE:</text>
    <text x="60" y="675" font-family="Arial, sans-serif" font-size="13" fill="#1e40af">Failure to take action by the stated date forfeits your rights under Section 42-B.</text>
    <text x="60" y="700" font-family="Arial, sans-serif" font-size="13" fill="#1e40af">For questions or accommodation assistance, call (555) 890-1234 or visit Suite 300.</text>

    <!-- Official Footer & Barcode -->
    <line x1="40" y1="755" x2="660" y2="755" stroke="#cbd5e1" stroke-width="1" />
    <text x="40" y="785" font-family="Arial, sans-serif" font-size="11" fill="#94a3b8">REF ID: AM-89024-X • DOCUMENT VERIFIED OFFICIAL DISCLOSURE • PAGE 1 OF 3</text>
    <rect x="520" y="768" width="130" height="24" fill="#0f172a" rx="2" />
    <text x="585" y="784" font-family="Courier, monospace" font-size="11" fill="#ffffff" text-anchor="middle">||| | ||||| ||||</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const SAMPLE_DOCUMENTS: SampleDocumentItem[] = [
  {
    id: 'sample_lease_renewal',
    title: 'Apartment Lease Renewal & Inspection Notice',
    category: 'Housing & Legal',
    badge: 'Urgent Deadline',
    description: 'Complex 3-page landlord letter with mandatory inspection date, new rent terms, and 14-day renewal deadline.',
    iconName: 'Building',
    imageUrl: createSampleDocSvg(
      'METROPOLITAN HOUSING AUTHORITY & PROPERTY MGMT',
      'FORMAL NOTICE TO TENANT • DATED OCTOBER 10, 2026',
      [
        'RE: ANNUAL LIFE SAFETY AUDIT AND LEASE TERM EXTENSION AGREEMENT',
        'TENANT: RESIDENT OF UNIT 4B • LEASE EXPIRATION: NOVEMBER 30, 2026',
        '',
        '1. MANDATORY SAFETY INSPECTION SCHEDULE:',
        '   Our certified technicians will enter all residential units on Tuesday, Oct 18, 2026',
        '   between 10:00 AM and 2:00 PM to inspect fire suppression detectors and ventilation.',
        '   All pets must be secured in secondary quarters.',
        '',
        '2. LEASE RENEWAL ELECTION TERMS:',
        '   To lock in your discounted preferred annual rate of $1,350.00/month, you MUST execute',
        '   and physically deliver Addendum C with valid Renters Insurance certificate no later than',
        '   Friday, October 24, 2026 at 5:00 PM EST.',
        '',
        '3. FAILURE TO SUBMIT ADDENDUM:',
        '   If unexecuted by October 24, 2026, month-to-month tenancy penalty applies ($1,520.00/mo).',
        '',
        '4. CONTACT & SUBMISSION LOCATION:',
        '   Resident Services Office, Building B, Ground Floor, Desk 3. Phone: (555) 890-1234.'
      ],
      'MANDATORY ACTION',
      '#ef4444'
    ),
    textContext: `METROPOLITAN HOUSING AUTHORITY NOTICE. Unit 4B. Mandatory safety inspection on Tuesday Oct 18, 2026 at 10am. Lease renewal deadline Friday Oct 24, 2026. Submit signed Addendum C and renters insurance certificate to Building B Resident Services Desk 3 or rent increases to $1,520/month. Contact Maria Gomez at (555) 890-1234.`
  },
  {
    id: 'sample_medical_fasting',
    title: 'Hospital Pre-Procedure & Fasting Instructions',
    category: 'Medical & Healthcare',
    badge: 'Time Sensitive',
    description: 'Clinic guidance with strict fasting rules, medication pauses, check-in address, and required insurance card.',
    iconName: 'Stethoscope',
    imageUrl: createSampleDocSvg(
      'ST. JUDE DIAGNOSTIC & ENDOSCOPY CENTER',
      'PATIENT PREPARATION GUIDELINES • APPOINTMENT: OCT 20, 2026',
      [
        'PATIENT: APPOINTMENT CONFIRMATION #774-902',
        'LOCATION: 450 WELLNESS WAY, SUITE 300, DALLAS, TX',
        '',
        '1. STRICT NPO (FASTING) REQUIREMENTS:',
        '   DO NOT EAT ANY SOLID FOOD OR CONSUME OPAQUE LIQUIDS after 10:00 PM on',
        '   Monday, October 19, 2026. Sips of clear water are permitted up to 4 hours prior.',
        '   Failure to comply WILL RESULT in cancellation and rescheduling.',
        '',
        '2. MEDICATION ADVISORY:',
        '   Hold all blood thinner medications (Aspirin, Warfarin) starting 48 hours prior.',
        '   Take blood pressure medications with a small sip of water at 6:00 AM.',
        '',
        '3. DAY OF PROCEDURE CHECK-IN:',
        '   Arrive at 8:15 AM (45 minutes prior to 9:00 AM procedure start).',
        '   Bring: Valid Government Photo ID, Medical Insurance Card, and Designated Driver.',
        '',
        '4. COPAYMENT & QUESTIONS:',
        '   $30.00 specialist copay due upon arrival. Pre-op Nurse line: (555) 321-4567.'
      ],
      'HEALTH ADVISORY',
      '#0284c7'
    ),
    textContext: `St. Jude Diagnostic Care. Patient pre-op guidelines for Oct 20, 2026 at 450 Wellness Way Suite 300. Fasting required: no food after 10:00 PM on Oct 19. Arrive 8:15 AM on Oct 20. Bring Photo ID, Insurance card, and $30 copay. Nurse phone: (555) 321-4567.`
  },
  {
    id: 'sample_transit_reroute',
    title: 'Public Transit Subway Reroute & Shuttle Alert',
    category: 'Public Signs & Transit',
    badge: 'Commuter Alert',
    description: 'Confusing train station bulletin detailing track closures, express bus shuttle locations, and wheelchair accessibility.',
    iconName: 'Bus',
    imageUrl: createSampleDocSvg(
      'METRO REGIONAL TRANSIT SYSTEM (MTA)',
      'SERVICE DISRUPTION BULLETIN • WEEKEND TRACK WORK NOTICE',
      [
        'EFFECTIVE: SATURDAY, OCTOBER 17, 2026 (5:00 AM) UNTIL MONDAY (4:30 AM)',
        'AFFECTED LINES: BLUE LINE & SILVER COMMUTER CONNECTORS',
        '',
        '1. NO TRAIN SERVICE BETWEEN CIVIC CENTER AND HIGHLAND PARK:',
        '   Track replacement work on Blue Line bridges. Stations closed: Grand, Elm, Oak.',
        '',
        '2. FREE ACCESSIBLE BUS SHUTTLE:',
        '   Board Shuttle B-44 at the surface level on 4th & Market St.',
        '   Buses run every 8-10 minutes. Allow 25 extra minutes travel time.',
        '',
        '3. ACCESSIBILITY / WHEELCHAIR RAMP SERVICE:',
        '   Dedicated low-floor accessible shuttles are marked with blue flags.',
        '   Need mobility assistance? Call Transit Care at (555) 444-9988 for priority van.',
        '',
        '4. FARES & TRANSFERS:',
        '   Swipe card once at entry. Shuttle transfers are free of charge.'
      ],
      'TRANSIT ALERT',
      '#eab308'
    ),
    textContext: `Metro Regional Transit alert: Blue Line trains cancelled between Civic Center and Highland Park Oct 17-19. Free accessible shuttle B-44 at 4th & Market St running every 8-10 minutes. Mobility van hotline (555) 444-9988.`
  },
  {
    id: 'sample_tax_homestead',
    title: 'County Property Assessment & Senior Exemption',
    category: 'Government & Tax',
    badge: 'Financial Impact',
    description: 'Dense official government form outlining assessed property value, appeal deadline, and how to apply for tax exemption.',
    iconName: 'FileText',
    imageUrl: createSampleDocSvg(
      'COUNTY ASSESSOR & REVENUE COMMISSION',
      'NOTICE OF APPRAISED VALUE & TAX EXEMPTION OPPORTUNITY • TAX YEAR 2026',
      [
        'PARCEL NUMBER: 809-44-129 • PROPERTY ADDRESS: 742 EVERGREEN TERRACE',
        '',
        '1. APPRAISED PROPERTY VALUATION:',
        '   Current Year Market Value: $245,000.00 (Proposed Tax Assessment: $3,185.00).',
        '',
        '2. HOMESTEAD & SENIOR DISABILITY EXEMPTION ELIGIBILITY:',
        '   If you are 65+ or qualify under disability status, you are entitled to a 40%',
        '   assessment reduction, saving approximately $1,274.00 annually.',
        '',
        '3. CRITICAL DEADLINE FOR EXEMPTION APPLICATION:',
        '   Submit Form HE-2026 with proof of residency and ID before Friday, Nov 14, 2026.',
        '',
        '4. FORMAL PROTEST / APPEAL DEADLINE:',
        '   Disputes must be filed online or postmarked by Nov 14, 2026 at 5:00 PM.',
        '   Office: County Courthouse Room 104. Inquiries: (555) 777-3400.'
      ],
      'TAX NOTIFICATION',
      '#10b981'
    ),
    textContext: `County Assessor Notice for 742 Evergreen Terrace. Current proposed tax $3,185.00. Senior/Disability homestead exemption saves $1,274. Deadline to submit Form HE-2026 is November 14, 2026. File in Room 104 or call (555) 777-3400.`
  }
];
