import type { MenuItem } from '@/app/usage'
import Filters from '@/app/usage/(usage)/filters/menu-item'
import Layers from '@/app/usage/(usage)/layers/menu-item'
import Transform from '@/app/usage/(usage)/transform/menu-item'
import MultiFilter from '@/app/usage/(usage)/multi-filter/menu-item'

const item: MenuItem = {
  label: 'Conditional Filter',
  href: '/usage/conditional-filter',
  description: 'Run filter functions when a condition is met',
  category: 'Advanced Usage',
  tags: ['filter', 'condition', 'renderBackgroundFilter', 'renderFilter', 'renderForegroundFilter', 'filterWhen', 'filterWhenAny', 'filterWhenNot', 'not'],
  seeAlso: [Filters, Layers, Transform, MultiFilter]
}

export default item