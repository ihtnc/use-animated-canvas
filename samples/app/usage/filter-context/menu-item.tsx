import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import Filters from '@/app/usage/filters/menu-item'
import GlobalFilters from '@/app/usage/global-filters/menu-item'

const item: MenuItem = {
  label: 'Filter Context',
  href: '/usage/filter-context',
  description: 'Understand the behaviour of layer-specific filters',
  category: 'Advanced Concepts',
  tags: ['layers', 'autoResetContext', 'filters', 'renderBackgroundFilter', 'renderFilter', 'renderForegroundFilter'],
  seeAlso: [Layers, GlobalFilters, Filters]
}

export default item