import type { MenuItem } from '@/app/usage'
import Basic from '@/app/usage/basic/menu-item'
import Click from '@/app/usage/click/menu-item'
import CustomDetails from '@/app/usage/custom-details/menu-item'
import Transform from '@/app/usage/transform/menu-item'
import Debug from '@/app/usage/debug/menu-item'

const item: MenuItem = {
  label: 'Conditional Debug',
  href: '/usage/conditional-debug',
  description: 'Pause the rendering loop when a condition is met',
  category: 'Troubleshooting',
  tags: ['debug', 'troubleshoot', 'dev', 'issue', 'error', 'break', 'when', 'condition', 'autoStart', 'renderBreakWhen', 'options'],
  seeAlso: [Basic, Click, Transform, CustomDetails, Debug]
}

export default item