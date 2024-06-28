<template>
  <a-form-item
    :name="['flows', index, 'delay']"
    :rules="{
      required: true,
      message: '请输入等待时间'
    }"
  >
    <a-input-number
      v-model:value="flow.delay"
      placeholder="等待时间，单位：秒"
      class="w-full"
      :min="0"
      :max="30"
    />
  </a-form-item>
</template>

<script lang="ts" setup="setup">
import type { IFlowWait } from '@/types'

const flow = defineModel<IFlowWait>('flow', { required: true })

defineProps<{
  index: number
}>()
</script>

<style lang="scss" scoped></style>
