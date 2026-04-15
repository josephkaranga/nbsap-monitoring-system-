// src/data/constants.ts
// All static data from the HTML — indicators, districts, toolkit tools, targets, risks

export const TOOLKIT_TOOLS = [
  { id: 'T01', name: 'National Institutional Reporting', icon: '🏛️', color: '#1B6CA8', accent: '#4CA3DD', frequency: 'Quarterly', output: 'Institutional Compliance Scorecard' },
  { id: 'T02', name: 'District Biodiversity Monitoring', icon: '🌿', color: '#1E7D4B', accent: '#4CBB7F', frequency: 'Quarterly', output: 'District Biodiversity Performance Index' },
  { id: 'T03', name: 'Protected Area Monitoring', icon: '🛡️', color: '#5B3FA6', accent: '#9C78E0', frequency: 'Biannual', output: 'Ecosystem Integrity Report' },
  { id: 'T04', name: 'Community Biodiversity Monitoring', icon: '👥', color: '#B56A00', accent: '#F0A030', frequency: 'Quarterly', output: 'Community Observation Dataset' },
  { id: 'T05', name: 'Biodiversity Finance Tracking', icon: '💰', color: '#0E6655', accent: '#1ABC9C', frequency: 'Annual', output: 'Finance Gap Analysis' },
  { id: 'T06', name: 'Private Sector Compliance', icon: '🏗️', color: '#922B21', accent: '#E74C3C', frequency: 'Annual', output: 'Private-Sector Compliance Index' },
  { id: 'T07', name: 'Research & Academic Contribution', icon: '🔬', color: '#1A5276', accent: '#2E86C1', frequency: 'Annual', output: 'Biodiversity Evidence Repository' },
]

export const DISTRICT_DATA = [
  { name: 'Kigali City', province: 'Kigali', status: 'submitted', compliance: 92, forest: 18 },
  { name: 'Nyarugenge', province: 'Kigali', status: 'submitted', compliance: 88, forest: 12 },
  { name: 'Gasabo', province: 'Kigali', status: 'submitted', compliance: 91, forest: 15 },
  { name: 'Kicukiro', province: 'Kigali', status: 'submitted', compliance: 89, forest: 14 },
  { name: 'Nyanza', province: 'South', status: 'submitted', compliance: 85, forest: 28 },
  { name: 'Gisagara', province: 'South', status: 'pending', compliance: 72, forest: 22 },
  { name: 'Nyaruguru', province: 'South', status: 'submitted', compliance: 80, forest: 35 },
  { name: 'Huye', province: 'South', status: 'submitted', compliance: 87, forest: 26 },
  { name: 'Kamonyi', province: 'South', status: 'pending', compliance: 70, forest: 20 },
  { name: 'Ruhango', province: 'South', status: 'submitted', compliance: 82, forest: 24 },
  { name: 'Muhanga', province: 'South', status: 'submitted', compliance: 84, forest: 21 },
  { name: 'Gakenke', province: 'North', status: 'missing', compliance: 58, forest: 42 },
  { name: 'Musanze', province: 'North', status: 'submitted', compliance: 86, forest: 38 },
  { name: 'Burera', province: 'North', status: 'submitted', compliance: 83, forest: 40 },
  { name: 'Rulindo', province: 'North', status: 'missing', compliance: 60, forest: 36 },
  { name: 'Gicumbi', province: 'North', status: 'submitted', compliance: 81, forest: 32 },
  { name: 'Rubavu', province: 'West', status: 'submitted', compliance: 88, forest: 30 },
  { name: 'Nyabihu', province: 'West', status: 'submitted', compliance: 82, forest: 29 },
  { name: 'Ngororero', province: 'West', status: 'pending', compliance: 74, forest: 27 },
  { name: 'Karongi', province: 'West', status: 'submitted', compliance: 85, forest: 33 },
  { name: 'Rutsiro', province: 'West', status: 'submitted', compliance: 79, forest: 31 },
  { name: 'Rusizi', province: 'West', status: 'submitted', compliance: 83, forest: 35 },
  { name: 'Nyamasheke', province: 'West', status: 'submitted', compliance: 80, forest: 37 },
  { name: 'Rwamagana', province: 'East', status: 'submitted', compliance: 86, forest: 19 },
  { name: 'Nyagatare', province: 'East', status: 'submitted', compliance: 84, forest: 16 },
  { name: 'Gatsibo', province: 'East', status: 'submitted', compliance: 78, forest: 18 },
  { name: 'Kayonza', province: 'East', status: 'submitted', compliance: 80, forest: 17 },
  { name: 'Kirehe', province: 'East', status: 'submitted', compliance: 77, forest: 20 },
  { name: 'Ngoma', province: 'East', status: 'submitted', compliance: 81, forest: 21 },
  { name: 'Bugesera', province: 'East', status: 'submitted', compliance: 83, forest: 23 },
]

