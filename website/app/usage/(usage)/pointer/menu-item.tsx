import type { MenuItem } from '@/app/usage'
import Transform from '@/app/usage/(usage)/transform/menu-item'
import Layers from '@/app/usage/(usage)/layers/menu-item'
import Keyboard from '@/app/usage/(usage)/keyboard/menu-item'

const item: MenuItem = {
  label: 'Pointer',
  href: '/usage/pointer',
  description: 'Handle pointer events',
  category: 'Events',
  tags: [
    'mouse', 'pointer', 'events',
    'mouseup', 'mousedown', 'mousemove', 'mouseenter', 'mouseout',
    'pointerup', 'pointerdown', 'pointermove', 'pointerenter', 'pointerout',
    'onPointerEnter', 'onPointerOut', 'onPointerMove', 'onPointerDown', 'onPointerUp'
  ],
  seeAlso: [Transform, Layers, Keyboard]
}

export default item