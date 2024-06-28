import { app, ipcMain, shell, dialog } from 'electron'

// 打开本地文件
ipcMain.on('open-path', (_, path) => {
  shell.openPath(path)
})

// 打开选择文件夹dialog
ipcMain.handle('open-dir-dialog', async () => {
  try {
    const filePaths = await dialog.showOpenDialog({
      title: '选择下载地址',
      defaultPath: app.getPath('downloads'),
      properties: ['openDirectory']
    })
    return filePaths.filePaths[0]
  } catch (error) {
    throw new Error(error as string)
  }
})
