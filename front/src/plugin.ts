import { defineFrontPlugin, lazyNode } from '@/lib/plugin/types'

export default defineFrontPlugin({
  name: 'bot',
  nodes: {
    'show-agent': lazyNode(() =>
      import('./nodes/show/agent').then((mod) => ({
        default: mod.ShowAgent,
      }))
    ),
    'show-brain-workspace': lazyNode(() =>
      import('./nodes/show/brain-workspace').then((mod) => ({
        default: mod.ShowBrainWorkspace,
      }))
    ),
    'show-stream-request': lazyNode(() =>
      import('./nodes/show/stream-request').then((mod) => ({
        default: mod.ShowStreamRequest,
      }))
    ),
  },
})
