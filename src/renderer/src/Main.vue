<template>
  <a-layout>
    <a-layout-sider class="h-full fixed border-r border-solid border-slate-200" theme="light">
      <a-menu v-model:selectedKeys="selectedKeys" mode="inline" class="border-0">
        <a-menu-item key="1">
          <bars-outlined />
          <span>订阅列表</span>
        </a-menu-item>
        <a-menu-item key="2">
          <setting-outlined />
          <span>基础设置</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout-content class="h-full py-5 bg-white" style="padding-left: 200px">
      <div class="h-full overflow-scroll">
        <transition>
          <keep-alive>
            <component :is="comp" />
          </keep-alive>
        </transition>
      </div>
    </a-layout-content>
  </a-layout>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { SettingOutlined, BarsOutlined } from '@ant-design/icons-vue'
import ClashLink from './pages/clashLink/index.vue'
import Setting from './pages/setting/index.vue'

const components = {
  1: ClashLink,
  2: Setting
}

const selectedKeys = ref<string[]>(['1'])

const comp = computed(() => components[selectedKeys.value[0]])
</script>
