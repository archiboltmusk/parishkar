import { Report, WardInfo, DistrictMetric } from '../types';

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'REP-WB-2026-0891',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    lat: 23.3338,
    lng: 86.3645,
    category: 'waste',
    waste_type: 'garbage_dump',
    severity: 'critical',
    status: 'open',
    description: 'Massive open garbage heap spilling across the road near Main Market Chowk. Stagnant waste not cleared for 5 days.',
    landmark: 'Behind Purulia Central Post Office, Court Road',
    photo_url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80',
    ward_no: 4,
    local_body: 'Purulia Municipality',
    block_name: 'Purulia Sadar',
    area_kind: 'municipality',
    upvotes: 42,
    seen_on_site: 19,
    flags: 0,
    sla_days: 3,
    gps_verified: true,
    dockets: [
      { id: 'DOC-1', portal: 'WB Grievance Cell', reference_no: 'WB-PUR-2026-9921', filed_on: '2026-10-14', status: 'Pending with Municipal Engineer' }
    ]
  },
  {
    id: 'REP-WB-2026-0874',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    lat: 23.3282,
    lng: 86.3712,
    category: 'drainage',
    waste_type: 'overflowing_drain',
    severity: 'severe',
    status: 'claimed',
    description: 'Deep masonry drain choked with plastic sludge, wastewater overflowing into residential lane near school boundary wall.',
    landmark: 'Opposite Ward 8 Primary Health Centre, Ranchi Road',
    photo_url: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800&auto=format&fit=crop&q=80',
    ward_no: 8,
    local_body: 'Purulia Municipality',
    block_name: 'Purulia Sadar',
    area_kind: 'municipality',
    upvotes: 28,
    seen_on_site: 14,
    flags: 0,
    sla_days: 7,
    gps_verified: true,
    claim_id: 'CLM-8831',
    claim_photo_url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80',
    claim_created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    claim_verify_count: 2,
    claim_dispute_count: 0,
    dockets: [
      { id: 'DOC-2', portal: 'SBM Urban Portal', reference_no: 'SBM-2026-44102', filed_on: '2026-10-12', status: 'Verification in progress' }
    ]
  },
  {
    id: 'REP-WB-2026-0850',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    lat: 23.3412,
    lng: 86.3589,
    category: 'road',
    waste_type: 'crater_pothole',
    severity: 'critical',
    status: 'resolved',
    description: 'Dangerous double crater in asphalt causing two-wheeler skids. Both lanes hazardous during evening traffic.',
    landmark: 'Station Road turning near Bus Stand entry gate',
    photo_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    resolved_photo_url: 'https://images.unsplash.com/photo-1578965759103-06d34c4f394e?w=800&auto=format&fit=crop&q=80',
    ward_no: 11,
    local_body: 'Purulia Municipality',
    block_name: 'Purulia Sadar',
    area_kind: 'municipality',
    upvotes: 65,
    seen_on_site: 38,
    flags: 0,
    sla_days: 7,
    gps_verified: true,
    resolved_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    resolution_method: 'Confirmed on spot by 4 resident witnesses + municipal engineer sign-off',
    claim_verify_count: 4,
    claim_dispute_count: 0
  },
  {
    id: 'REP-WB-2026-0912',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    lat: 23.3365,
    lng: 86.3688,
    category: 'lighting',
    waste_type: 'faulty_luminaire',
    severity: 'minor',
    status: 'open',
    description: 'Four consecutive LED streetlights dead on girls high school approach road. Complete darkness after 6:30 PM.',
    landmark: 'Girls High School Road, Near Ward Office',
    photo_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    ward_no: 3,
    local_body: 'Purulia Municipality',
    block_name: 'Purulia Sadar',
    area_kind: 'municipality',
    upvotes: 18,
    seen_on_site: 7,
    flags: 0,
    sla_days: 2,
    gps_verified: true
  },
  {
    id: 'REP-WB-2026-0905',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    lat: 23.3241,
    lng: 86.3610,
    category: 'water',
    waste_type: 'pipeline_burst',
    severity: 'severe',
    status: 'open',
    description: 'PHE underground supply main fractured; continuous potable water stream flooding road and reducing colony supply pressure.',
    landmark: 'Jal Board pump house bypass, Ward 15',
    photo_url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80',
    ward_no: 15,
    local_body: 'Purulia Municipality',
    block_name: 'Purulia Sadar',
    area_kind: 'municipality',
    upvotes: 34,
    seen_on_site: 16,
    flags: 0,
    sla_days: 2,
    gps_verified: true
  },
  {
    id: 'REP-WB-2026-0839',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    lat: 23.3390,
    lng: 86.3750,
    category: 'toilet',
    waste_type: 'toilet_dirty',
    severity: 'severe',
    status: 'open',
    description: 'Community public toilet facility locked from outside due to choked water supply pipe; heavy sewage smell.',
    landmark: 'Purulia Old Haat Ground complex',
    photo_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    ward_no: 7,
    local_body: 'Purulia Municipality',
    block_name: 'Purulia Sadar',
    area_kind: 'municipality',
    upvotes: 22,
    seen_on_site: 11,
    flags: 0,
    sla_days: 3,
    gps_verified: true
  }
];

