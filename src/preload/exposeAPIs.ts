import { ipcRenderer } from 'electron'
import exposeApIsCyanmori from '../webs-crawling/cyanmori.com/exposeAPIs'

const exposeAPIs = {
  openPath(path: string): void {
    ipcRenderer.send('open-path', path)
  },
  openDirDialog(): Promise<string | undefined> {
    return ipcRenderer.invoke('open-dir-dialog')
  },
  ...exposeApIsCyanmori
}

export default exposeAPIs
