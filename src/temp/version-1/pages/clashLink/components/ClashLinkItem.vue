<template>
  <div class="flex flex-col justify-center items-center w-52 mt-5">
    <div class="relative cursor-pointer mb-2">
      <img class="w-full rounded border" :src="qrcode" alt="qrcode" />
      <div
        class="absolute inset-0 m-auto w-9 h-9 rounded-full bg-black text-center leading-9 font-semibold text-xl text-orange-400"
      >
        {{ props.index }}
      </div>
    </div>
    <a-space align="center">
      <span class="cursor-pointer text-xs" @click="deleteClashLink">
        <delete-filled :style="{ fontSize: '14px', color: '#f00' }" />
        删除
      </span>
      <span class="cursor-pointer text-xs" @click="copyClashLink">
        <copy-outlined :style="{ fontSize: '14px', color: '#08c' }" />
        复制
      </span>
      <span class="cursor-pointer text-xs" @click="importToClash">
        <export-outlined :style="{ fontSize: '14px', color: '#08c' }" />
        导入到Clash
      </span>
    </a-space>
  </div>
</template>

<script lang="ts" setup="setup" defineProps="T">
import { createVNode } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  CopyOutlined,
  DeleteFilled,
  ExclamationCircleOutlined,
  ExportOutlined
} from '@ant-design/icons-vue'
import { useClipboard } from '@vueuse/core'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const props = defineProps<{ index: number; clashLink: string }>()

const qrcode = useQRCode(props.clashLink, {
  errorCorrectionLevel: 'H',
  margin: 3
})
const { copy, copied, isSupported } = useClipboard()

const deleteClashLink = (): void => {
  Modal.confirm({
    title: '确定要删除?',
    icon: createVNode(ExclamationCircleOutlined),
    onOk() {
      return new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
      }).catch(() => console.log('Oops errors!'))
    }
  })
}

const copyClashLink = async (): Promise<void> => {
  if (isSupported.value) {
    await copy(props.clashLink)
    if (copied.value) {
      message.success('复制成功', 1)
    }
  } else {
    message.error('浏览器不支持复制到剪贴板')
  }
}

const importToClash = (): void => {
  window.location.href = `clash://install-config?url=${props.clashLink}`
}
</script>
