import { supabase, type User, type Team, type Project, type Developer, type Unit, type Client, type UnitBooking, type Transaction, type Commission, type ActivityLog, type SiteVisit, type KpiTarget } from '../lib/supabase'

// ==================== USERS ====================

export async function login(email: string, password: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password_hash', password)
    .eq('status', 'Active')
    .single()
  
  if (error) throw error
  return data as User
}

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*, teams(*)')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// ==================== PROJECTS ====================

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*, developers(*), units(*)')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*, developers(*), units(*), project_facilities(*), project_images(*)')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function createProject(project: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ==================== UNITS ====================

export async function getUnitsByProject(projectId: string) {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .eq('project_id', projectId)
    .order('block')
    .order('unit_number')
  
  if (error) throw error
  return data as Unit[]
}

export async function getUnitById(id: string) {
  const { data, error } = await supabase
    .from('units')
    .select('*, projects(*), unit_types(*)')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function updateUnitStatus(unitId: string, status: string) {
  const { data, error } = await supabase
    .from('units')
    .update({ status })
    .eq('id', unitId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ==================== CLIENTS ====================

export async function getClientsByAgent(agentId: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*, users!assigned_agent_id(*), projects(*)')
    .eq('assigned_agent_id', agentId)
  
  if (error) throw error
  return data
}

export async function getClientById(id: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*, users!assigned_agent_id(*), projects(*), units(*)')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function createClient(client: Partial<Client>) {
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ==================== BOOKINGS ====================

export async function createBooking(booking: Partial<UnitBooking>) {
  const { data, error } = await supabase
    .from('unit_bookings')
    .insert(booking)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getBookingsByStatus(status: string) {
  const { data, error } = await supabase
    .from('unit_bookings')
    .select('*, units(*), clients(*), users!agent_id(*)')
    .eq('status', status)
  
  if (error) throw error
  return data
}

export async function approveBooking(bookingId: string, approverId: string, role: string) {
  const update: any = { updated_at: new Date().toISOString() }
  
  if (role === 'Leader Sales') {
    update.leader_approved_by = approverId
    update.leader_approved_at = new Date().toISOString()
    update.status = 'Pending Admin'
  } else if (role === 'Admin') {
    update.admin_approved_by = approverId
    update.admin_approved_at = new Date().toISOString()
    update.status = 'Approved'
  }
  
  const { data, error } = await supabase
    .from('unit_bookings')
    .update(update)
    .eq('id', bookingId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ==================== COMMISSIONS ====================

export async function getCommissionsByAgent(agentId: string) {
  const { data, error } = await supabase
    .from('commissions')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Commission[]
}

export async function claimCommission(commission: Partial<Commission>) {
  const { data, error } = await supabase
    .from('commissions')
    .insert({
      ...commission,
      status: 'Pending',
      claimed_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ==================== ACTIVITY LOGS ====================

export async function createActivityLog(activity: Partial<ActivityLog>) {
  const { data, error } = await supabase
    .from('activity_logs')
    .insert({
      ...activity,
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getActivityLogsByAgent(agentId: string, limit = 50) {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*, clients(*), projects(*)')
    .eq('user_id', agentId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data
}

// ==================== SITE VISITS ====================

export async function createSiteVisit(visit: Partial<SiteVisit>) {
  const { data, error } = await supabase
    .from('site_visits')
    .insert({
      ...visit,
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getVisitsByAgent(agentId: string) {
  const { data, error } = await supabase
    .from('site_visits')
    .select('*, clients(*), projects(*)')
    .eq('agent_id', agentId)
    .order('visit_date', { ascending: false })
  
  if (error) throw error
  return data
}

export async function checkinSiteVisit(visitId: string, lat: number, lng: number) {
  const { data, error } = await supabase
    .from('site_visits')
    .update({
      checkin_lat: lat,
      checkin_lng: lng,
      checkin_time: new Date().toISOString(),
      status: 'Completed'
    })
    .eq('id', visitId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ==================== KPI ====================

export async function getKpiTargets(userId: string, month?: number, year?: number) {
  const currentMonth = month || new Date().getMonth() + 1
  const currentYear = year || new Date().getFullYear()
  
  const { data, error } = await supabase
    .from('kpi_targets')
    .select('*')
    .eq('user_id', userId)
    .eq('period_month', currentMonth)
    .eq('period_year', currentYear)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data as KpiTarget | null
}

export async function updateKpiActuals(userId: string, updates: Partial<KpiTarget>) {
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()
  
  const { data, error } = await supabase
    .from('kpi_targets')
    .upsert({
      user_id: userId,
      period_month: month,
      period_year: year,
      ...updates
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ==================== DASHBOARD ====================

export async function getTeamPerformance() {
  const { data, error } = await supabase
    .from('v_team_performance')
    .select('*')
  
  if (error) throw error
  return data
}

export async function getAgentLeaderboard() {
  const { data, error } = await supabase
    .from('v_agent_leaderboard')
    .select('*')
    .limit(10)
  
  if (error) throw error
  return data
}

export async function getInventorySummary() {
  const { data, error } = await supabase
    .from('v_inventory_summary')
    .select('*')
  
  if (error) throw error
  return data
}

export async function getHotLeads() {
  const { data, error } = await supabase
    .from('v_hot_leads')
    .select('*')
  
  if (error) throw error
  return data
}

// ==================== DEVELOPERS ====================

export async function getDevelopers() {
  const { data, error } = await supabase
    .from('developers')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data as Developer[]
}

export async function createDeveloper(developer: Partial<Developer>) {
  const { data, error } = await supabase
    .from('developers')
    .insert(developer)
    .select()
    .single()
  
  if (error) throw error
  return data
}