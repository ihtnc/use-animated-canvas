import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/(usage)/layers/menu-item'
import Transform from '@/app/usage/(usage)/transform/menu-item'
import MultiRender from '@/app/usage/(usage)/multi-render/menu-item'

const item: MenuItem = {
  label: 'Conditional Render',
  href: '/usage/conditional-render',
  description: 'Run render functions when a condition is met',
  category: 'Advanced Usage',
  tags: ['layers', 'condition', 'background', 'foreground', 'renderBackground', 'render', 'renderForeground', 'renderWhen', 'renderWhenAny', 'renderWhenNot', 'not'],
  seeAlso: [Layers, Transform, MultiRender]
}

export default item