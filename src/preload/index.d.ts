import { ElectronAPI } from '@electron-toolkit/preload'

interface ValoInsightAPI {
  minimize: () => void
  maximize: () => void
  close: () => void
  getConnectionState: () => Promise<string>
  getGameFlowPhase: () => Promise<string>
  onStateChange: (callback: (state: string) => void) => () => void
  onGameFlowPhase: (callback: (phase: string) => void) => () => void
  onPregameData: (callback: (data: unknown) => void) => () => void
  onPregameEnded: (callback: () => void) => () => void
  onGameStarted: (callback: () => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: ValoInsightAPI
  }
}
