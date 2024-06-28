import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { remove } from 'lodash-es'
import { configList } from '../mock'
import type { ITaskConfig } from '@/types'

interface StoreState {
  schedulingIds: Set<string> // 正在执行的定时任务
  taskingIds: Set<string> // 正在执行的任务
  configList: ITaskConfig[]
}

export const useConfigStore = defineStore('main', {
  state: (): StoreState => {
    return {
      schedulingIds: new Set(),
      taskingIds: new Set(),
      configList: configList,
    }
  },
  actions: {
    isRunning(id: string): boolean {
      if (this.taskingIds.has(id)) {
        message.warning('当前正在执行任务，请结束后重试')
        return true
      }
      if (this.schedulingIds.has(id)) {
        message.warning('当前正在执行定时任务，请停止后重试')
        return true
      }
      return false
    },

    // 更新配置项
    updateConfig(config: ITaskConfig) {
      if (this.isRunning(config._id)) return
      const index = this.configList.findIndex((item) => item._id === config._id)
      if (index !== -1) {
        this.configList.splice(index, 1, config)
        message.success('修改成功')
      } else {
        this.configList.push(config)
        message.success('新增成功')
      }
    },

    // 删除配置项
    deleteConfig(config: ITaskConfig) {
      if (this.isRunning(config._id)) return
      remove(this.configList, { _id: config._id })
      message.success('删除成功')
    },

    // 执行爬虫
    async runTask(config: ITaskConfig) {
      const isTasking = this.taskingIds.has(config._id)
      if (isTasking) {
        message.warning('当前有任务在执行，请结束后重试')
      } else {
        try {
          this.taskingIds.add(config._id)
          // await window.api.runTask(toRaw(config))
          await window.api.concurrentCrawlingCyanmori()
          console.log('任务执行结束')
        } catch (error) {
          console.log('任务在执行失败，请重试', error)
        } finally {
          this.taskingIds.delete(config._id)
        }
      }
    },

    // 切换定时任务状态
    toggleSchedule(config: ITaskConfig) {
      const isScheduling = this.schedulingIds.has(config._id)
      const isTasking = this.taskingIds.has(config._id)
      if (isTasking) {
        message.warning('当前有任务在执行，请结束后重试')
      } else {
        if (isScheduling) {
          window.api.cancelSchedule(toRaw(config))
          this.schedulingIds.delete(config._id)
          console.log('取消定时任务........')
        } else {
          window.api.runSchedule(toRaw(config))
          this.schedulingIds.add(config._id)
          console.log('执行定时任务........')
        }
      }
    }
  },
  persist: {
    paths: ['configList']
  }
})
