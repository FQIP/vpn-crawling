<template>
  <div ref="terminal" class="terminal rounded-lg overflow-hidden" />
</template>

<script lang="ts" setup="setup">
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'

const terminal = ref<HTMLDivElement>()

onMounted(() => {
  setTimeout(() => {
    const output = `➜  vpn-crawling git:(master) ✗ pnpm install xterm-addon-fit \n\r`
    const highlightedOutput = hljs.highlightAuto(output).value
    terminal.value!.innerHTML = highlightedOutput
  }, 1000)
})
</script>

<style lang="scss" scoped>
.terminal {
  background-color: #000000;
  color: #ffffff;
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 10px;
  white-space: pre;
}
</style>
