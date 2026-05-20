/** Polling interval for lockfile detection (ms) */
export const LOCKFILE_POLL_INTERVAL = 2000

/** Default API request timeout (ms) */
export const API_TIMEOUT = 10000

/** LRU cache max size for player data */
export const PLAYER_CACHE_SIZE = 50

/** Party color palette for group identification */
export const PARTY_COLORS = [
  '#FF6B6B', // red
  '#4ECDC4', // teal
  '#45B7D1', // blue
  '#96CEB4', // green
  '#FFEAA7', // yellow
  '#DDA0DD', // plum
  '#98D8C8', // mint
  '#F7DC6F', // gold
]

/** Competitive tier ID to name mapping */
export const TIER_NAMES: Record<number, string> = {
  0: 'Unranked',
  1: 'Unused1',
  2: 'Unused2',
  3: 'Iron 1',
  4: 'Iron 2',
  5: 'Iron 3',
  6: 'Bronze 1',
  7: 'Bronze 2',
  8: 'Bronze 3',
  9: 'Silver 1',
  10: 'Silver 2',
  11: 'Silver 3',
  12: 'Gold 1',
  13: 'Gold 2',
  14: 'Gold 3',
  15: 'Platinum 1',
  16: 'Platinum 2',
  17: 'Platinum 3',
  18: 'Diamond 1',
  19: 'Diamond 2',
  20: 'Diamond 3',
  21: 'Ascendant 1',
  22: 'Ascendant 2',
  23: 'Ascendant 3',
  24: 'Immortal 1',
  25: 'Immortal 2',
  26: 'Immortal 3',
  27: 'Radiant',
}

/** Tier ID to division name */
export const TIER_DIVISIONS: Record<number, string> = {
  0: 'UNRANKED',
  3: 'IRON', 4: 'IRON', 5: 'IRON',
  6: 'BRONZE', 7: 'BRONZE', 8: 'BRONZE',
  9: 'SILVER', 10: 'SILVER', 11: 'SILVER',
  12: 'GOLD', 13: 'GOLD', 14: 'GOLD',
  15: 'PLATINUM', 16: 'PLATINUM', 17: 'PLATINUM',
  18: 'DIAMOND', 19: 'DIAMOND', 20: 'DIAMOND',
  21: 'ASCENDANT', 22: 'ASCENDANT', 23: 'ASCENDANT',
  24: 'IMMORTAL', 25: 'IMMORTAL', 26: 'IMMORTAL',
  27: 'RADIANT',
}
