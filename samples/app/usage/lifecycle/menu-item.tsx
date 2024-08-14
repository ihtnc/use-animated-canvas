import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import Filters from '@/app/usage/filters/menu-item'
import Transform from '@/app/usage/transform/menu-item'
import Debug from '@/app/usage/debug/menu-item'

const item: MenuItem = {
  label: 'Loop Lifecycle',
  href: '/usage/lifecycle',
  description: 'Understand the execution sequence of the handlers in the hook',
  category: 'Additional Concepts',
  tags: ['layers', 'background', 'foreground', 'render', 'filters', 'data', 'transform', 'lifecycle', 'sequence'],
  seeAlso: [Layers, Filters, Transform, Debug]
}

export default item