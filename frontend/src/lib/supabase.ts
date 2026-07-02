import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

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

export interface Team {
  id: string
  name: string
  description: string | null
  leader_id: string | null
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  team_id: string | null
  avatar_url: string | null
  total_sales: number
  active_deals: number
}

export interface Developer {
  id: string
  name: string
  contact_name: string | null
  contact_phone: string | null
  legal_status: 'Verified Institutional' | 'Review Pending'
}

export interface Project {
  id: string
  name: string
  city: string | null
  coordinates: string | null
  description: string | null
  status: ProjectStatus
  total_units: number
  sold_units: number
  booked_units: number
  available_units: number
  progress_pct: number
  price_range_min: number | null
  price_range_max: number | null
  gps_status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE'
  image_url: string | null
}

export interface Unit {
  id: string
  project_id: string
  block: string | null
  unit_number: string
  house_type: string | null
  floor_area: number | null
  bedrooms: number
  bathrooms: number
  price: number
  status: UnitStatus
}

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string
  budget: string | null
  source: ClientSource | null
  potential: ClientPotential | null
  status: ClientStatus
  assigned_agent_id: string | null
  project_id: string | null
  last_contact: string | null
}

export interface UnitBooking {
  id: string
  unit_id: string
  client_id: string
  agent_id: string
  booking_amount: number
  status: BookingStatus
}

export interface Commission {
  id: string
  agent_id: string
  amount: number
  commission_type: string | null
  status: CommissionStatus
  claimed_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  activity_type: ActivityType
  description: string | null
  created_at: string
}

export interface SiteVisit {
  id: string
  agent_id: string
  client_id: string
  project_id: string
  visit_date: string
  visit_time: string
  status: VisitStatus
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
  actual_closings: number
}