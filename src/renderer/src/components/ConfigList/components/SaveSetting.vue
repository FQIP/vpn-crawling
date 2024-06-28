<template>
  <a-row align="middle" :gutter="{ xs: 4, sm: 8, md: 12 }">
    <a-col :span="17">
      <a-form-item
        ref="pathRef"
        :name="['flows', index, 'path']"
        :rules="{
          required: true,
          message: '请输入或选择文件保存路径'
        }"
        validate-trigger="change"
      >
        <a-input-group compact>
          <a-input
            v-model:value="flow.path"
            placeholder="文件保存路径"
            style="width: calc(100% - 32px)"
            allow-clear
          />
          <a-button @click="checkFolder">
            <template #icon>
              <FolderOpenOutlined class="align-text-bottom" />
            </template>
          </a-button>
        </a-input-group>
      </a-form-item>
    </a-col>
    <a-col :span="7">
      <a-form-item
        :name="['flows', index, 'saveType']"
        :rules="{
          required: true,
          message: '请选择类型'
        }"
      >
        <a-select v-model:value="flow.saveType" placeholder="保存类型">
          <a-select-option v-for="(item, idx) in saveTypes" :key="idx" :value="item.type">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup="setup">
import { saveTypes } from '@/constants'
import type { IFlowSave } from '@/types'

const flow = defineModel<IFlowSave>('flow', { required: true })
const pathRef = ref()

const checkFolder = async (): Promise<void> => {
  const path = await window.api.openDirDialog()
  if (path) {
    flow.value.path = path
    pathRef.value.onFieldChange()
  }
}

defineProps<{
  index: number
}>()
</script>

<style lang="scss" scoped></style>
