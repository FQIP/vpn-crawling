<template>
  <div class="config-list flex gap-2">
    <!-- 配置列表 -->
    <template v-for="(config, index) in store.configList" :key="index">
      <a-card
        :title="config.title"
        class="config w-1/4 flex flex-col h-full"
        hoverable
        @click.prevent="checkCard(index)"
      >
        <template #extra>
          <pushpin-filled v-show="index === showCardIndex" class="text-blue-600" />
        </template>
        <template #actions>
          <edit-outlined style="color: black" @click.stop="showModal(config)" />
          <a-popconfirm
            title="确认要删除该配置?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(config)"
          >
            <!-- @click.stop="() => {}" 是用于阻止点击事件冒泡到父元素 -->
            <delete-outlined @click.stop="() => {}" style="color: red" />
          </a-popconfirm>
          <loading-outlined v-if="store.taskingIds.has(config._id)" style="color: green" />
          <bug-outlined v-else style="color: green" @click.stop="runTask(config)" />
          <clock-circle-outlined
            :style="{ color: store.schedulingIds.has(config._id) ? 'blue' : 'gray' }"
            @click.stop="toggleSchedule(config)"
          />
        </template>
        <div class="text-ellipsis line-clamp-2 text-gray-500 my-1">
          {{ config.description || '未说明' }}
        </div>
      </a-card>
    </template>
    <!-- 增加选项卡按钮 -->
    <div
      v-if="store.configList.length < 4"
      class="w-32 h-32 my-auto bg-white cursor-pointer hover:shadow-lg rounded-full flex justify-center items-center scale-70 transition duration-300 ease-out"
      :class="{ 'rotate-45': open, 'scale-80': open }"
      @click="showModal()"
    >
      <plus-outlined class="text-3xl text-slate-300" />
    </div>
    <!-- 配置弹窗 -->
    <a-modal
      v-model:open="open"
      centered
      width="800px"
      :body-style="{
        'min-height': '400px',
        'max-height': '70vh',
        'overflow-x': 'hidden',
        'overflow-y': 'scroll'
      }"
      :closable="false"
      @ok="handleUpdate"
    >
      <a-form ref="formRef" :model="configModel" :label-col="{ span: 2 }">
        <!-- 基本信息 -->
        <h2 class="m-0 mb-3 sticky top-0 bg-white z-10">基本信息</h2>
        <a-form-item
          label="标题"
          name="title"
          :rules="{
            required: true,
            message: '请输入标题或网站名称'
          }"
        >
          <a-input
            v-model:value="configModel.title"
            placeholder="请输入标题或网站名称"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea
            v-model:value="configModel.description"
            placeholder="请输入描述"
            allow-clear
          />
        </a-form-item>
        <!-- 基础配置 -->
        <h2 class="m-0 mb-3 sticky top-0 bg-white z-10">基础配置</h2>
        <a-form-item label="并发数" name="concurrent">
          <a-input-number
            v-model:value="configModel.concurrent"
            placeholder="并发爬虫数，默认为: 1"
            class="w-full"
            :min="1"
            :max="8"
          />
        </a-form-item>
        <!-- 流程配置 -->
        <h2 class="m-0 mb-3 sticky top-0 bg-white z-10">流程配置</h2>
        <a-row
          v-for="(flow, index) in configModel.flows"
          :key="index"
          :gutter="{ xs: 4, sm: 8, md: 12 }"
          align="middle"
        >
          <a-col :span="4">
            <a-form-item :name="['flows', index, 'type']">
              <FlowTypes v-model:value="flow.type" @select="flowTypeSelect(index, $event)" />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-form-item :name="['flows', index, 'remark']">
              <a-input v-model:value="flow.remark" placeholder="备注" />
            </a-form-item>
          </a-col>
          <a-col :span="13">
            <component
              :index="index"
              :is="flowComponentMap[flow.type]"
              v-model:flow="configModel.flows[index]"
            />
          </a-col>
          <a-col :span="3" class="flex justify-around items-center mb-6">
            <plus-circle-filled class="text-lg text-blue-500" @click="addFlow(index)" />
            <delete-filled class="text-lg text-red-500" @click="removeFlow(index)" />
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup="setup">
import { cloneDeep } from 'lodash-es'
import { nanoid } from 'nanoid'
import ClickSetting from './components/ClickSetting.vue'
import CrawlSetting from './components/CrawlSetting.vue'
import FlowTypes from './components/FlowTypes.vue'
import InputSetting from './components/InputSetting.vue'
import JumpSetting from './components/JumpSetting.vue'
import SaveSetting from './components/SaveSetting.vue'
import WaitSetting from './components/WaitSetting.vue'
import { useConfigStore } from '@renderer/store/modules/taskConfig'
import type { ActionType, ITaskConfig } from '@/types'

const flowComponentMap: Record<ActionType, any> = {
  jump: JumpSetting,
  input: InputSetting,
  click: ClickSetting,
  wait: WaitSetting,
  crawl: CrawlSetting,
  save: SaveSetting
}

const showCardIndex = ref<number>(0)
const open = ref<boolean>(false)
const formRef = ref()
const configModel = ref<ITaskConfig>({} as ITaskConfig)
const store = useConfigStore()
const { updateConfig, deleteConfig, runTask, toggleSchedule } = store

watch(open, async (newValue) => {
  if (newValue) return
  await nextTick()
  formRef.value?.clearValidate()
})

const checkCard = (index: number): void => {
  showCardIndex.value = index
}

const flowTypeSelect = (index: number, type: ActionType): void => {
  configModel.value.flows.splice(index, 1, {
    type
  } as any)
}

const addFlow = (index: number): void => {
  configModel.value.flows.splice(index + 1, 0, {
    type: configModel.value.flows[index]?.type || 'jump',
    link: ''
  } as any)
}

const removeFlow = (index: number): void => {
  if (configModel.value.flows.length === 1) {
    configModel.value.flows = [
      {
        type: 'jump',
        url: ''
      }
    ]
  } else {
    configModel.value.flows.splice(index, 1)
  }
}

const showModal = (config?: ITaskConfig): void => {
  configModel.value =
    cloneDeep(config) ||
    ({
      _id: nanoid(),
      flows: [
        {
          type: 'jump'
        }
      ]
    } as ITaskConfig)
  open.value = true
}

const handleDelete = (config: ITaskConfig): void => {
  deleteConfig(config)
  const index = store.configList.findIndex(({ _id }) => {
    return store.taskingIds.has(_id) || store.schedulingIds.has(_id)
  })
  showCardIndex.value = index === -1 ? 0 : index
}

const handleUpdate = async (): Promise<void> => {
  try {
    await formRef.value.validate()
    updateConfig(configModel.value)
    open.value = false
  } catch (error) {
    console.log('error', error)
  }
}
</script>

<style lang="scss" scoped>
.config {
  :deep() {
    .ant-card-body {
      padding: 12px 14px;
      flex: 1;
    }
    .ant-card-head {
      min-height: 48px;
    }
  }
}
</style>
