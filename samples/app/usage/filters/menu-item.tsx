import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'

const item: MenuItem = {
  label: 'Render Filters',
  href: '/usage/filters',
  description: 'Rendering with filters',
  category: 'Basic Usage',
  tags: ['filters', 'renderBackgroundFilter', 'renderFilter', 'renderForegroundFilter'],
  seeAlso: [Layers]
}

export default item