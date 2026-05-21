import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Window controls
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),

  // Connection state
  getConnectionState: () => ipcRenderer.invoke('valorant:get-connection-state'),
  getGameFlowPhase: () => ipcRenderer.invoke('valorant:get-gameflow-phase'),

  // Settings
  getRegion: () => ipcRenderer.invoke('settings:get-region'),
  setRegion: (region: string) => ipcRenderer.invoke('settings:set-region', region),

  // Event listeners
  onStateChange: (callback: (state: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, state: string) => callback(state)
    ipcRenderer.on('valorant:state-change', handler)
    return () => ipcRenderer.removeListener('valorant:state-change', handler)
  },

  onGameFlowPhase: (callback: (phase: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, phase: string) => callback(phase)
    ipcRenderer.on('valorant:gameflow-phase', handler)
    return () => ipcRenderer.removeListener('valorant:gameflow-phase', handler)
  },

  onPregameData: (callback: (data: unknown) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: unknown) => callback(data)
    ipcRenderer.on('game:pregame-data', handler)
    return () => ipcRenderer.removeListener('game:pregame-data', handler)
  },

  onPregameEnded: (callback: () => void) => {
    const handler = () => callback()
    ipcRenderer.on('game:pregame-ended', handler)
    return () => ipcRenderer.removeListener('game:pregame-ended', handler)
  },

  onGameStarted: (callback: () => void) => {
    const handler = () => callback()
    ipcRenderer.on('game:started', handler)
    return () => ipcRenderer.removeListener('game:started', handler)
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
