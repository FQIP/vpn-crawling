import * as schedule from 'node-schedule'
import { delay } from '@/utils'
import type { ITaskConfig } from '@/types'

const schedulingMap = new Map<string, ReturnType<typeof schedule.scheduleJob>>()

export default {
  async runTask(settings: ITaskConfig): Promise<void> {
    console.log('runTask......', settings)
    await delay(8000)
  },

  runSchedule(settings: ITaskConfig): void {
    if (schedulingMap.has(settings._id)) {
      return
    }
    const scheduleJob = schedule.scheduleJob('*/3 * * * * *', (fireDate) => {
      // console.log(
      //   'This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date()
      // )
      console.log(settings._id, ' >>>>>>>>>>>>>>>> ', fireDate, new Date())
    })
    schedulingMap.set(settings._id, scheduleJob)
  },

  cancelSchedule(settings: ITaskConfig): void {
    console.log('cancelSchedule..............', settings._id)
    const scheduleJob = schedulingMap.get(settings._id)
    if (scheduleJob) {
      scheduleJob.cancel()
      schedulingMap.delete(settings._id)
    }
  }
}
