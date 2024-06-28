import { ipcRenderer } from 'electron'

export default {
  concurrentCrawlingCyanmori(): Promise<void> {
    return ipcRenderer.invoke('concurrent-crawling-cyanmori')
  },
  copyLatestClashLinksCyanmori(): Promise<string> {
    return ipcRenderer.invoke('copy-latest-clash-links-cyanmori')
  }
}
