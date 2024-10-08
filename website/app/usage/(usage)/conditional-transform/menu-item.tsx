import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/(usage)/layers/menu-item'
import Pointer from '@/app/usage/(usage)/pointer/menu-item'
import Transform from '@/app/usage/(usage)/transform/menu-item'
import MultiTransform from '@/app/usage/(usage)/multi-transform/menu-item'

const item: MenuItem = {
  label: 'Conditional Transform',
  href: '/usage/conditional-transform',
  description: 'Run data transformation functions when a condition is met',
  category: 'Advanced Usage',
  tags: ['data', 'transform', 'condition', 'initialiseData', 'preRenderTransform', 'postRenderTransform', 'when', 'whenAny', 'whenNot', 'not'],
  seeAlso: [Layers, Pointer, Transform, MultiTransform]
}

export default item