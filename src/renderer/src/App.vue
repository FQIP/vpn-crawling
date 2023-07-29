<template>
  <a-config-provider :locale="locale">
    <Main />
  </a-config-provider>
</template>

<script lang="ts" setup="setup">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import Main from './Main.vue'

const locale = ref(zhCN)
// eslint-disable-next-line import/no-named-as-default-member
dayjs.locale('zh-cn')
</script>

<style lang="scss" scoped></style>
