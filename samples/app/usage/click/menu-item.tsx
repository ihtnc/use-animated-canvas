import type { MenuItem } from '@/app/usage'
import Transform from '@/app/usage/transform/menu-item'
import Layers from '@/app/usage/layers/menu-item'

const item: MenuItem = {
  label: 'Click',
  href: '/usage/click',
  description: 'Handle mouse click event',
  category: 'Events',
  tags: ['mouse', 'click', 'events'],
  seeAlso: [Transform, Layers]
}

export default item