/**
 * Base class for all shards (modular functional units).
 * Each shard handles a specific concern and can be initialized/disposed independently.
 */
export abstract class BaseShard {
  abstract readonly name: string

  /** Called once when the app starts. Set up event listeners, timers, etc. */
  abstract onInit(): Promise<void> | void

  /** Called when the app shuts down. Clean up resources. */
  abstract onDispose(): Promise<void> | void
}
