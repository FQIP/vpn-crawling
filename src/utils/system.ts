import { promises as fs } from 'fs'
import path from 'path'
import isURL from 'validator/es/lib/isURL'

export async function downFile(filePath: string, url: string): Promise<void> {
  if (!isURL(url)) throw new Error('无效的下载链接')
  const response = await fetch(url)
  const text = await response.text()
  await fs.writeFile(filePath, text)
}

export async function copyDirectory(from: string, to: string): Promise<void> {
  await fs.mkdir(to, { recursive: true })
  const fileNames = await fs.readdir(from)
  for (const fileName of fileNames) {
    const _from = path.join(from, fileName)
    const _to = path.join(to, fileName)
    const stat = await fs.stat(_from)
    if (stat.isDirectory()) {
      await copyDirectory(_from, _to)
    } else {
      await fs.copyFile(from, to)
    }
  }
}
