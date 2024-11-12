import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: MyElectronAPI
    api: unknown
  }

  interface MyElectronAPI extends ElectronAPI {
    selectFolder: () => Promise<string | null>
    downloadFiles: (
      downloadUrls: string,
      folderPath: string
    ) => Promise<{ success: boolean; error?: unknown; md5Hash: string; sha1Hash: string }>
  }
}
