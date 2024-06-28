import { sample } from 'lodash-es'
import { customAlphabet } from 'nanoid'
import isURL from 'validator/es/lib/isURL'
import { characters, emailProviders } from '@/constants'

const nanoid = customAlphabet(characters, 18) // 默认18个字符

export const delay = (t: number): Promise<any> =>
  new Promise((resolve) => setTimeout(resolve, t || 1000))

export function subHostName(url: string): string {
  if (isURL(url)) {
    const urlObject = new URL(url)
    return urlObject.hostname
  }
  return url
}

export function generateEmail(returnEmailId?: boolean): string {
  const randomProvider = sample(emailProviders)
  const randomId = nanoid(16)
  if (returnEmailId) {
    return randomId
  }
  return `${randomId}@${randomProvider}`
}

export function generateText(len?: number): string {
  len = len || 18 // 默认生成18个字符
  return nanoid(len)
}

export function createText(inputType: string): string {
  if (/email/i.test(inputType)) {
    return generateEmail(inputType === 'emailId')
  }
  return generateText()
}