
import type { ITaskConfig } from '@/types'

export const configList = [
  {
    _id: '1',
    title: 'Google',
    description: 'https://www.google.com',
    flows: [
      {
        type: 'jump',
        url: 'https://www.google.com',
        remark: '谷歌'
      }
    ]
  },
  {
    _id: 'c4V--COxy1CKsl9UsCYsJ',
    flows: [
      {
        type: 'jump',
        remark: '备注1',
        url: 'http://baidu.com'
      },
      {
        type: 'input',
        remark: '用户名',
        selector: 'input.username',
        inputType: 'username'
      },
      {
        type: 'input',
        remark: '密码',
        inputType: 'password',
        selector: 'input.password'
      },
      {
        type: 'click',
        remark: '登录',
        selector: 'button.login'
      },
      {
        type: 'click',
        remark: '跳转用户中心',
        selector: 'button.navigator-dashboard'
      },
      {
        type: 'click',
        remark: '签到',
        selector: 'button.sign'
      },
      {
        type: 'crawl',
        remark: '获取clash链接',
        selector: 'button.clash-link',
        attr: 'set-link'
      },
      {
        type: 'save',
        remark: '保存',
        path: '/user/download/.temp/clash',
        saveType: 'download - preserveSave'
      },
      {
        type: 'save',
        remark: '保存',
        path: '/user/download/.temp/clash/demo.text',
        saveType: 'download - preserveSave'
      }
    ],
    title: '爬虫1',
    description: '完整流程程完整流程完整流程完整流程'
  }
] as ITaskConfig[]