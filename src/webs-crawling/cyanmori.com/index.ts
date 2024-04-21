import { promises as fs } from 'fs'
import * as path from 'path'
import * as puppeteer from 'puppeteer'
import {
  crawlPage,
  generateRandomEmail,
  launchBrowser,
  writeRemoteFile,
  copyDir
} from '../shared/utils'

type SubscriptionType = 'clash' | 'stash'
type Action = () => string | undefined | null
type ActionsMap = Record<SubscriptionType, Action>

/**
 * 注册函数，使用 Puppeteer 在页面上注册用户。
 *
 * @param {puppeteer.Page} page - Puppeteer Page 实例，表示网页。
 * @returns {Promise<void>} 当注册过程完成时解析的 Promise。
 * @description 该函数通过以下步骤完成用户注册：
 *   1. 随机生成邮箱。
 *   2. 等待 "name" 输入框元素加载并填写用户名。
 *   3. 等待 "email" 输入框元素加载并填写邮箱。
 *   4. 等待 "passwd" 输入框元素加载并填写密码。
 *   5. 等待 "repasswd" 输入框元素加载并填写确认密码。
 *   6. 点击注册按钮。
 *
 *   注意：在每个输入框中输入时会有延迟（delay）设置为100毫秒。
 */
async function register(page: puppeteer.Page): Promise<void> {
  // 延迟7秒
  await new Promise((r) => setTimeout(r, 7000))
  // 随机生成邮箱
  const randomEmail = generateRandomEmail()
  // 填写用户名
  const username = await page.waitForSelector("input[name='name']")
  await username?.type(randomEmail.split('@')[0], { delay: 100 })
  // 填写邮箱
  const email = await page.waitForSelector("input[name='email']")
  await email?.type(randomEmail, { delay: 100 })
  // 填写密码
  const pwd = await page.waitForSelector("input[name='passwd']")
  await pwd?.type(randomEmail, { delay: 100 })
  // 确认密码
  const repwd = await page.waitForSelector("input[name='repasswd']")
  await repwd?.type(randomEmail, { delay: 100 })
  // 点击注册
  await page.click('#login_submit')
}

/**
 * 在页面上等待注册提示信息显示，并打印该信息。
 *
 * @param {puppeteer.Page} page - Puppeteer 页面对象。
 * @returns {Promise<void>} 返回一个 Promise，表示异步操作的完成状态。
 * @description 在页面上等待注册提示信息显示，并打印该信息。
 */
async function waitForRegistrationTip(page: puppeteer.Page): Promise<void> {
  const tipElement = await page.waitForSelector('.lead.text-muted')
  const tipPropertyHandle = await tipElement?.getProperty('textContent')
  const tipText = await tipPropertyHandle?.jsonValue()
  console.log('注册提示信息: ', tipText)
}

/**
 * 根据订阅类型获取相应的操作函数
 * @param {string} subscriptionType - 订阅类型
 * @returns {Action} 一个返回字符串或 null 的函数，代表对应的操作
 */
function getSubscriptionActions(subscriptionType: SubscriptionType): Action {
  const actionsMap: ActionsMap = {
    clash() {
      return document.querySelector('.dropdown-item.copy-text')?.getAttribute('data-clipboard-text')
    },
    stash() {
      return document
        .querySelector('.btn.btn-pill.btn-surfboard.dropdown-toggle')
        ?.nextElementSibling?.querySelector('.dropdown-item.copy-text')
        ?.getAttribute('data-clipboard-text')
    }
  }

  return actionsMap[subscriptionType]
}

/**
 * 跳转用户中心并获取订阅链接。
 *
 * @param {puppeteer.Page} page - Puppeteer 页面对象。
 * @param {string} userCenterUrl - 用户中心页面的URL。
 * @returns {Promise<string | null | undefined>} 返回一个 Promise，表示异步操作的完成状态，包含订阅链接的字符串或空值。
 * @description 该函数将页面导航到指定的用户中心 URL，点击签到按钮，并从页面中提取出 Clash 订阅链接。
 */
async function getSubscriptionLink(page: puppeteer.Page, userCenterUrl: string): Promise<string> {
  // 跳转用户中心页
  await page.goto(userCenterUrl)
  // 点击签到
  const checkinButton = await page.waitForSelector('#checkin')
  await checkinButton?.click()
  // 获取clash订阅链接
  const subscriptionAction = getSubscriptionActions('stash')
  const clashLink = await page.evaluate(subscriptionAction)
  return clashLink || ''
}

/**
 * 并发爬取网页数据并保存到本地文件。
 *
 * @param {string} registerUrl - 注册页面的URL。
 * @param {string} userCenterUrl - 用户中心页面的URL。
 * @param {string} saveDirectory - 保存文件的目录。
 * @param {string} copyDirectory - 备份文件的目录。
 * @param {string} saveClashLinkFile - 保存订阅链接地址的文件路径。
 * @param {number} startIndex - 起始索引。
 * @param {number} endIndex - 结束索引。
 * @returns {Promise<void>} 当所有爬取任务完成时解析的Promise。
 * @description 这个函数使用 Puppeteer 库进行并发网页爬取，并将结果保存到本地文件夹中。
 * @note 每个页面对应一个浏览器实例，可以解决登陆信息串扰问题
 */
export async function concurrentWebCrawling(
  registerUrl: string,
  userCenterUrl: string,
  saveDirectory: string,
  copyDirectory: string,
  saveClashLinkFile: string,
  startIndex: number,
  endIndex: number
): Promise<void> {
  const browserInstances: puppeteer.Browser[] = []
  const clashLinks: string[] = []
  try {
    await Promise.allSettled(
      Array.from({ length: endIndex - startIndex + 1 }, async (_, index) => {
        const cIndex = startIndex + index
        try {
          const browser = await launchBrowser()
          browserInstances.push(browser)
          const clashLink = await crawlPage(browser, registerUrl, async (page) => {
            await register(page)
            await waitForRegistrationTip(page)
            return getSubscriptionLink(page, userCenterUrl)
          })
          clashLinks[index] = `${cIndex}---：\n${clashLink}`
          console.error(`第${cIndex}个爬虫任务执行成功，爬取到的订阅链接为：${clashLink}`)
          const filePath = path.join(saveDirectory, `${cIndex}.yaml`)
          return writeRemoteFile(filePath, clashLink)
        } catch (error) {
          console.error(`第${cIndex}个爬虫任务执行失败，失败详情：${error}`)
          throw error
        }
      })
    )
    await copyDir(saveDirectory, copyDirectory)
  } finally {
    console.log('爬虫结束，关闭浏览器')
    browserInstances.forEach((browser) => browser.close())
    fs.writeFile(saveClashLinkFile, clashLinks.join('\n'))
  }
}