export const INITIAL_WARDS: WardInfo[] = [
  { ward_no: 1, local_body: 'Purulia Municipality', councillor_name: 'Sunita Sen', total_reports: 24, open_reports: 2, resolved_reports: 22, score: 92, rank: 1, priority_issue: 'Streetlight maintenance' },
  { ward_no: 2, local_body: 'Purulia Municipality', councillor_name: 'Ramesh Mukherjee', total_reports: 31, open_reports: 4, resolved_reports: 27, score: 87, rank: 2, priority_issue: 'Garbage segregation' },
  { ward_no: 3, local_body: 'Purulia Municipality', councillor_name: 'Debabrata Roy', total_reports: 28, open_reports: 5, resolved_reports: 23, score: 82, rank: 3, priority_issue: 'Dark streetlights' },
  { ward_no: 4, local_body: 'Purulia Municipality', councillor_name: 'Anup Mahato', total_reports: 45, open_reports: 12, resolved_reports: 33, score: 73, rank: 6, priority_issue: 'Commercial waste heaps' },
  { ward_no: 7, local_body: 'Purulia Municipality', councillor_name: 'Mousumi Banerjee', total_reports: 39, open_reports: 11, resolved_reports: 28, score: 71, rank: 7, priority_issue: 'Public toilet water' },
  { ward_no: 8, local_body: 'Purulia Municipality', councillor_name: 'Biplab Mondal', total_reports: 42, open_reports: 14, resolved_reports: 28, score: 66, rank: 9, priority_issue: 'Stormwater drain desilt' },
  { ward_no: 11, local_body: 'Purulia Municipality', councillor_name: 'Pratap Ghoshal', total_reports: 38, open_reports: 7, resolved_reports: 31, score: 81, rank: 4, priority_issue: 'Station road potholes' },
  { ward_no: 15, local_body: 'Purulia Municipality', councillor_name: 'Sarojini Hansda', total_reports: 33, open_reports: 9, resolved_reports: 24, score: 72, rank: 5, priority_issue: 'Water main pressure' },
  { ward_no: 18, local_body: 'Purulia Municipality', councillor_name: 'Amit Dutta', total_reports: 29, open_reports: 10, resolved_reports: 19, score: 65, rank: 10, priority_issue: 'Construction waste' },
  { ward_no: 21, local_body: 'Purulia Municipality', councillor_name: 'Kalyani Paul', total_reports: 27, open_reports: 8, resolved_reports: 19, score: 70, rank: 8, priority_issue: 'Drain covers broken' },
];

export const DISTRICT_HEALTH_METRICS: Record<string, DistrictMetric> = {
  Puruliya: {
    anc4: 57.8, child_anaemia: 77.9, child_marriage: 37.0, clean_fuel: 23.2,
    inst_births: 89.8, insurance: 35.6, sanitation: 29.2, stunted: 36.9,
    women_10yrs: 26.9, women_anaemia: 76.7
  },
  Bankura: {
    anc4: 75.7, child_anaemia: 67.1, child_marriage: 45.7, clean_fuel: 20.8,
    inst_births: 93.3, insurance: 43.4, sanitation: 49.2, stunted: 30.3,
    women_10yrs: 27.9, women_anaemia: 77.0
  },
  Kolkata: {
    anc4: 71.7, child_anaemia: 72.3, child_marriage: 16.7, clean_fuel: 91.7,
    inst_births: 97.5, insurance: 21.1, sanitation: 60.9, stunted: 29.6,
    women_10yrs: 55.4, women_anaemia: 58.2
  },
  'Paschim Barddhaman': {
    anc4: 70.4, child_anaemia: 74.7, child_marriage: 31.8, clean_fuel: 56.3,
    inst_births: 89.8, insurance: 21.8, sanitation: 71.5, stunted: 39.7,
    women_10yrs: 37.1, women_anaemia: 65.8
  },
  Darjeeling: {
    anc4: 79.2, child_anaemia: 68.1, child_marriage: 21.2, clean_fuel: 68.8,
    inst_births: 98.4, insurance: 26.3, sanitation: 83.0, stunted: 34.3,
    women_10yrs: 41.3, women_anaemia: 59.2
  },
  'West Bengal State Average': {
    anc4: 75.8, child_anaemia: 69.0, child_marriage: 41.6, clean_fuel: 40.2,
    inst_births: 91.7, insurance: 29.3, sanitation: 68.0, stunted: 33.8,
    women_10yrs: 32.9, women_anaemia: 71.4
  }
};

export function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}
