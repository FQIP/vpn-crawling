import { ipcMain } from 'electron'
import { concurrentWebCrawling } from './index'
import config from '../shared/config'
import { copyLatestClashLinks } from '../shared/utils'

// 并发爬取
ipcMain.handle('concurrent-crawling-cyanmori', () => {
  const { registerUrl, saveClashLinkFile, userCenterUrl, exportDir } = config
  return concurrentWebCrawling(registerUrl, userCenterUrl, exportDir, saveClashLinkFile, 1, 8)
})

// 复制订阅链接
ipcMain.handle('copy-latest-clash-links-cyanmori', () => {
  const { saveClashLinkFile } = config
  return copyLatestClashLinks(saveClashLinkFile)
})
