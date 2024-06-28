<template>
  <a-config-provider :locale="locale">
    <Main />
  </a-config-provider>
</template>

<script lang="ts" setup="setup">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import Main from '@renderer/Main.vue'

const locale = ref(zhCN)
dayjs.locale('zh-cn')
</script>

<style lang="scss">
::-webkit-scrollbar {
  display: none;
}
</style>
