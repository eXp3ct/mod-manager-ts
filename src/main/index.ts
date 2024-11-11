import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
import fs from 'fs'
import { autoUpdater } from 'electron-updater'

function createWindow(): void {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.mod-manager')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Отслеживание прогресса загрузки обновления
  autoUpdater.on('download-progress', (progressObj) => {
    const mainWindow = BrowserWindow.getAllWindows()[0]
    const progressPercent = progressObj.percent || 0
    mainWindow.webContents.send('update-download-progress', progressPercent)
  })

  // После завершения загрузки
  autoUpdater.on('update-downloaded', () => {
    const mainWindow = BrowserWindow.getAllWindows()[0]
    mainWindow.webContents.send('update-downloaded')
  })

  // Обработка вызова для открытия окна выбора папки
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0]
    }
    return null
  })

  ipcMain.handle('download-files', async (_event, downloadUrls: string[], folderPath: string) => {
    try {
      for (const url of downloadUrls) {
        const fileName = path.basename(url)
        const filePath = path.join(folderPath, fileName)

        const response = await axios.get(url, {
          responseType: 'stream' // Указываем потоковую передачу данных
        })

        // Создаем запись в файл
        const writer = fs.createWriteStream(filePath)
        if (!fs.existsSync(filePath)) {
          response.data.pipe(writer)
        }

        // Ждем завершения записи
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve)
          writer.on('error', reject)
        })
      }

      return { success: true }
    } catch (error) {
      console.error('Ошибка при скачивании файлов:', error)
      return { success: false, error }
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
