<template>
  <div class="flex flex-col h-screen w-screen p-2 gap-y-2 bg-gray-200">
    <ConfigList class="h-auto w-full" />
    <div class="h-full overflow-hidden grid grid-cols-5 gap-2">
      <Terminal class="col-span-3 h-full" />
      <CrawlResult class="col-span-2 w-full h-full overflow-hidden" />
    </div>
  </div>
</template>

<script lang="ts" setup="setup">
import ConfigList from '@renderer/components/ConfigList/index.vue'
import CrawlResult from '@renderer/components/CrawlResult/index.vue'
import Terminal from '@renderer/components/Terminal/index.vue'
</script>

<style lang="scss" scoped></style>
