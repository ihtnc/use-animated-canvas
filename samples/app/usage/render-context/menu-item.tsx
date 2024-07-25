import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import GlobalFilters from '@/app/usage/global-filters/menu-item'

const item: MenuItem = {
  label: 'Render Context',
  href: '/usage/render-context',
  description: 'Understand the behaviour of layer-specific render functions',
  category: 'Advanced Concepts',
  tags: ['context', 'layers', 'autoResetContext', 'renderBackground', 'render', 'renderForeground', 'options'],
  seeAlso: [Layers, GlobalFilters]
}

export default item