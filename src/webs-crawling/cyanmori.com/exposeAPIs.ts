import { ipcRenderer } from 'electron'

const exposeAPIs = {
  concurrentCrawlingCyanmori(): Promise<void> {
    return ipcRenderer.invoke('concurrent-crawling-cyanmori')
  },
  copyLatestClashLinksCyanmori(): Promise<string> {
    return ipcRenderer.invoke('copy-latest-clash-links-cyanmori')
  }
}

export default exposeAPIs
