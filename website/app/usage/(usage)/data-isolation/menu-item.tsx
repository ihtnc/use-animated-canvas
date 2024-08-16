import type { MenuItem } from '@/app/usage'
import Layers from  '@/app/usage/(usage)/layers/menu-item'
import Transform from '@/app/usage/(usage)/transform/menu-item'

const item: MenuItem = {
  label: 'Data Isolation',
  href: '/usage/data-isolation',
  description: 'Understand data isolation between frames',
  category: 'Additional Concepts',
  tags: ['layers', 'background', 'foreground', 'renderBackground', 'render', 'renderForeground', 'data', 'transform', 'initialiseData', 'preRenderTransform', 'postRenderTransform'],
  seeAlso: [Layers, Transform]
}

export default item