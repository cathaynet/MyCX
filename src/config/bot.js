// config.js
import { logger } from '../utils/logger.js';

export const botConfig = {
  // =========================
  // BOT PRESENCE
  // =========================
  presence: {
    status: "online",
    activities: [
      {
        name: "Cathay Pacific Flight Operations",
        type: 3, // Watching
      },
    ],
  },

  // =========================
  // COMMAND BEHAVIOR
  // =========================
  commands: {
    owners: process.env.OWNER_IDS?.split(",") || [],
    defaultCooldown: 3,
    deleteCommands: false,
    testGuildId: process.env.TEST_GUILD_ID,
  },

  // =========================
  // EMBED COLORS & BRANDING
  // =========================
  embeds: {
    colors: {
      // Cathay Pacific Brand Colors
      primary: "#005D63",      // Cathay Green
      secondary: "#4B2E2E",    // Cathay Dark Red/Brown
      accent: "#C19A6B",       // Gold accent
      
      // Status colors - muted corporate style
      success: "#2C5F2D",      // Forest green
      error: "#8B3A3A",        // Deep red
      warning: "#D4A373",      // Warm sand
      info: "#2C4C6E",         // Navy blue
      
      // Neutral colors
      light: "#F5F5F5",
      dark: "#1A1A1A",
      gray: "#6B6B6B",
      
      // Feature-specific colors
      flight: "#005D63",
      pilot: "#4B2E2E",
      statistics: "#2C4C6E",
      paygrade: "#C19A6B",
    },
    footer: {
      text: "Cathay Pacific Flight Operations",
      icon: null, // Placeholder for company logo
    },
    thumbnail: null,
    author: {
      name: "Cathay Pacific",
      icon: null,
      url: null,
    },
  },

  // =========================
  // AIRCRAFT FLEET
  // =========================
  fleet: [
    "CESSNA 172",
    "A321NEO",
    "A321-200",
    "707-320C",
    "A330-300",
    "A330-900NEO",
    "A340-200",
    "A340-600",
    "A350-900",
    "A350-1000",
    "B747-200B",
    "747-400",
    "777-200LR",
    "777-300ER",
    "747-400F",
    "747-8F",
    "Concorde",
    "737-800",
    "Embraer 190",
    "A330-200F (Air HongKong)"
  ],

  // =========================
  // PILOT RANKS & REQUIREMENTS
  // =========================
  ranks: {
    "Cadet": {
      fpRequired: 10000,
      hoursRequired: 10,
      flightsRequired: 3,
      roleId: null // To be set via environment or DB
    },
    "Flight Engineer": {
      fpRequired: 30000,
      hoursRequired: 25,
      flightsRequired: 5,
      roleId: null
    },
    "Second Officer": {
      fpRequired: 50000,
      hoursRequired: 35,
      flightsRequired: 7,
      roleId: null
    },
    "First Officer": {
      fpRequired: 100000,
      hoursRequired: 40,
      flightsRequired: 10,
      roleId: null
    },
    "Captain": {
      fpRequired: 200000,
      hoursRequired: 50,
      flightsRequired: 20,
      roleId: null
    },
    "Senior Captain": {
      fpRequired: 350000,
      hoursRequired: 70,
      flightsRequired: 25,
      roleId: null
    }
  },

  // =========================
  // FLIGHT LOGGING SETTINGS
  // =========================
  flights: {
    maxAirportCodeLength: 4,
    minFlightTimeMinutes: 1,
    maxFlightTimeMinutes: 720, // 12 hours max
    fpPerFlight: null, // FP is provided as constant input, not calculated
  },

  // =========================
  // GENERIC BOT MESSAGES
  // =========================
  messages: {
    noPermission: "Access Denied. You do not have permission to use this command.",
    cooldownActive: "Please wait TIME seconds before using this command again.",
    errorOccurred: "An error occurred while executing this command. Please contact operations.",
    missingPermissions: "Missing required permissions to perform this action.",
    invalidAirport: "Invalid airport code. Please use a 4-letter ICAO code (e.g., VHHH for Hong Kong).",
    invalidAircraft: "Invalid aircraft type. Please select from the fleet list.",
    invalidFlightTime: "Invalid flight time. Please provide time in minutes (1-720).",
    invalidFP: "Invalid Flight Points value. Please provide a positive integer.",
  },

  // =========================
  // FEATURE TOGGLES
  // =========================
  features: {
    flightLogging: true,
    pilotStatistics: true,
    rankProgression: true,
    leaderboards: true,
  },
};

