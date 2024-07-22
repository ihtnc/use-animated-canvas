import type { MenuItem } from '@/app/usage'
import Transform from '@/app/usage/transform/menu-item'
import Layers from '@/app/usage/layers/menu-item'

const item: MenuItem = {
  label: 'Pointer',
  href: '/usage/pointer',
  description: 'Handle pointer events',
  category: 'Events',
  tags: [
    'mouse', 'pointer', 'events',
    'mouseup', 'mousedown', 'mousemove', 'mouseenter', 'mouseout',
    'pointerup', 'pointerdown', 'pointermove', 'pointerenter', 'pointerout'
  ],
  seeAlso: [Transform, Layers]
}

export default item