import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import {
  AntDesignVueResolver,
  ElementPlusResolver,
  VantResolver
} from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  preload: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['lodash-es', 'nanoid', 'validator', 'clipboardy']
      })
    ],
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      UnoCSS({
        configFile: 'src/renderer/uno.config.js'
      }),
      AutoImport({
        dts: resolve('src/renderer/src/auto-imports.d.ts'), // 可以自定义文件生成的位置，默认是根目录下
        imports: ['vue']
      }),
      Components({
        resolvers: [
          AntDesignVueResolver({
            cjs: true,
            resolveIcons: true,
            importStyle: false
          }),
          ElementPlusResolver(),
          VantResolver()
        ]
      })
    ]
  }
})