// Database Schema (for reference)
export const databaseSchema = {
  pilots: `
    CREATE TABLE IF NOT EXISTS pilots (
      user_id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      total_flights INTEGER DEFAULT 0,
      total_hours REAL DEFAULT 0,
      total_fp INTEGER DEFAULT 0,
      current_rank TEXT DEFAULT 'Cadet',
      favorite_aircraft TEXT,
      favorite_route TEXT,
      total_distance_nm REAL DEFAULT 0,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  
  flights: `
    CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      aircraft TEXT NOT NULL,
      departure_icao TEXT NOT NULL,
      arrival_icao TEXT NOT NULL,
      flight_time_minutes INTEGER NOT NULL,
      fp_rewarded INTEGER NOT NULL,
      distance_nm REAL NOT NULL,
      logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES pilots(user_id)
    )
  `,
  
  rank_history: `
    CREATE TABLE IF NOT EXISTS rank_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      old_rank TEXT NOT NULL,
      new_rank TEXT NOT NULL,
      promoted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES pilots(user_id)
    )
  `
};

// Distance calculation helper (nautical miles between ICAO coordinates)
// This would need a database of ICAO coordinates. Simplified version:
export function calculateDistance(icao1, icao2) {
  // Placeholder - in production, use a database of ICAO coordinates
  // For now, return a random distance between 100-8000 NM
  // You should replace this with actual distance calculations
  const distances = {
    "VHHH-SGTS": 11000, // Hong Kong - Singapore
    "VHHH-RJTT": 1800,  // Hong Kong - Tokyo
    "VHHH-KJFK": 8100,  // Hong Kong - New York
    "VHHH-EGLL": 6000,  // Hong Kong - London
    // Add more routes as needed
  };
  
  const route = `${icao1}-${icao2}`;
  const reverseRoute = `${icao2}-${icao1}`;
  
  if (distances[route]) return distances[route];
  if (distances[reverseRoute]) return distances[reverseRoute];
  
  // Default distance calculation based on approximate coordinates
  // This is a placeholder - implement actual coordinate lookup
  return Math.floor(Math.random() * 5000) + 500;
}

export function validateConfig(config) {
  const errors = [];

  if (!process.env.DISCORD_TOKEN && !process.env.TOKEN) {
    errors.push("Bot token is required (DISCORD_TOKEN or TOKEN environment variable)");
  }

  if (!process.env.CLIENT_ID) {
    errors.push("Client ID is required (CLIENT_ID environment variable)");
  }

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.DATABASE_URL) {
      errors.push("Database URL is required in production");
    }
  }

  return errors;
}

const configErrors = validateConfig(botConfig);
if (configErrors.length > 0) {
  logger.error("Configuration errors:", configErrors.join("\n"));
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}

export const BotConfig = botConfig;

export function getColor(path, fallback = "#6B6B6B") {
  if (typeof path === "number") return path;
  if (typeof path === "string" && path.startsWith("#")) {
    return parseInt(path.replace("#", ""), 16);
  }
  const result = path
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : fallback),
      botConfig.embeds.colors,
    );
  
  if (typeof result === "string" && result.startsWith("#")) {
    return parseInt(result.replace("#", ""), 16);
  }
  return result;
}

export default botConfig;
