import { BrowserWindow, screen, app } from 'electron'
import { join } from 'path'
import { BaseShard } from './base'

function getIsDev(): boolean {
  try {
    return !app.isPackaged
  } catch {
    return true
  }
}

/**
 * Manages the application windows:
 * - Main window: settings, stats overview
 * - Overlay window: transparent always-on-top during agent select
 */
export class WindowManagerShard extends BaseShard {
  readonly name = 'window-manager'

  private mainWindow: BrowserWindow | null = null
  private overlayWindow: BrowserWindow | null = null

  async onInit(): Promise<void> {
    this.createMainWindow()
  }

  async onDispose(): Promise<void> {
    this.mainWindow?.destroy()
    this.overlayWindow?.destroy()
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow
  }

  getOverlayWindow(): BrowserWindow | null {
    return this.overlayWindow
  }

  /** Show the overlay window (during agent select) */
  showOverlay(): void {
    if (!this.overlayWindow) {
      this.createOverlayWindow()
    }
    this.overlayWindow?.showInactive()
  }

  /** Hide the overlay window */
  hideOverlay(): void {
    this.overlayWindow?.hide()
  }

  private createMainWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 480,
      height: 640,
      show: false,
      frame: false,
      transparent: true,
      resizable: true,
      icon: getIsDev()
        ? join(__dirname, '../../resources/icon.ico')
        : join(process.resourcesPath, 'resources/icon.ico'),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
      },
    })

    this.mainWindow.on('ready-to-show', () => {
      this.mainWindow?.show()
    })

    if (getIsDev() && process.env['ELECTRON_RENDERER_URL']) {
      this.mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/main/index.html`)
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/main/index.html'))
    }
  }

  private createOverlayWindow(): void {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize

    this.overlayWindow = new BrowserWindow({
      width: Math.floor(width * 0.3),
      height: Math.floor(height * 0.8),
      x: Math.floor(width * 0.01),
      y: Math.floor(height * 0.1),
      show: false,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      focusable: false,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
      },
    })

    // Allow click-through on transparent areas
    this.overlayWindow.setIgnoreMouseEvents(true, { forward: true })

    if (getIsDev() && process.env['ELECTRON_RENDERER_URL']) {
      this.overlayWindow.loadURL(
        `${process.env['ELECTRON_RENDERER_URL']}/overlay/index.html`
      )
    } else {
      this.overlayWindow.loadFile(join(__dirname, '../renderer/overlay/index.html'))
    }
  }
}
