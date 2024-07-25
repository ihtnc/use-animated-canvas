import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'

const item: MenuItem = {
  label: 'Global Filters',
  href: '/usage/global-filters',
  description: 'Apply global filters',
  category: 'Basic Usage',
  tags: ['filters', 'global', 'globalFilter'],
  seeAlso: [Layers]
}

export default item