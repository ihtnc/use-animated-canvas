import type { MenuItem } from '@/app/usage'
import Data from '@/app/usage/data/menu-item'

const item: MenuItem = {
  label: 'Transform Data',
  href: '/usage/transform',
  description: 'Basic rendering with data transformation example',
  category: 'Basic Usage',
  tags: ['data', 'transform'],
  seeAlso: [Data]
}

export default item