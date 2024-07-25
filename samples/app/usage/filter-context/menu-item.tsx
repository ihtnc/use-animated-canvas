import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import Filters from '@/app/usage/filters/menu-item'
import GlobalFilters from '@/app/usage/global-filters/menu-item'
import RenderContext from '@/app/usage/render-context/menu-item'

const item: MenuItem = {
  label: 'Filter Context',
  href: '/usage/filter-context',
  description: 'Understand the behaviour of layer-specific filter functions',
  category: 'Advanced Concepts',
  tags: ['context', 'filters', 'autoResetContext', 'renderBackgroundFilter', 'renderFilter', 'renderForegroundFilter', 'options'],
  seeAlso: [Layers, GlobalFilters, Filters, RenderContext]
}

export default item