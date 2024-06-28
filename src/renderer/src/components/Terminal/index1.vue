<template>
  <div ref="terminalContainer" class="terminal-container" />
</template>

<script lang="ts" setup="setup">
import { Terminal } from '@xterm/xterm'
import { createEmphasize } from 'emphasize'
import bash from 'highlight.js/lib/languages/bash.js'

const terminalContainer = ref<HTMLDivElement>()

const output = `WARN deprecated xterm-addon-fit@0.8.0: This package is now deprecated. Move to @xterm/addon-fit instead.\n\r`
const str = createEmphasize({
  bash: bash
}).highlightAuto(output).value
console.log(str)

onMounted(() => {
  const term = new Terminal({
    disableStdin: true,
    fontSize: 14,
    fontFamily: 'Cascadia Code, Consolas, monospace',
    lineHeight: 1.5
  })
  term.open(terminalContainer.value!)
  setTimeout(() => {
    const output = `➜  vpn-crawling git:(master) ✗ pnpm install xterm-addon-fit \n\r`
    term.write(createEmphasize().highlightAuto(output).value)
  }, 1000)
  setTimeout(() => {
    const output = `WARN deprecated xterm-addon-fit@0.8.0: This package is now deprecated. Move to @xterm/addon-fit instead.\n\r`
    const str = createEmphasize().highlightAuto(output).value
    console.log(str)
    term.write(str)
  }, 2000)
})
</script>

<style lang="scss" scoped>
.terminal-container {
  width: 100%;
  height: 200px;
  background-color: #000000;
  color: #ffffff;
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 10px;
  white-space: pre;
}
</style>
