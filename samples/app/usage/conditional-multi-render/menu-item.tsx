import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import Transform from '@/app/usage/transform/menu-item'
import MultiRender from '@/app/usage/multi-render/menu-item'
import ConditionalRender from '@/app/usage/conditional-render/menu-item'
import Pointer from '@/app/usage/pointer/menu-item'

const item: MenuItem = {
  label: 'Conditional Multi Render',
  href: '/usage/conditional-multi-render',
  description: 'Run multiple render functions when a condition is met',
  category: 'Advanced Usage',
  tags: ['layers', 'multiple', 'condition', 'background', 'foreground', 'renderBackground', 'render', 'renderForeground', 'renderWhen'],
  seeAlso: [Layers, Transform, MultiRender, ConditionalRender, Pointer]
}

export default item