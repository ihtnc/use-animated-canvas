import type { MenuItem } from '@/app/usage'
import Basic from '@/app/usage/basic/menu-item'

const item: MenuItem = {
  label: 'Render Data',
  href: '/usage/data',
  description: 'Render using custom data',
  category: 'Basic Usage',
  tags: ['data'],
  seeAlso: [Basic]
}

export default item