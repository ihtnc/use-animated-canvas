import type { MenuItem } from '@/app/usage'
import Transform from '@/app/usage/(usage)/transform/menu-item'
import Layers from '@/app/usage/(usage)/layers/menu-item'
import Focus from '@/app/usage/(usage)/focus/menu-item'

const item: MenuItem = {
  label: 'Keyboard',
  href: '/usage/keyboard',
  description: 'Handle keyboard events while rendering',
  category: 'Events',
  tags: ['keyboard', 'keydown', 'keyup', 'events', 'onKeyDown', 'onKeyUp'],
  seeAlso: [Transform, Layers, Focus]
}

export default item