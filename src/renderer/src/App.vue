<template>
  <div class="m-5">
    <a-input-search v-model:value="savedPath" placeholder="文件保存路径" @search="onSearch">
      <template #enterButton>
        <a-button type="primary">选择文件夹</a-button>
      </template>
    </a-input-search>
    <a-row class="mt-3" :gutter="[16, 16]">
      <a-col v-for="n in 6" :key="n" :span="6">
        <ClashLinkItem />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup="setup">
import ClashLinkItem from './components/ClashLinkItem.vue'

const savedPath = ref<string>('')

const onSearch = (savedPath: string): void => {
  console.log('savedPath is: ', savedPath)
}
</script>

<style lang="scss" scoped></style>