export const RISK_DATA = [
  { id: 'R01', desc: 'Ministerial data sharing refusal', cat: 'Institutional', likelihood: 'Medium', impact: 'High', level: 'High', mitigation: 'Engage Cabinet-level MOU; designate REMA as lead; escalate to Minister if refused', owner: 'REMA' },
  { id: 'R02', desc: 'RBIS technical integration failure', cat: 'Technical', likelihood: 'Low', impact: 'High', level: 'High', mitigation: 'Maintain offline Excel templates; run staging environment; assign dedicated ICT lead', owner: 'ICT Unit' },
  { id: 'R03', desc: 'Sensitive species data exposed publicly', cat: 'Data Governance', likelihood: 'Medium', impact: 'High', level: 'High', mitigation: 'Role-based access control; species location fuzzing; data classification tiers before RBIS go-live', owner: 'REMA/RDB' },
  { id: 'R04', desc: 'District capacity gaps in data collection', cat: 'Capacity', likelihood: 'High', impact: 'Medium', level: 'Medium', mitigation: 'Pre-deploy T02 training; embed REMA officers in 5 priority districts; offline-capable forms', owner: 'Districts/REMA' },
  { id: 'R05', desc: 'Biodiversity financing gap widens', cat: 'Financial', likelihood: 'High', impact: 'Medium', level: 'Medium', mitigation: 'T05 quarterly tracking; alert if disbursement <60% allocation; activate GCF/GEF pipeline', owner: 'MINECOFIN' },
  { id: 'R06', desc: 'Private sector EIA non-compliance', cat: 'Compliance', likelihood: 'Medium', impact: 'Medium', level: 'Medium', mitigation: 'Enforce T06 annual reporting; link compliance to licensing renewals; publish sector compliance index', owner: 'REMA/RDB' },
  { id: 'R07', desc: 'Community data quality inconsistencies', cat: 'Data Governance', likelihood: 'High', impact: 'Low', level: 'Medium', mitigation: 'Sector validation before aggregation; cross-check T04 vs T02; train community monitors', owner: 'District Officers' },
  { id: 'R08', desc: 'Staff turnover in key M&E roles', cat: 'Capacity', likelihood: 'Medium', impact: 'Medium', level: 'Medium', mitigation: 'Embed capacity in institutions; document all protocols in RBIS; cross-train 2 per ministry', owner: 'REMA HR' },
  { id: 'R09', desc: 'CBD reporting deadline missed', cat: 'Compliance', likelihood: 'Low', impact: 'High', level: 'Medium', mitigation: '6-month buffer in CBD timeline; dedicated CBD focal point; align annual NBSAP with CBD schedule', owner: 'REMA' },
  { id: 'R10', desc: 'Gender & IPLC data underreported', cat: 'Capacity', likelihood: 'Medium', impact: 'Medium', level: 'Low', mitigation: 'Mandate disaggregated gender in T02/T04; IPLC liaison in training; Indicator 22 as early warning', owner: 'REMA/NGOs' },
  { id: 'R11', desc: 'Invasive species spread unchecked', cat: 'Ecological', likelihood: 'Medium', impact: 'High', level: 'High', mitigation: 'Immediate response if Indicator 17 shows new invasive; activate T04 community monitoring network', owner: 'RDB/Districts' },
  { id: 'R12', desc: 'Research data not integrated into RBIS', cat: 'Data Governance', likelihood: 'Low', impact: 'Low', level: 'Low', mitigation: 'Mandate T07 for all Rwanda biodiversity research; university MOU framework; REMA Research Liaison', owner: 'REMA/Universities' },
]

export const GOAL_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  A: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0', label: 'Goal A' },
  B: { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd', label: 'Goal B' },
  C: { bg: '#fef9c3', text: '#854d0e', border: '#fde68a', label: 'Goal C' },
  D: { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff', label: 'Goal D' },
}

export const DASHBOARD_BASELINE = {
  totalSubmissions: 1248,
  submissionsLabel: '↑ 12% from last month',
  activeDistricts: '18/20',
  complianceIssues: 5,
}
