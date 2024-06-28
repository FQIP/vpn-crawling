import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import exposeAPIs from './exposeAPIs'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', exposeAPIs)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = exposeAPIs
}
