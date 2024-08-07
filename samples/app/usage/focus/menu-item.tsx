import type { MenuItem } from '@/app/usage'
import Transform from '@/app/usage/transform/menu-item'
import Layers from '@/app/usage/layers/menu-item'

const item: MenuItem = {
  label: 'Focus',
  href: '/usage/focus',
  description: 'Handle focus events while rendering',
  category: 'Events',
  tags: ['focus', 'blur', 'events', 'onFocus', 'onBlur'],
  seeAlso: [Transform, Layers]
}

export default item