import type { MenuItem } from '@/app/usage'
import Basic from '@/app/usage/(usage)/basic/menu-item'
import GlobalFilters from '@/app/usage/(usage)/global-filters/menu-item'
import Transform from '@/app/usage/(usage)/transform/menu-item'

const item: MenuItem = {
  label: 'Multi Transform',
  href: '/usage/multi-transform',
  description: 'Run multiple data transformation functions',
  category: 'Advanced Usage',
  tags: ['data', 'transform', 'multiple', 'initialiseData', 'preRenderTransform', 'postRenderTransform'],
  seeAlso: [Basic, GlobalFilters, Transform]
}

export default item