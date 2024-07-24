import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import Grid from '@/app/usage/grid/menu-item'

const item: MenuItem = {
  label: 'Custom Grid',
  href: '/usage/custom-grid',
  description: 'Render a user-defined grid in a separate layer',
  category: 'Utility Layers',
  tags: ['utility', 'grid', 'helper', 'custom', 'renderGridLayer'],
  seeAlso: [Layers, Grid]
}

export default item