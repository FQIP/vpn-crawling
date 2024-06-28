<template>
  <a-card class="crawl-result flex flex-col" title="爬取结果">
    <template #extra>
      <a-space class="cursor-pointer text-base" :size="24">
        <loading-outlined v-if="isLoading" class="hover:text-[#1d4ed8]" />
        <redo-outlined v-else class="hover:text-[#1d4ed8]" @click="crawl" />
        <setting-outlined class="hover:text-[#1d4ed8]" />
        <copy-outlined class="hover:text-[#1d4ed8]" />
      </a-space>
    </template>

    <div class="crawl-result-list h-full overflow-y-scroll grid gap-y-3.5">
      <div v-for="i in 28" :key="i" class="grid grid-cols-6 gap-x-1.5 hover:bg-[#eff6ff]">
        <div class="col-span-5 text-ellipsis line-clamp-1 break-all cursor-pointer">
          {{ i }}、https://freenode.openrunner.net/uploads/20240523-clash.yaml
        </div>
        <div class="flex justify-around">
          <check-circle-outlined
            v-if="i <= 3"
            class="cursor-pointer hover:text-[#1d4ed8] text-base"
          />
          <download-outlined
            v-else-if="i % 2 === 0"
            class="cursor-pointer hover:text-[#1d4ed8] text-base"
          />
          <LoadingOutlined v-else class="cursor-pointer hover:text-[#1d4ed8] text-base" />
          <copy-outlined class="cursor-pointer hover:text-[#1d4ed8] text-base" />
        </div>
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
const isLoading = ref<boolean>(false)

const crawl = (): void => {
  if (isLoading.value) return
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>
<style lang="scss" scoped>
.crawl-result {
  :deep() {
    .ant-card-body {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
