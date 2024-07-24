import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'

const item: MenuItem = {
  label: 'Render Grid',
  href: '/usage/grid',
  description: 'Render a grid in a separate layer',
  category: 'Utility Layers',
  tags: ['utility', 'grid', 'helper', 'renderGridLayer'],
  seeAlso: [Layers]
}

export default item