import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/(usage)/layers/menu-item'
import Filters from '@/app/usage/(usage)/filters/menu-item'

const item: MenuItem = {
  label: 'Multi Filter',
  href: '/usage/multi-filter',
  description: 'Run multiple filter functions in a single layer',
  category: 'Advanced Usage',
  tags: ['multiple', 'filters', 'renderBackgroundFilter', 'renderFilter', 'renderForegroundFilter'],
  seeAlso: [Layers, Filters]
}

export default item