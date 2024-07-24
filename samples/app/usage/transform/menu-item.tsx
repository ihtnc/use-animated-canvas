import type { MenuItem } from '@/app/usage'
import Data from '@/app/usage/data/menu-item'

const item: MenuItem = {
  label: 'Transform Data',
  href: '/usage/transform',
  description: 'Transform custom data before and after rendering',
  category: 'Basic Usage',
  tags: ['data', 'transform', 'initialiseData', 'preRenderTransform', 'postRenderTransform'],
  seeAlso: [Data]
}

export default item