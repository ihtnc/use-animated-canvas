import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import Grid from '@/app/usage/grid/menu-item'

const item: MenuItem = {
  label: 'Details',
  href: '/usage/details',
  description: 'Render environment details in a separate layer',
  category: 'Utility Layers',
  tags: ['utility', 'environment', 'details', 'helper'],
  seeAlso: [Layers, Grid]
}

export default item