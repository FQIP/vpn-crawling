<template>
  <a-form-item
    :name="['flows', index, 'url']"
    :rules="{
      required: true,
      message: '请输入跳转链接'
    }"
  >
    <a-input v-model:value="flow.url" placeholder="跳转链接" />
  </a-form-item>
</template>

<script lang="ts" setup="setup">
import type { IFlowJump } from '@/types'

const flow = defineModel<IFlowJump>('flow', { required: true })

defineProps<{
  index: number
}>()
</script>

<style lang="scss" scoped></style>
