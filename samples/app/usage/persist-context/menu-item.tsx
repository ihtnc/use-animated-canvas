import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import GlobalFilters from '@/app/usage/global-filters/menu-item'

const item: MenuItem = {
  label: 'Persist Context',
  href: '/usage/persist-context',
  description: 'Persist context changes across layers',
  category: 'Advanced Concepts',
  tags: ['autoResetContext', 'persist', 'preserve', 'save', 'reset', 'context'],
  seeAlso: [Layers, GlobalFilters]
}

export default item