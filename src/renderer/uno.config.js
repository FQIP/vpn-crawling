import { defineConfig, presetAttributify, presetUno } from 'unocss'
import { presetScrollbarHide } from 'unocss-preset-scrollbar-hide'

export default defineConfig({
  presets: [
    presetAttributify(), // required when using attributify mode
    presetUno(), // required
    presetScrollbarHide()
  ]
})
