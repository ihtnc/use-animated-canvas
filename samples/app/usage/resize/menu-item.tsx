import type { MenuItem } from '@/app/usage'
import Transform from '@/app/usage/transform/menu-item'
import Layers from '@/app/usage/layers/menu-item'

const item: MenuItem = {
  label: 'Canvas Resize',
  href: '/usage/resize',
  description: 'Handle canvas resize event',
  category: 'Events',
  tags: ['resize', 'events', 'debounce', 'resizeDelayMs', 'onCanvasResize'],
  seeAlso: [Transform, Layers]
}

export default item