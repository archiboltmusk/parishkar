export type Severity = 'minor' | 'severe' | 'critical';
export type ReportStatus = 'open' | 'claimed' | 'resolved';

export interface Fix {
  lat: number;
  lng: number;
  accuracy: number;
  mocked: boolean;
  at: number;
}

export interface Report {
  id: string;
  created_at: string;
  lat: number;
  lng: number;
  category: string;
  waste_type?: string;
  severity: Severity;
  status: ReportStatus;
  description: string;
  landmark: string;
  photo_url: string;
  ward_no: number;
  local_body: string;
  block_name?: string;
  area_kind: string;
  upvotes: number;
  seen_on_site: number;
  flags: number;
  sla_days: number;
  gps_verified: boolean;
  resolved_at?: string;
  resolved_photo_url?: string;
  resolution_method?: string;
  // Community claim & verification
  claim_id?: string;
  claim_photo_url?: string;
  claim_created_at?: string;
  claim_verify_count?: number;
  claim_dispute_count?: number;
  dockets?: {
    id: string;
    portal: string;
    reference_no: string;
    filed_on: string;
    status: string;
  }[];
}

export interface WardInfo {
  ward_no: number;
  local_body: string;
  councillor_name: string;
  councillor_phone?: string;
  councillor_party?: string;
  total_reports: number;
  open_reports: number;
  resolved_reports: number;
  score: number;
  rank: number;
  priority_issue: string;
}

export interface DistrictMetric {
  anc4: number;
  child_anaemia: number;
  child_marriage: number;
  clean_fuel: number;
  inst_births: number;
  insurance: number;
  sanitation: number;
  stunted: number;
  women_10yrs: number;
  women_anaemia: number;
}

export interface WorkflowStep {
  key: string;
  label: string;
  who: 'citizen' | 'officer' | 'worker';
  by: string;
  description: string;
}
