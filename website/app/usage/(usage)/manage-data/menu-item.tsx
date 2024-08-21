import type { MenuItem } from '@/app/usage'
import Layers from  '@/app/usage/(usage)/layers/menu-item'
import Transform from '@/app/usage/(usage)/transform/menu-item'
import DataIsolation from '@/app/usage/(usage)/data-isolation/menu-item'

const item: MenuItem = {
  label: 'Manage Data',
  href: '/usage/manage-data',
  description: 'Understand how to manually manage the internal data',
  category: 'Additional Concepts',
  tags: ['layers', 'background', 'foreground', 'renderBackground', 'render', 'renderForeground', 'data', 'transform', 'initialiseData', 'preRenderTransform', 'postRenderTransform', 'protectData'],
  seeAlso: [Layers, Transform, DataIsolation]
}

export default item