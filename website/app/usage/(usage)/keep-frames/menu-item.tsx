import type { MenuItem } from '@/app/usage'
import Data from '@/app/usage/(usage)/data/menu-item'

const item: MenuItem = {
  label: 'Keep Frames',
  href: '/usage/keep-frames',
  description: 'Prevent clearing of the canvas each frame',
  category: 'Basic Usage',
  tags: ['basic', 'render', 'clear', 'frames'],
  seeAlso: [Data]
}

export default item