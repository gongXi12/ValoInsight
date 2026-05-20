import { readFile, access } from 'fs/promises'
import { join } from 'path'
import type { LockfileData } from '@shared/types/valorant'

/** Possible lockfile paths for Valorant */
const LOCKFILE_PATHS = [
  // Riot Client lockfile (most common)
  join(process.env.LOCALAPPDATA || '', 'Riot Games', 'Riot Client', 'Config', 'lockfile'),
  // Valorant-specific lockfile
  'C:\\Riot Games\\VALORANT\\live\\lockfile',
  'C:\\Riot Games\\VALORANT\\live\\lockfile',
  // Common install paths
  'D:\\Riot Games\\VALORANT\\live\\lockfile',
  'D:\\Riot Games\\Riot Client\\Config\\lockfile',
  'E:\\Riot Games\\VALORANT\\live\\lockfile',
  'E:\\Riot Games\\Riot Client\\Config\\lockfile',
]

/**
 * Try to find and parse the Valorant/Riot Client lockfile.
 * Returns null if no lockfile is found (client not running).
 */
export async function findLockfile(): Promise<LockfileData | null> {
  for (const lockfilePath of LOCKFILE_PATHS) {
    try {
      await access(lockfilePath)
      const content = await readFile(lockfilePath, 'utf-8')
      return parseLockfile(content)
    } catch {
      // File doesn't exist or can't be read, try next path
    }
  }
  return null
}

/**
 * Parse lockfile content.
 * Format: <name>:<pid>:<port>:<password>:<protocol>
 * On Windows the delimiter is `:`, not `|`.
 */
function parseLockfile(content: string): LockfileData {
  const parts = content.trim().split(':')
  if (parts.length < 5) {
    throw new Error(`Invalid lockfile format: ${content}`)
  }
  return {
    name: parts[0],
    pid: parseInt(parts[1], 10),
    port: parseInt(parts[2], 10),
    password: parts[3],
    protocol: parts[4],
  }
}
