import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
import fs from 'fs'
import { autoUpdater } from 'electron-updater'
import crypto from 'crypto'
import AdmZip from 'adm-zip'

export type Manifest = {
  minecraft: {
    version: string
    modLoaders: { id: string; primary: boolean }[]
  }
  manifestType: string
  manifestVersion: number
  name: string
  version: string
  author: string
  files: { projectID: number; fileID: number; required: boolean }[]
  overrides: string
}

export type ApiData<T> = {
  data: T
}

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'eXp3ct',
  repo: 'mod-manager-ts'
})

function createWindow(): void {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon: icon,
    title: 'mod-manager',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  autoUpdater.checkForUpdates()
  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  autoUpdater.on('update-available', () => {
    // Уведомить рендер-процесс о начале загрузки
    mainWindow.webContents.send('update-available')
  })

  autoUpdater.on('download-progress', (progressObj) => {
    const progress = Math.round(progressObj.percent) // Прогресс в процентах
    mainWindow.webContents.send('update-progress', progress)
  })

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-downloaded') // Сообщить, что обновление загружено
    autoUpdater.quitAndInstall() // Перезапустить приложение для установки обновления
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
  electronApp.setAppUserModelId('mod-manager')

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

  ipcMain.handle('download-file', async (_event, url: string, folderPath: string) => {
    try {
      const fileName = path.basename(url)
      const filePath = path.join(folderPath, fileName)

      // Проверяем существует ли файл
      if (fs.existsSync(filePath)) {
        // Читаем как бинарные данные
        const fileContent = fs.readFileSync(filePath)
        const md5Hash = crypto.createHash('md5').update(fileContent).digest('hex')
        const sha1Hash = crypto.createHash('sha1').update(fileContent).digest('hex')

        return {
          success: true,
          sha1Hash: sha1Hash,
          md5Hash: md5Hash
        }
      }

      const response = await axios.get(url, {
        responseType: 'arraybuffer'
      })

      fs.writeFileSync(filePath, response.data)
      let fileContent: Buffer
      if (filePath.endsWith('.zip')) {
        try {
          const zip = new AdmZip(filePath)
          zip.extractAllTo(folderPath, true)

          const overridesPath = path.join(folderPath, 'overrides')
          if (fs.existsSync(overridesPath) && fs.lstatSync(overridesPath).isDirectory()) {
            const files = fs.readdirSync(overridesPath)

            const parentFolderPath = path.dirname(folderPath)

            for (const file of files) {
              const sourcePath = path.join(overridesPath, file)
              const destPath = path.join(parentFolderPath, file)
              fs.renameSync(sourcePath, destPath)
            }

            fs.rmdirSync(overridesPath)
          }

          // Считываем файл manifest.json
          const manifestPath = path.join(folderPath, 'manifest.json')
          const manifestContent = fs.readFileSync(manifestPath, 'utf8')
          const manifest: Manifest = JSON.parse(manifestContent)

          // Загружаем файлы по ссылкам из manifest.json
          for (const file of manifest.files) {
            let downloadUrl = ''
            try {
              downloadUrl = (
                await axios.get<ApiData<string>>(
                  `https://api.curseforge.com/v1/mods/${file.projectID}/files/${file.fileID}/download-url`,
                  {
                    headers: {
                      'x-api-key': import.meta.env.VITE_API_KEY
                    }
                  }
                )
              ).data.data
            } catch (error) {
              console.log('Error fetching download url', error)
              continue
            }
            const fileResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' })
            const filePath = path.join(folderPath, path.basename(downloadUrl))
            fs.writeFileSync(filePath, fileResponse.data)
          }

          console.log('Unpacking done')
        } catch (error) {
          console.error('Unpacking error:', error)
        }
      }
      if (filePath.endsWith('.zip')) {
        fileContent = fs.readFileSync(filePath)
        fs.unlinkSync(filePath)
      } else {
        fileContent = fs.readFileSync(filePath)
      }
      const md5Hash = crypto.createHash('md5').update(fileContent).digest('hex')
      const sha1Hash = crypto.createHash('sha1').update(fileContent).digest('hex')

      return {
        success: true,
        sha1Hash: sha1Hash,
        md5Hash: md5Hash
      }
    } catch (error) {
      console.error('Error installing mod:', error)
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
