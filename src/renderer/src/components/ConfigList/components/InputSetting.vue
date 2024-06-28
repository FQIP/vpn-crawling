<template>
  <a-row align="middle" :gutter="{ xs: 4, sm: 8, md: 12 }">
    <a-col :span="17">
      <a-form-item
        :name="['flows', index, 'selector']"
        :rules="{
          required: true,
          message: '请输入目标元素选择器'
        }"
      >
        <a-input v-model:value="flow.selector" placeholder="目标元素选择器" />
      </a-form-item>
    </a-col>
    <a-col :span="7">
      <a-form-item
        :name="['flows', index, 'inputType']"
        :rules="{
          required: true,
          message: '请选择类型'
        }"
      >
        <a-select v-model:value="flow.inputType" placeholder="输入类型">
          <a-select-option v-for="(item, idx) in inputTypes" :key="idx" :value="item.type">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup="setup">
import { inputTypes } from '@/constants'
import type { IFlowInput } from '@/types'

const flow = defineModel<IFlowInput>('flow', { required: true })

defineProps<{
  index: number
}>()
</script>

<style lang="scss" scoped></style>
