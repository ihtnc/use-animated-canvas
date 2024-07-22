import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'

const item: MenuItem = {
  label: 'Render Filters',
  href: '/usage/filters',
  description: 'Rendering with filters example',
  category: 'Basic Usage',
  tags: ['filters'],
  seeAlso: [Layers]
}

export default item