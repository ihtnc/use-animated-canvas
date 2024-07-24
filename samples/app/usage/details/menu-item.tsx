import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'

const item: MenuItem = {
  label: 'Render Details',
  href: '/usage/details',
  description: 'Render environment details in a separate layer',
  category: 'Utility Layers',
  tags: ['utility', 'environment', 'details', 'helper', 'renderEnvironmentLayer'],
  seeAlso: [Layers]
}

export default item