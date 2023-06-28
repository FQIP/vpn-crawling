<template>
  <a-form class="mx-5">
    <a-form-item label="文件保存路径">
      <div class="flex">
        <a-input
          v-model:value="saveDir"
          class="grow mr-2"
          placeholder="文件保存路径"
          @change="onChange"
        />
        <a-button type="primary" @click="onOpen">选择</a-button>
      </div>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup="setup">
import { ref } from 'vue'

const saveDir = ref<string>()

const onChange = (e: InputEvent): void => {
  saveDir.value = (e.target as HTMLInputElement).value
}

const onOpen = async (): Promise<void> => {
  saveDir.value = await window.api.openDirDialog()
}
</script>

<style lang="scss" scoped></style>
