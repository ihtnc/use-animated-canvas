import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import Details from '@/app/usage/details/menu-item'

const item: MenuItem = {
  label: 'Custom Details',
  href: '/usage/custom-details',
  description: 'Render user-defined environment details in a separate layer',
  category: 'Utility Layers',
  tags: ['utility', 'environment', 'details', 'helper', 'custom', 'renderEnvironmentLayer'],
  seeAlso: [Layers, Details]
}

export default item