import type { MenuItem } from '@/app/usage'
import Basic from '@/app/usage/basic/menu-item'

const item: MenuItem = {
  label: 'Render Layers',
  href: '/usage/layers',
  description: 'Rendering multiple layers',
  category: 'Basic Usage',
  tags: ['layers', 'background', 'foreground', 'renderBackground', 'render', 'renderForeground'],
  seeAlso: [Basic]
}

export default item