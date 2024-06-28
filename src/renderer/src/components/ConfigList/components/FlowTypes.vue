<template>
  <a-select v-bind="$attrs">
    <a-select-option v-for="item in flowTypes" :key="item.type" :value="item.type">
      {{ item.name }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts" setup="setup">
import type { ActionType } from '@/types'

const flowTypes: Array<{ name: string; type: ActionType }> = [
  {
    name: '跳转',
    type: 'jump'
  },
  {
    name: '点击',
    type: 'click'
  },
  {
    name: '输入',
    type: 'input'
  },
  {
    name: '等待',
    type: 'wait'
  },
  {
    name: '爬取',
    type: 'crawl'
  },
  {
    name: '保存',
    type: 'save'
  }
]
</script>

<style lang="scss" scoped></style>
