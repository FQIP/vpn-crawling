import { promises as fs } from 'fs'
import path from 'path'
import * as puppeteer from 'puppeteer'
import type {
  ActionType,
  IFlowJump,
  IFlowClick,
  IFlowInput,
  IFlowWait,
  IFlowCrawl,
  IFlowSave,
  ITaskConfig,
  TFlow
} from '@/types'
import { delay, createText } from '@/utils'
import { downFile } from '@/utils/system'

type TBrowser = puppeteer.Browser
type TPage = puppeteer.Page
type TRuntimeVars = Array<{
  browser: TBrowser
  page: TPage
  crawlResult: Record<string, string[]>
}>
type TRunFlowParams<T extends TFlow> = {
  page: TPage
  flow: T
  concurrentIndex: number
  flowIndex: number
}

let runtimeVars: TRuntimeVars = []
let hasPreserveSave: boolean = false

export async function initRuntimeVars(settings: ITaskConfig): Promise<void> {
  const { concurrent, flows } = settings
  runtimeVars = []
  for (let i = 0; i < (concurrent || 1); i++) {
    const browser = await createBrowser()
    const page = await createPage(browser)
    runtimeVars.push({
      browser,
      page,
      crawlResult: flows.reduce((res, p, i) => {
        if (p.type === 'save') {
          res[i] = []
        }
        return res
      }, {})
    })
  }
}

export async function createBrowser(): Promise<TBrowser> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  return browser
}

export async function setFingerprinting(page: TPage): Promise<void> {
  await page.setViewport({ width: 1366, height: 1024 })
  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1'
  )
}

export async function createPage(browser: TBrowser): Promise<TPage> {
  const page = await browser.newPage()
  await setFingerprinting(page)
  return page
}

// 跳转
export async function jumpFlow(params: TRunFlowParams<IFlowJump>): Promise<void> {
  const { page, flow } = params
  const { url } = flow
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
}

// 点击
export async function clickFlow(params: TRunFlowParams<IFlowClick>): Promise<void> {
  const { page, flow } = params
  const { selector } = flow
  const element = await page.waitForSelector(selector)
  await element?.click()
}

// 输入
export async function inputFlow(params: TRunFlowParams<IFlowInput>): Promise<void> {
  const { page, flow } = params
  const { selector, inputType } = flow
  const element = await page.waitForSelector(selector)
  const inputText = createText(inputType)
  await element?.type(inputText, { delay: 100 })
}

// 等待
export async function waitFlow(params: TRunFlowParams<IFlowWait>): Promise<void> {
  const { flow } = params
  const t = Number(flow.delay || 0) * 1000
  await delay(t)
}

// 爬虫
export async function crawlFlow(params: TRunFlowParams<IFlowCrawl>): Promise<void> {
  const { page, flow, concurrentIndex, flowIndex } = params
  const { selector, attr } = flow
  const crawlAction = (): string => {
    const element = document.querySelector(selector)
    if (!element) return ''
    return element.getAttribute(attr) || element[attr] || ''
  }
  const crawlContent = await page.evaluate(crawlAction)
  console.log('crawlContent', crawlContent)
  runtimeVars[concurrentIndex].crawlResult[flowIndex].concat(crawlContent)
}

// 保存
export async function saveFlow(params: TRunFlowParams<IFlowSave>): Promise<void> {
  const { flow, concurrentIndex, flowIndex } = params
  const { path: savePath, saveType } = flow
  // 远程下载后保存
  if (/download/i.test(saveType)) {
    const { crawlResult } = runtimeVars[concurrentIndex]
    const results = crawlResult[flowIndex]
    for (let i = 0; i < results.length; i++) {
      const filePath = path.join(savePath, `${concurrentIndex}-${flowIndex}.yaml`)
      await downFile(filePath, results[i])
    }
  }
  // 原样保存
  if (/preserveSave/i.test(saveType)) {
    hasPreserveSave = true
  }
}

// 最后统一下载
export async function combinePreserveSave(flows: TFlow[]): Promise<void> {
  const temp: Record<string, string[]> = {}
  for (let i = 0; i < runtimeVars.length; i++) {
    const { crawlResult } = runtimeVars[i]
    Object.entries(crawlResult).forEach(([key, value]) => {
      temp[key] = (temp[key] || []).concat(value)
    })
  }
  const tasks = Object.entries(temp).map(([key, value]) => {
    if (value.length === 0) return Promise.resolve()
    const savePath = path.join(flows[key].path, `${key}.text`)
    return fs.writeFile(savePath, value.join('\n'))
  })
  await Promise.allSettled(tasks)
}

// 运行流程
export async function runFlows(
  concurrentIndex: number,
  browser: TBrowser,
  page: TPage,
  flows: TFlow[]
): Promise<void> {
  const runMap: Record<ActionType, (params: TRunFlowParams<any>) => Promise<any>> = {
    jump: jumpFlow,
    input: inputFlow,
    click: clickFlow,
    wait: waitFlow,
    crawl: crawlFlow,
    save: saveFlow
  }
  for (let i = 0; i < flows.length; i++) {
    const flow = flows[i]
    const flowTask = runMap[flow.type]
    await flowTask({ page, flow, concurrentIndex, flowIndex: i })
  }
  await browser.close()
  await page.close()
}

// 运行
export async function run(settings: ITaskConfig): Promise<void> {
  try {
    const { flows } = settings
    await initRuntimeVars(settings)
    const taskList = Array.from({ length: runtimeVars.length }, (_, i) => {
      const { browser, page } = runtimeVars[i]
      return runFlows(i, browser, page, flows)
    })
    await Promise.allSettled(taskList)
    if (hasPreserveSave) {
      await combinePreserveSave(flows)
    }
  } catch (error) {
    console.error(error)
  } finally {
    console.log('爬虫结束')
  }
}
