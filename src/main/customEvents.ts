import { app, ipcMain, shell, dialog } from 'electron'
import { concurrentWebCrawling } from '../webs-crawling/cyanmori.com/index'
import config from '../webs-crawling/shared/config'

// 打开本地文件
ipcMain.on('open-path', (_, path) => {
  shell.openPath(path)
})

// 打开选择文件夹dialog
ipcMain.handle('open-dir-dialog', () => {
  const filePaths = dialog.showOpenDialogSync({
    title: '选择下载地址',
    defaultPath: app.getPath('downloads'),
    properties: ['openDirectory']
  })
  if (filePaths) {
    return Promise.resolve(filePaths[0])
  } else {
    return Promise.reject('not select')
  }
})

// 并发爬取
ipcMain.handle('concurrent-crawling', () => {
  const { registerUrl, userCenterUrl, exportDir } = config
  return concurrentWebCrawling(registerUrl, userCenterUrl, exportDir, 1, 8)
})
