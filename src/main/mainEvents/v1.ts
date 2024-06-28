import { ipcMain } from 'electron'
import { concurrentWebCrawling } from '@/webs-crawling/cyanmori.com'
import config from '@/webs-crawling/shared/config'
import { copyLatestClashLinks } from '@/webs-crawling/shared/utils'

// 并发爬取
ipcMain.handle('concurrent-crawling-cyanmori', () => {
  const { registerUrl, saveClashLinkFile, userCenterUrl, exportDir, copyDirectory } = config
  return concurrentWebCrawling(
    registerUrl,
    userCenterUrl,
    exportDir,
    copyDirectory,
    saveClashLinkFile,
    1,
    8
  )
})

// 复制订阅链接
ipcMain.handle('copy-latest-clash-links-cyanmori', () => {
  const { saveClashLinkFile } = config
  return copyLatestClashLinks(saveClashLinkFile)
})
