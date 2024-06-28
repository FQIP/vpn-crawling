import { ipcRenderer } from 'electron'

export default {
  // 根据路径打开文件夹
  openPath(path: string): void {
    ipcRenderer.send('open-path', path)
  },

  // 选取文件夹
  openDirDialog(): Promise<string | undefined> {
    return ipcRenderer.invoke('open-dir-dialog')
  }
}
