import { spawn } from 'child_process'
import { BrowserWindow } from 'electron'

// 开启爬虫子进程
export function spawnPoputeerProcess(mainWindow: BrowserWindow): void {
  const child = spawn('node', ['path/to/puppeteer_script.js'])

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })

  child.on('message', (data) => {
    // 将数据发送给渲染线程
    mainWindow.webContents.send('grab-result', data)
  })
}
