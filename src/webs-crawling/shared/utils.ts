import { promises as fs } from 'fs'
import * as puppeteer from 'puppeteer'
import { failureConfig, letters, mailProviders } from './constants'

function getRandomChar(arr): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * 生成随机的电子邮件地址。
 *
 * @returns {string} 返回一个字符串，表示生成的随机电子邮件地址。
 * @description 该函数用于生成随机的电子邮件地址。它首先生成一个由两个随机字母和当前时间戳组成的字符串，然后从邮件提供者列表中随机选择一个邮件提供者，最后将两部分连接起来形成完整的电子邮件地址，并返回结果字符串。
 */
export function generateRandomEmail(): string {
  const mail = Array.from({ length: 2 }, () => getRandomChar(letters)).join('') + Date.now()
  const mailProvider = getRandomChar(mailProviders)
  return `${mail}@${mailProvider}`
}

/**
 * 启动 Puppeteer 浏览器。
 *
 * @returns {Promise<puppeteer.Browser>} 返回一个 Promise，表示异步操作的完成状态，包含 Puppeteer 浏览器对象。
 * @description 该函数用于启动 Puppeteer 浏览器。它会以无头模式（headless）启动浏览器，并传递一些参数用于配置浏览器实例。参数中设置了 `--no-sandbox` 和 `--disable-setuid-sandbox` 选项，用于禁用沙箱和设置用户权限。最后，函数将返回一个包含浏览器对象的 Promise。
 */
export const launchBrowser = async (): Promise<puppeteer.Browser> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  return browser
}

/**
 * 导航到指定页面的封装函数。
 *
 * @param {puppeteer.Page} page - Puppeteer 页面对象。
 * @param {string} url - 要导航到的页面地址。
 * @param {number} [count=0] - 重试计数器，默认为 0。
 * @returns {Promise<puppeteer.HTTPResponse | null>} 返回一个 Promise，表示异步操作的完成状态，包含页面响应信息或空值。
 * @description 该函数是对 Puppeteer 中 page.goto 方法的封装。它会使用给定的页面对象导航到指定的页面地址，并设置等待直到 DOMContentLoaded 事件触发，并设置最长超时时间为 15000 毫秒。如果导航失败，函数将根据配置中的最大重试次数和延迟时间进行重试，直到达到最大重试次数或导航成功为止。如果达到最大重试次数仍无法成功导航，将抛出错误并返回一个被拒绝的 Promise。
 */
export async function goToPage(
  page: puppeteer.Page,
  url: string,
  count = 0
): Promise<puppeteer.HTTPResponse | null> {
  try {
    return await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
  } catch (error) {
    const { maxTry, delay } = failureConfig
    if (maxTry > count) {
      await new Promise((resolve) => setTimeout(resolve, delay + Math.random() * delay))
      return goToPage(page, url, count + 1)
    } else {
      console.error('打开页面失败: ', error)
      throw error
    }
  }
}

/**
 * 使用 Puppeteer 在指定浏览器中爬取页面并执行爬取操作。
 *
 * @param {puppeteer.Browser} browser - Puppeteer 浏览器对象。
 * @param {string} url - 要爬取的页面地址。
 * @param {(page: puppeteer.Page) => Promise<T>} crawlingAction - 爬取操作的回调函数，接收一个 Puppeteer 页面对象作为参数，并返回一个 Promise。
 * @returns {Promise<T>} 返回一个 Promise，表示异步操作的完成状态，包含爬取操作的结果。
 * @description 该函数使用 Puppeteer 在指定的浏览器中导航到给定的页面地址，并执行提供的爬取操作回调函数。在爬取页面之前，它会配置页面的视口和用户代理。最后，它将爬取操作回调函数的返回值作为 Promise 的结果进行返回。
 */
export async function crawlPage<T>(
  browser: puppeteer.Browser,
  url: string,
  crawlingAction: (page: puppeteer.Page) => Promise<T>
): Promise<T> {
  const page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 1024 })
  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1'
  )
  await goToPage(page, url)
  return crawlingAction(page)
}

/**
 * 验证链接是否有效
 *
 * @param {string} link - 要验证的链接
 * @returns {boolean} 指示链接是否有效的布尔值
 */
export function isLinkValid(link: string): boolean {
  return /^https?:\/\//i.test(link)
}

/**
 * 从文件路径中获取文件名
 *
 * @param {string} filePath - 文件路径
 * @returns {string} 提取的文件名
 */
export function getFileNameFromPath(filePath: string): string {
  return filePath.substring(filePath.lastIndexOf('/') + 1)
}

/**
 * 将远程链接内容写入本地文件。
 *
 * @param {string} filePath - 文件路径。
 * @param {string | null} [link] - 远程链接，可选。
 * @returns {Promise<string>} 返回一个 Promise，表示异步操作的完成状态，包含成功保存文件的提示信息。
 * @throws {Error} 当链接无效时，抛出错误。
 * @description 该函数将给定的远程链接内容写入本地文件。首先，它会验证链接是否以 "http://" 或 "https://" 开头；然后，它使用 Fetch API 获取链接的内容；最后，它将获取到的内容写入指定的文件中，并返回成功保存文件的提示信息。
 */
export async function writeRemoteFile(filePath: string, link?: string | null): Promise<void> {
  if (!link || !isLinkValid(link)) {
    throw new Error('无效的链接')
  }
  const fileName = getFileNameFromPath(filePath)
  const response = await fetch(link)
  const text = await response.text()
  try {
    await fs.writeFile(filePath, text)
    console.log(`文件 ${fileName} 已保存成功`)
  } catch (error) {
    console.error(`文件 ${fileName} 写入失败: ${error}`)
    throw error
  }
}

/**
 * 复制最新的Clash链接到指定文件。
 *
 * @param {string} filePath - 目标文件路径。
 * @returns {Promise<string>} - 返回一个Promise，表示操作的结果消息。
 */
export async function copyLatestClashLinks(filePath: string): Promise<void> {
  try {
    const data = await fs.readFile(filePath, 'utf8')
    console.log('文件内容读取成功！')
    // 由于在clipboardy中使用了require语句导入了一个ES模块（clipboardy），而当前的环境不支持直接在CommonJS模块中使用require导入ES模块。
    const clipboardy = await import('clipboardy')
    await clipboardy.default.writeSync(data)
    console.log('文件内容复制成功！')
  } catch (err) {
    console.error('文件内容读取或复制失败：', err)
    throw err
  }
}
