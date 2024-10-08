import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/(usage)/layers/menu-item'
import Transform from '@/app/usage/(usage)/transform/menu-item'
import MultiRender from '@/app/usage/(usage)/multi-render/menu-item'
import ConditionalRender from '@/app/usage/(usage)/conditional-render/menu-item'
import Pointer from '@/app/usage/(usage)/pointer/menu-item'

const item: MenuItem = {
  label: 'Multi Conditional Render',
  href: '/usage/multi-conditional-render',
  description: 'Run render functions when multiple conditions are met',
  category: 'Advanced Usage',
  tags: ['layers', 'multiple', 'condition', 'background', 'foreground', 'renderBackground', 'render', 'renderForeground', 'renderWhen'],
  seeAlso: [Layers, Transform, MultiRender, ConditionalRender, Pointer]
}

export default item