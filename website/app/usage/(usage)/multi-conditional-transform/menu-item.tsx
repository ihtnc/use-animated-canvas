import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/(usage)/layers/menu-item'
import Pointer from '@/app/usage/(usage)/pointer/menu-item'
import Transform from '@/app/usage/(usage)/transform/menu-item'
import MultiTransform from '@/app/usage/(usage)/multi-transform/menu-item'
import ConditionalTransform from '@/app/usage/(usage)/conditional-transform/menu-item'

const item: MenuItem = {
  label: 'Multi Conditional Transform',
  href: '/usage/multi-conditional-transform',
  description: 'Run data transformation functions when multiple conditions are met',
  category: 'Advanced Usage',
  tags: ['data', 'transform', 'multiple', 'condition', 'initialiseData', 'preRenderTransform', 'postRenderTransform', 'when'],
  seeAlso: [Layers, Pointer, Transform, MultiTransform, ConditionalTransform]
}

export default item