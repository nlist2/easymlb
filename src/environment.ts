export const firebaseConfig = {
  apiKey: "AIzaSyAF1CqLV-j9llzf2lnT-7gAEsE924KPVhc",
  authDomain: "easymlb.firebaseapp.com",
  projectId: "easymlb",
  storageBucket: "easymlb.appspot.com",
  messagingSenderId: "1017316832240",
  appId: "1:1017316832240:web:f3f2a25da0aa48a358a335",
  measurementId: "G-R28VJYZKWF",
};

export interface RoundInfo {
  description: string;
  color: string;
}

export interface ScoringData {
  inning: number; // Example: 1, 2, 3, ...
  home_score: number; // Home team's score in this inning
  away_score: number; // Away team's score in this inning
}

export const roundMapping: { [key: string]: RoundInfo } = {
  "F": { description: "Wild Card", color: "#FF0000" },  // Red
  "D": { description: "Divisional Series", color: "#CD7F32" },  // Bronze
  "L": { description: "League Championship", color: "#C0C0C0" },  // Silver
  "W": { description: "World Series", color: "#FFD700" },  // Gold
  "R": { description: "Regular Season", color: "#FFFFFF" },  // None (White for no specific color)
  "S": { description: "Spring Training", color: "#808080" }  // Gray
};

interface TeamAbbr {
  [teamName: string]: string;
}

export const mlbTeamAbbr: TeamAbbr = {
  'Arizona Diamondbacks': 'ARI',
  'Atlanta Braves': 'ATL',
  'Baltimore Orioles': 'BAL',
  'Boston Red Sox': 'BOS',
  'Chicago White Sox': 'CWS',
  'Chicago Cubs': 'CHC',
  'Cincinnati Reds': 'CIN',
  'Cleveland Guardians': 'CLE',
  'Colorado Rockies': 'COL',
  'Detroit Tigers': 'DET',
  'Houston Astros': 'HOU',
  'Kansas City Royals': 'KC',
  'Los Angeles Angels': 'LAA',
  'Los Angeles Dodgers': 'LAD',
  'Miami Marlins': 'MIA',
  'Milwaukee Brewers': 'MIL',
  'Minnesota Twins': 'MIN',
  'New York Yankees': 'NYY',
  'New York Mets': 'NYM',
  'Oakland Athletics': 'OAK',
  'Philadelphia Phillies': 'PHI',
  'Pittsburgh Pirates': 'PIT',
  'San Diego Padres': 'SD',
  'San Francisco Giants': 'SF',
  'Seattle Mariners': 'SEA',
  'St. Louis Cardinals': 'STL',
  'Tampa Bay Rays': 'TB',
  'Texas Rangers': 'TEX',
  'Toronto Blue Jays': 'TOR',
  'Washington Nationals': 'WSH'
};
