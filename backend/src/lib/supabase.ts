import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type UserRole = 'Admin' | 'Leader Sales' | 'Sales Agent'
export type UserStatus = 'Active' | 'Pending' | 'Blocked' | 'Inactive'
export type UnitStatus = 'Available' | 'Booked' | 'Sold'
export type ClientStatus = 'New Lead' | 'Follow-up' | 'Site Visit' | 'Negotiation' | 'Booked' | 'Closed' | 'Lost'
export type ClientPotential = 'Hot' | 'Warm' | 'Cold'
export type ClientSource = 'Website' | 'Referral' | 'Walk-in' | 'Social Media' | 'Event'
export type ProjectStatus = 'Active' | 'Completed' | 'Coming Soon'
export type PaymentMethod = 'Bank Transfer' | 'Credit Card' | 'Cash' | 'Cheque'
export type BookingStatus = 'Pending Agent' | 'Pending Leader' | 'Pending Admin' | 'Approved' | 'Rejected' | 'Expired'
export type CommissionStatus = 'Pending' | 'Approved' | 'Paid' | 'Rejected'
export type VisitStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show'
export type ProofType = 'photo' | 'chat_screenshot' | 'call_log' | 'document' | 'gps_checkin'
export type ActivityType = 'Cold Calling' | 'Chat Follow-up' | 'Meeting' | 'Site Visit' | 'Negotiation' | 'Booking' | 'Document Upload' | 'Commission Claim'
export type Severity = 'info' | 'warning' | 'error' | 'critical'
export type LegalStatus = 'Verified Institutional' | 'Review Pending'
export type AuditStatus = 'Passed' | 'Pending' | 'Failed'
export type GPSStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE'

export interface Team {
  id: string
  name: string
  description: string | null
  leader_id: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  password_hash: string
  role: UserRole
  status: UserStatus
  team_id: string | null
  avatar_url: string | null
  last_password_change: string
  two_factor_enabled: boolean
  session_timeout_min: number
  timezone: string
  language: string
  total_sales: number
  active_deals: number
  registration_date: string
  last_login: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Developer {
  id: string
  name: string
  established_year: number | null
  location: string | null
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  tax_id: string | null
  business_license: string | null
  license_expiry: string | null
  insurance_cert: string | null
  insurance_expiry: string | null
  legal_status: LegalStatus
  total_units: number
  completed_projects: number
  on_time_delivery: number
  quality_score: number
  last_audit_date: string | null
  audit_status: AuditStatus
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  developer_id: string
  name: string
  address: string | null
  city: string | null
  coordinates: string | null
  map_area: string | null
  description: string | null
  project_type: string | null
  rera_id: string | null
  status: ProjectStatus
  start_date: string | null
  estimated_completion: string | null
  total_units: number
  sold_units: number
  booked_units: number
  available_units: number
  progress_pct: number
  price_range_min: number | null
  price_range_max: number | null
  avg_price: number | null
  dp_percent_min: number | null
  dp_percent_max: number | null
  gps_status: GPSStatus
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Unit {
  id: string
  project_id: string
  unit_type_id: string | null
  block: string | null
  unit_number: string
  house_type: string | null
  floor_area: number | null
  floor_level: number | null
  bedrooms: number
  bathrooms: number
  facing: string | null
  price: number
  down_payment: number | null
  dp_percent: number | null
  status: UnitStatus
  booked_by_client_id: string | null
  booked_date: string | null
  booked_by_agent: string | null
  sold_date: string | null
  booking_expires: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string
  ktp_nik: string | null
  address: string | null
  city: string | null
  occupation: string | null
  budget: string | null
  source: ClientSource | null
  potential: ClientPotential | null
  status: ClientStatus
  assigned_agent_id: string | null
  project_id: string | null
  unit_id: string | null
  last_contact: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface UnitBooking {
  id: string
  unit_id: string
  client_id: string
  agent_id: string
  booking_amount: number
  ktp_upload_url: string | null
  npwp_upload_url: string | null
  transfer_proof_url: string | null
  status: BookingStatus
  leader_approved_by: string | null
  leader_approved_at: string | null
  admin_approved_by: string | null
  admin_approved_at: string | null
  rejection_reason: string | null
  expires_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  txn_id: string
  booking_id: string | null
  client_name: string
  project_name: string | null
  unit_info: string | null
  amount: number
  payment_method: PaymentMethod | null
  status: 'Pending' | 'Approved' | 'Rejected'
  agent_id: string | null
  approved_by: string | null
  approved_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Commission {
  id: string
  agent_id: string
  scheme_id: string | null
  booking_id: string | null
  project_name: string | null
  unit_info: string | null
  client_name: string | null
  amount: number
  commission_type: string | null
  status: CommissionStatus
  claimed_at: string
  leader_approved_by: string | null
  leader_approved_at: string | null
  admin_approved_by: string | null
  admin_paid_at: string | null
  period: string | null
  bonus_type: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  client_id: string | null
  project_id: string | null
  activity_type: ActivityType
  description: string | null
  target: string | null
  is_gps_verified: boolean
  latitude: number | null
  longitude: number | null
  gps_accuracy: number | null
  notes: string | null
  created_at: string
}

export interface ProofOfWork {
  id: string
  activity_log_id: string
  proof_type: ProofType
  file_url: string
  file_name: string | null
  file_size: string | null
  caption: string | null
  latitude: number | null
  longitude: number | null
  captured_at: string
  is_from_camera: boolean
  device_info: string | null
  created_at: string
}

export interface SiteVisit {
  id: string
  agent_id: string
  client_id: string
  project_id: string
  unit_info: string | null
  visit_date: string
  visit_time: string
  status: VisitStatus
  feedback: string | null
  checkin_lat: number | null
  checkin_lng: number | null
  checkin_time: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface KpiTarget {
  id: string
  user_id: string
  period_month: number
  period_year: number
  target_revenue: number
  target_leads: number
  target_closings: number
  actual_revenue: number
  actual_leads: number
  actual_follow_ups: number
  actual_site_visits: number
  actual_closings: number
  actual_lost: number
  conversion_rate: number
  avg_deal_size: number
  avg_response_time: string | null
  client_satisfaction: number
  commission_earned: number
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  user_name: string | null
  user_role: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  entity_name: string | null
  details: string | null
  ip_address: string | null
  user_agent: string | null
  severity: Severity
  created_at: string
}

export interface SystemSettings {
  id: string
  setting_key: string
  setting_value: string | null
  setting_type: string | null
  description: string | null
  updated_by: string | null
  updated_at: string
}