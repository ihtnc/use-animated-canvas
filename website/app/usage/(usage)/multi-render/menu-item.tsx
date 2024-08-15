import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/(usage)/layers/menu-item'
import Transform from '@/app/usage/(usage)/transform/menu-item'

const item: MenuItem = {
  label: 'Multi Render',
  href: '/usage/multi-render',
  description: 'Run multiple render functions in a single layer',
  category: 'Advanced Usage',
  tags: ['layers', 'multiple', 'background', 'foreground', 'renderBackground', 'render', 'renderForeground'],
  seeAlso: [Layers, Transform]
}

export default item