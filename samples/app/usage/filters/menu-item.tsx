import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import GlobalFilters from '@/app/usage/global-filters/menu-item'

const item: MenuItem = {
  label: 'Render Filters',
  href: '/usage/filters',
  description: 'Apply filters to different layers',
  category: 'Basic Usage',
  tags: ['filters', 'renderBackgroundFilter', 'renderFilter', 'renderForegroundFilter'],
  seeAlso: [Layers, GlobalFilters]
}

export default item