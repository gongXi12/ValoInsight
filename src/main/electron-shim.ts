// This file replaces the 'electron' module in the main process build.
// It uses Node.js's module system to access the built-in Electron module
// that is compiled into the electron binary, bypassing the broken
// node_modules/electron npm package.

// In Electron's main process, the built-in 'electron' module is registered
// by the binary's custom module loader. We access it through Module._cache
// or by requiring from the Electron internals.

import Module from 'module'

// Try to find the built-in electron module in the module cache
const builtinModule = (Module as any)._cache?.electron ||
  (Module as any)._cache?.['electron:electron']

if (builtinModule) {
  module.exports = builtinModule.exports
} else {
  // Fallback: use the binary's internal require
  // The electron binary registers a custom require for built-in modules
  const electronBinary = require('./electron-path')

  // Export what we can from process and other available APIs
  const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage, clipboard, shell, dialog, session, nativeTheme, webContents } = require('electron/node_modules/electron' as string) || {}

  module.exports = { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage, clipboard, shell, dialog, session, nativeTheme, webContents }
}
