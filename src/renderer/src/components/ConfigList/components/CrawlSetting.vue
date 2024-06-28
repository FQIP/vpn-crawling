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
        :name="['flows', index, 'attr']"
        :rules="{
          required: true,
          message: '请输入爬取属性'
        }"
      >
        <a-input v-model:value="flow.attr" placeholder="爬取属性" />
      </a-form-item>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup="setup">
import type { IFlowCrawl } from '@/types'

const flow = defineModel<IFlowCrawl>('flow', { required: true })

defineProps<{
  index: number
}>()
</script>

<style lang="scss" scoped></style>
