import { ElectronAPI } from '@electron-toolkit/preload'
import type { ITaskConfig } from '.'

interface ExposeCommonAPIs {
  openPath: (path: string) => void
  openDirDialog: () => Promise<string | undefined>
}

interface ExposeV1APIs {
  concurrentCrawlingCyanmori: () => Promise<void>
  copyLatestClashLinksCyanmori: () => Promise<string>
}

interface ExposeV2APIs {
  runTask: (settings: ITaskConfig) => Promise<void>
  runSchedule: (settings: ITaskConfig) => void
  cancelSchedule: (settings: ITaskConfig) => void
}

export type ExposeAPIs = ExposeV1APIs & ExposeV2APIs & ExposeCommonAPIs

declare global {
  interface Window {
    electron: ElectronAPI
    api: ExposeAPIs
  }
}