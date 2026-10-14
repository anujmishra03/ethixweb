export const HUBS = [
  {
    id: 'delhi',
    name: 'Delhi NCR',
    code: 'DEL',
    lat: 28.6139,
    lon: 77.2090,
    role: 'Strategy & Cloud Architecture',
    ping: '12ms',
    nodes: 142,
    status: 'Operational · Primary Node',
    accent: '#d94332'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    code: 'BOM',
    lat: 19.0760,
    lon: 72.8777,
    role: 'Commerce & Financial Systems',
    ping: '14ms',
    nodes: 188,
    status: 'Operational · Commerce Gateway',
    accent: '#d94332'
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    code: 'BLR',
    lat: 12.9716,
    lon: 77.5946,
    role: 'Core Engineering & AI Labs',
    ping: '8ms',
    nodes: 264,
    status: 'Operational · Innovation Lab',
    accent: '#d94332'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    code: 'HYD',
    lat: 17.3850,
    lon: 78.4867,
    role: 'Enterprise Cloud & Workflows',
    ping: '11ms',
    nodes: 176,
    status: 'Operational · Systems Hub',
    accent: '#d94332'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    code: 'MAA',
    lat: 13.0827,
    lon: 80.2707,
    role: 'SaaS Platforms & UI Systems',
    ping: '15ms',
    nodes: 135,
    status: 'Operational · Product Studio',
    accent: '#d94332'
  }
];

export const GLOBAL_HUBS = [
  { id: 'london', name: 'London', code: 'LHR', lat: 51.5074, lon: -0.1278, role: 'Global Partner Network' },
  { id: 'singapore', name: 'Singapore', code: 'SIN', lat: 1.3521, lon: 103.8198, role: 'APAC Operations' },
  { id: 'dubai', name: 'Dubai', code: 'DXB', lat: 25.2048, lon: 55.2708, role: 'MENA Gateway' },
  { id: 'sf', name: 'San Francisco', code: 'SFO', lat: 37.7749, lon: -122.4194, role: 'Tech & Cloud Ecosystem' },
  { id: 'tokyo', name: 'Tokyo', code: 'HND', lat: 35.6762, lon: 139.6503, role: 'East Asia Partner Node' }
];

// Strategic connections across Indian hubs
export const INDIA_ROUTES = [
  ['delhi', 'mumbai'],
  ['delhi', 'bengaluru'],
  ['delhi', 'hyderabad'],
  ['mumbai', 'bengaluru'],
  ['mumbai', 'hyderabad'],
  ['bengaluru', 'hyderabad'],
  ['bengaluru', 'chennai'],
  ['chennai', 'hyderabad']
];

// Strategic international links (showing Ethixweb India's global reach)
export const GLOBAL_ROUTES = [
  ['delhi', 'london'],
  ['mumbai', 'dubai'],
  ['bengaluru', 'singapore'],
  ['hyderabad', 'sf'],
  ['chennai', 'tokyo']
];

// Brand and visual theme constants
export const GLOBE_COLORS = {
  paper: '#f7f5f0',
  paperDark: '#ede8dd',
  ink: '#20201e',
  muted: '#77746d',
  line: '#dedbd3',
  red: '#d94332',
  redDark: '#b83225',
  redGlow: '#ff5441',
  brass: '#c2a67e',
  landWorld: '#8a857b',
  oceanSphere: '#eee7db',
  oceanHalo: '#e4dac9'
};
