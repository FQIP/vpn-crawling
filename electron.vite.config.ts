import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import {
  AntDesignVueResolver,
  ElementPlusResolver,
  VantResolver
} from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      UnoCSS(),
      AutoImport({
        dts: resolve('src/renderer/src/auto-imports.d.ts'), // 可以自定义文件生成的位置，默认是根目录下
        imports: ['vue']
      }),
      Components({
        resolvers: [AntDesignVueResolver(), ElementPlusResolver(), VantResolver()]
      })
    ]
  }
})
