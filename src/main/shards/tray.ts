import { Tray, Menu, nativeImage, app } from 'electron'
import { join } from 'path'
import { BaseShard } from './base'
import { existsSync } from 'fs'
import { ValorantClientShard } from './valorant-client'
import { WindowManagerShard } from './window-manager'

/**
 * System tray icon and context menu.
 */
export class TrayShard extends BaseShard {
  readonly name = 'tray'

  private tray: Tray | null = null
  private valorantClient: ValorantClientShard
  private windowManager: WindowManagerShard

  constructor(valorantClient: ValorantClientShard, windowManager: WindowManagerShard) {
    super()
    this.valorantClient = valorantClient
    this.windowManager = windowManager
  }

  async onInit(): Promise<void> {
    this.createTray()

    // Update tray tooltip based on connection state
    this.valorantClient.events.on('state-change', (state) => {
      this.tray?.setToolTip(`ValoInsight - ${state}`)
    })
  }

  async onDispose(): Promise<void> {
    this.tray?.destroy()
  }

  private createTray(): void {
    const iconPath = app.isPackaged
      ? join(process.resourcesPath, 'resources/icon.png')
      : join(__dirname, '../../resources/icon.png')
    const icon = existsSync(iconPath)
      ? nativeImage.createFromPath(iconPath)
      : nativeImage.createEmpty()

    this.tray = new Tray(icon)
    this.tray.setToolTip('ValoInsight - Disconnected')

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Main Window',
        click: () => {
          this.windowManager.getMainWindow()?.show()
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.quit()
        },
      },
    ])

    this.tray.setContextMenu(contextMenu)

    this.tray.on('double-click', () => {
      this.windowManager.getMainWindow()?.show()
    })
  }
}
