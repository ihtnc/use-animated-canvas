import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/(usage)/layers/menu-item'
import Pointer from '@/app/usage/(usage)/pointer/menu-item'
import Transform from '@/app/usage/(usage)/transform/menu-item'
import MultiTransform from '@/app/usage/(usage)/multi-transform/menu-item'
import ConditionalTransform from '@/app/usage/(usage)/conditional-transform/menu-item'

const item: MenuItem = {
  label: 'Conditional Multi Transform',
  href: '/usage/conditional-multi-transform',
  description: 'Run multiple data transformation functions when a condition is met',
  category: 'Advanced Usage',
  tags: ['data', 'transform', 'multiple', 'condition', 'initialiseData', 'preRenderTransform', 'postRenderTransform', 'when'],
  seeAlso: [Layers, Pointer, Transform, MultiTransform, ConditionalTransform]
}

export default item