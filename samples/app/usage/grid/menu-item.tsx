import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import Details from '@/app/usage/details/menu-item'

const item: MenuItem = {
  label: 'Grid',
  href: '/usage/grid',
  description: 'Render a grid in a separate layer',
  category: 'Utility Layers',
  tags: ['utility', 'grid', 'helper'],
  seeAlso: [Layers, Details]
}

export default item