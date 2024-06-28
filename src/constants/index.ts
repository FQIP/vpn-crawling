export const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const emailProviders = ['gmail.com']

export const inputTypes = [
  { name: '用户名', type: 'username' },
  { name: '邮箱', type: 'email' },
  { name: '邮箱ID', type: 'emailId' },
  { name: '密码', type: 'password' },
  { name: '确认密码', type: 'repassword' },
  { name: '文本', type: 'text' }
] as const

export const saveTypes = [
  { name: '下载链接', type: 'download' },
  { name: '原样保存', type: 'preserveSave' },
  { name: '全部', type: 'download - preserveSave' }
] as const
