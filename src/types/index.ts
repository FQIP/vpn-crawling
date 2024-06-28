import { inputTypes, saveTypes } from '@/constants'

export type ActionType = 'jump' | 'click' | 'input' | 'wait' | 'crawl' | 'save'

export interface IFlowBase {
  type: ActionType
  remark?: string
}

export type InputType = (typeof inputTypes)[number]['type']
export type TSaveType = (typeof saveTypes)[number]['type']
export type TFlow = IFlowJump | IFlowClick | IFlowInput | IFlowWait | IFlowCrawl | IFlowSave

export interface IFlowJump extends IFlowBase {
  type: 'jump'
  url: string
}

export interface IFlowClick extends IFlowBase {
  type: 'click'
  selector: string
}

export interface IFlowInput extends IFlowBase {
  type: 'input'
  selector: string
  inputType: string
}

export interface IFlowWait extends IFlowBase {
  type: 'wait'
  delay: number
}

export interface IFlowCrawl extends IFlowBase {
  type: 'crawl'
  selector: string
  attr: string
}

export interface IFlowSave extends IFlowBase {
  type: 'save'
  path: string
  saveType: TSaveType
}

export interface ITaskConfig {
  _id: string
  title: string
  description?: string
  concurrent?: number // 同时运行的流程数量
  failTry?: number // 失败重试次数
  flows: TFlow[]
}
