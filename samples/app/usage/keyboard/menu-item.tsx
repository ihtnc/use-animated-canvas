import type { MenuItem } from '@/app/usage'
import Transform from '@/app/usage/transform/menu-item'
import Layers from '@/app/usage/layers/menu-item'

const item: MenuItem = {
  label: 'Keyboard',
  href: '/usage/keyboard',
  description: 'Handle keyboard events while rendering',
  category: 'Events',
  tags: ['keyboard', 'keydown', 'keyup', 'events', 'onKeyDownHandler', 'onKeyUpHandler'],
  seeAlso: [Transform, Layers]
}

export default item