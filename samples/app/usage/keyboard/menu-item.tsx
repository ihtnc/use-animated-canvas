import type { MenuItem } from '@/app/usage'
import Data from '@/app/usage/data/menu-item'
import Transform from '@/app/usage/transform/menu-item'
import Layers from '@/app/usage/layers/menu-item'

const item: MenuItem = {
  label: 'Keyboard',
  href: '/usage/keyboard',
  description: 'Handle keyboard events while rendering',
  category: 'Events',
  tags: ['keyboard', 'events'],
  seeAlso: [Data, Transform, Layers]
}

export default item