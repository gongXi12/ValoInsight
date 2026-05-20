/** Competitive tier/rank data with icons */
export interface RankInfo {
  tier: number
  name: string
  division: string
  smallIcon: string
  largeIcon: string
  color: string
}

const TIER_BASE = 'https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1'

export const RANKS: Record<number, RankInfo> = {
  0:  { tier: 0,  name: 'Unranked',   division: 'UNRANKED',  smallIcon: `${TIER_BASE}/0/smallicon.png`,  largeIcon: `${TIER_BASE}/0/largeicon.png`,  color: '#ffffff' },
  3:  { tier: 3,  name: 'Iron 1',     division: 'IRON',      smallIcon: `${TIER_BASE}/3/smallicon.png`,  largeIcon: `${TIER_BASE}/3/largeicon.png`,  color: '#4f514f' },
  4:  { tier: 4,  name: 'Iron 2',     division: 'IRON',      smallIcon: `${TIER_BASE}/4/smallicon.png`,  largeIcon: `${TIER_BASE}/4/largeicon.png`,  color: '#4f514f' },
  5:  { tier: 5,  name: 'Iron 3',     division: 'IRON',      smallIcon: `${TIER_BASE}/5/smallicon.png`,  largeIcon: `${TIER_BASE}/5/largeicon.png`,  color: '#4f514f' },
  6:  { tier: 6,  name: 'Bronze 1',   division: 'BRONZE',    smallIcon: `${TIER_BASE}/6/smallicon.png`,  largeIcon: `${TIER_BASE}/6/largeicon.png`,  color: '#a5855d' },
  7:  { tier: 7,  name: 'Bronze 2',   division: 'BRONZE',    smallIcon: `${TIER_BASE}/7/smallicon.png`,  largeIcon: `${TIER_BASE}/7/largeicon.png`,  color: '#a5855d' },
  8:  { tier: 8,  name: 'Bronze 3',   division: 'BRONZE',    smallIcon: `${TIER_BASE}/8/smallicon.png`,  largeIcon: `${TIER_BASE}/8/largeicon.png`,  color: '#a5855d' },
  9:  { tier: 9,  name: 'Silver 1',   division: 'SILVER',    smallIcon: `${TIER_BASE}/9/smallicon.png`,  largeIcon: `${TIER_BASE}/9/largeicon.png`,  color: '#bbc2c2' },
  10: { tier: 10, name: 'Silver 2',   division: 'SILVER',    smallIcon: `${TIER_BASE}/10/smallicon.png`, largeIcon: `${TIER_BASE}/10/largeicon.png`, color: '#bbc2c2' },
  11: { tier: 11, name: 'Silver 3',   division: 'SILVER',    smallIcon: `${TIER_BASE}/11/smallicon.png`, largeIcon: `${TIER_BASE}/11/largeicon.png`, color: '#bbc2c2' },
  12: { tier: 12, name: 'Gold 1',     division: 'GOLD',      smallIcon: `${TIER_BASE}/12/smallicon.png`, largeIcon: `${TIER_BASE}/12/largeicon.png`, color: '#eccf56' },
  13: { tier: 13, name: 'Gold 2',     division: 'GOLD',      smallIcon: `${TIER_BASE}/13/smallicon.png`, largeIcon: `${TIER_BASE}/13/largeicon.png`, color: '#eccf56' },
  14: { tier: 14, name: 'Gold 3',     division: 'GOLD',      smallIcon: `${TIER_BASE}/14/smallicon.png`, largeIcon: `${TIER_BASE}/14/largeicon.png`, color: '#eccf56' },
  15: { tier: 15, name: 'Platinum 1', division: 'PLATINUM',  smallIcon: `${TIER_BASE}/15/smallicon.png`, largeIcon: `${TIER_BASE}/15/largeicon.png`, color: '#59a9b6' },
  16: { tier: 16, name: 'Platinum 2', division: 'PLATINUM',  smallIcon: `${TIER_BASE}/16/smallicon.png`, largeIcon: `${TIER_BASE}/16/largeicon.png`, color: '#59a9b6' },
  17: { tier: 17, name: 'Platinum 3', division: 'PLATINUM',  smallIcon: `${TIER_BASE}/17/smallicon.png`, largeIcon: `${TIER_BASE}/17/largeicon.png`, color: '#59a9b6' },
  18: { tier: 18, name: 'Diamond 1',  division: 'DIAMOND',   smallIcon: `${TIER_BASE}/18/smallicon.png`, largeIcon: `${TIER_BASE}/18/largeicon.png`, color: '#b489c4' },
  19: { tier: 19, name: 'Diamond 2',  division: 'DIAMOND',   smallIcon: `${TIER_BASE}/19/smallicon.png`, largeIcon: `${TIER_BASE}/19/largeicon.png`, color: '#b489c4' },
  20: { tier: 20, name: 'Diamond 3',  division: 'DIAMOND',   smallIcon: `${TIER_BASE}/20/smallicon.png`, largeIcon: `${TIER_BASE}/20/largeicon.png`, color: '#b489c4' },
  21: { tier: 21, name: 'Immortal 1', division: 'IMMORTAL',  smallIcon: `${TIER_BASE}/21/smallicon.png`, largeIcon: `${TIER_BASE}/21/largeicon.png`, color: '#bb3d65' },
  22: { tier: 22, name: 'Immortal 2', division: 'IMMORTAL',  smallIcon: `${TIER_BASE}/22/smallicon.png`, largeIcon: `${TIER_BASE}/22/largeicon.png`, color: '#bb3d65' },
  23: { tier: 23, name: 'Immortal 3', division: 'IMMORTAL',  smallIcon: `${TIER_BASE}/23/smallicon.png`, largeIcon: `${TIER_BASE}/23/largeicon.png`, color: '#bb3d65' },
  24: { tier: 24, name: 'Radiant',    division: 'RADIANT',   smallIcon: `${TIER_BASE}/24/smallicon.png`, largeIcon: `${TIER_BASE}/24/largeicon.png`, color: '#ffffaa' },
}

/** Get rank info by tier number */
export function getRankByTier(tier: number): RankInfo {
  return RANKS[tier] || RANKS[0]
}

/** Get rank icon URL by tier */
export function getRankIcon(tier: number, size: 'small' | 'large' = 'small'): string {
  const rank = RANKS[tier] || RANKS[0]
  return size === 'small' ? rank.smallIcon : rank.largeIcon
}

/** Get rank name by tier */
export function getRankName(tier: number): string {
  return RANKS[tier]?.name || 'Unranked'
}
