import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import Filters from '@/app/usage/filters/menu-item'
import Transform from '@/app/usage/transform/menu-item'
import ConditionalFilter from '@/app/usage/conditional-filter/menu-item'
import Pointer from '@/app/usage/pointer/menu-item'

const item: MenuItem = {
  label: 'Conditional Multi Filter',
  href: '/usage/conditional-multi-filter',
  description: 'Run multiple filter functions when a condition is met',
  category: 'Advanced Usage',
  tags: ['filters', 'multiple', 'condition', 'renderBackgroundFilter', 'renderFilter', 'renderForegroundFilter', 'filterWhen'],
  seeAlso: [Layers, Filters, Transform, ConditionalFilter, Pointer]
}

export default item