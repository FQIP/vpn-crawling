<template>
  <a-form-item
    :name="['flows', index, 'selector']"
    :rules="{
      required: true,
      message: '请输入目标元素选择器'
    }"
  >
    <a-input v-model:value="flow.selector" placeholder="目标元素选择器" />
  </a-form-item>
</template>

<script lang="ts" setup="setup">
import type { IFlowClick } from '@/types'

const flow = defineModel<IFlowClick>('flow', { required: true })

defineProps<{
  index: number
}>()
</script>

<style lang="scss" scoped></style>
