import { BaseShard } from './base'
import { PARTY_COLORS } from '@shared/constants'
import type { PregamePlayer, PartyGroup } from '@shared/types'

/**
 * Detects party groups from pregame player data.
 * Players sharing the same PartyID are in the same group.
 */
export class PartyDetectorShard extends BaseShard {
  readonly name = 'party-detector'

  async onInit(): Promise<void> {}
  async onDispose(): Promise<void> {}

  /**
   * Analyze players in agent select and return party groups.
   * Each group gets a unique color for UI display.
   */
  detectParties(players: PregamePlayer[]): PartyGroup[] {
    const partyMap = new Map<string, string[]>()

    for (const player of players) {
      const partyId = player.PartyID
      if (!partyId) continue

      if (!partyMap.has(partyId)) {
        partyMap.set(partyId, [])
      }
      partyMap.get(partyId)!.push(player.Subject)
    }

    // Filter out solo players (groups with only 1 member)
    const groups: PartyGroup[] = []
    let colorIndex = 0

    for (const [partyId, memberPuuids] of partyMap) {
      if (memberPuuids.length > 1) {
        groups.push({
          partyId,
          memberPuuids,
          color: PARTY_COLORS[colorIndex % PARTY_COLORS.length],
        })
        colorIndex++
      }
    }

    return groups
  }

  /**
   * Get the party color for a specific player.
   * Returns null if the player is solo.
   */
  getPlayerPartyColor(playerPuuid: string, parties: PartyGroup[]): string | null {
    for (const party of parties) {
      if (party.memberPuuids.includes(playerPuuid)) {
        return party.color
      }
    }
    return null
  }

  /**
   * Get all members of the same party as the given player.
   * Returns empty array if the player is solo.
   */
  getPartyMembers(playerPuuid: string, parties: PartyGroup[]): string[] {
    for (const party of parties) {
      if (party.memberPuuids.includes(playerPuuid)) {
        return party.memberPuuids.filter((p) => p !== playerPuuid)
      }
    }
    return []
  }
}
