import plugin from './plugin'

declare global {
  interface Window {
    DeverFront?: {
      registerPlugin: (plugin: typeof plugin) => void
    }
  }
}

window.DeverFront?.registerPlugin(plugin)
