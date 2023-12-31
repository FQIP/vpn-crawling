import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  openPath(path: string): void {
    ipcRenderer.send('open-path', path)
  },
  openDirDialog(): Promise<unknown> {
    return ipcRenderer.invoke('open-dir-dialog')
  },
  concurrentCrawling(): Promise<void> {
    return ipcRenderer.invoke('concurrent-crawling')
  },
  copyLatestClashLinks(): Promise<string> {
    return ipcRenderer.invoke('copy-latest-clash-links')
  }
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
