import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/(usage)/layers/menu-item'
import CustomGrid from '@/app/usage/(usage)/custom-grid/menu-item'
import CustomDetails from '@/app/usage/(usage)/custom-details/menu-item'

const item: MenuItem = {
  label: 'Utility Order',
  href: '/usage/utility-order',
  description: 'Understand the rendering order of the utility layer render functions',
  category: 'Additional Concepts',
  tags: ['utility', 'helper', 'custom', 'grid', 'environment', 'details', 'order'],
  seeAlso: [Layers, CustomGrid, CustomDetails]
}

export default item