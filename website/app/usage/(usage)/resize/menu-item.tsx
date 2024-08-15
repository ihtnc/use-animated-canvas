import type { MenuItem } from '@/app/usage'
import Transform from '@/app/usage/(usage)/transform/menu-item'
import Layers from '@/app/usage/(usage)/layers/menu-item'

const item: MenuItem = {
  label: 'Canvas Resize',
  href: '/usage/resize',
  description: 'Handle canvas resize event',
  category: 'Events',
  tags: ['resize', 'events', 'debounce', 'resizeDelayMs', 'onCanvasResize', 'options'],
  seeAlso: [Transform, Layers]
}

export default item