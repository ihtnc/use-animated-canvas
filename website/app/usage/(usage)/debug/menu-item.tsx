import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/(usage)/layers/menu-item'
import Keyboard from '@/app/usage/(usage)/keyboard/menu-item'

const item: MenuItem = {
  label: 'Debugging',
  href: '/usage/debug',
  description: 'Step through the rendering loop',
  category: 'Troubleshooting',
  tags: ['debug', 'troubleshoot', 'dev', 'issue', 'error', 'renderStart', 'renderBreak', 'renderStep', 'enableDebug', 'options'],
  seeAlso: [Layers, Keyboard]
}

export default item