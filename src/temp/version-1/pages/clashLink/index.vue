<template>
  <div class="mx-5">
    <a-space align="center">
      起始:
      <a-input-number v-model:value="startIndex" class="mr-5" :min="1" :max="endIndex" />
      结束:
      <a-input-number v-model:value="endIndex" class="mr-5" :min="1" :max="20" />
      <a-button type="primary" danger @click="removeAll">全部删除</a-button>
      <a-button type="primary" :loading="isFetching" @click="toFetch">开始获取</a-button>
      <a-button type="primary" @click="copyClashLinks"> 复制订阅链接 </a-button>
    </a-space>
    <div ref="containerRef">
      <div v-for="(rowLinks, rowIndex) in clashList" :key="rowIndex" class="flex">
        <clash-link-item
          v-for="(clashLink, index) in rowLinks"
          ref="itemRef"
          :key="rowIndex * clashList[0].length + index + 1"
          :index="rowIndex * clashList[0].length + index + 1"
          :clash-link="clashLink"
          :style="{ marginLeft: `${gutter}px`, marginRight: `${gutter}px` }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup="setup">
import { createVNode } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { chunk, debounce } from 'lodash-es'
import ClashLinkItem from './components/ClashLinkItem.vue'

const list = Array.from({ length: 16 }, () => {
  return 'https://www.qilin2.com/api/v1/client/subscribe?token=b315fd49d98f5153f2da832817c0109e'
})

const containerRef = ref<HTMLElement>()
const itemRef = ref<HTMLElement>()
const startIndex = ref<number>(1)
const endIndex = ref<number>(10)
const clashList = ref<string[][]>([])
const gutter = ref<number>(0)
const isFetching = ref<boolean>(false)

const resizeLayout = (): void => {
  const cw = containerRef.value?.offsetWidth || 0
  const iw = itemRef.value?.offsetWidth || 210
  const rowCount = Math.floor(cw / iw)
  clashList.value = chunk(list, rowCount)
  gutter.value = (cw - rowCount * iw) / (rowCount * 2)
}

watchEffect(() => {
  resizeLayout()
})

window.onresize = debounce(resizeLayout, 300)

const removeAll = (): void => {
  Modal.confirm({
    title: '确定要删除全部订阅链接?',
    icon: createVNode(ExclamationCircleOutlined),
    onOk() {
      return new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
      }).catch(() => console.log('Oops errors!'))
    }
  })
}

const toFetch = async (): Promise<void> => {
  try {
    isFetching.value = true
    await window.api.concurrentCrawlingCyanmori()
  } catch (error) {
    throw new Error(error as string)
  } finally {
    isFetching.value = false
  }
}

const copyClashLinks = async (): Promise<void> => {
  try {
    await window.api.copyLatestClashLinksCyanmori()
    message.success('复制成功', 1)
  } catch (error) {
    message.error('复制失败', 1)
    throw new Error(error as string)
  }
}
</script>

<style lang="scss" scoped></style>
