import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import Pointer from '@/app/usage/pointer/menu-item'
import Transform from '@/app/usage/transform/menu-item'
import MultiTransform from '@/app/usage/multi-transform/menu-item'
import ConditionalTransform from '@/app/usage/conditional-transform/menu-item'
import MultiConditionalTransform from '@/app/usage/multi-conditional-transform/menu-item'
import ConditionalMultiTransform from '@/app/usage/conditional-multi-transform/menu-item'
import MultiRender from '@/app/usage/multi-render/menu-item'

const item: MenuItem = {
  label: 'Keepy Uppy',
  href: '/usage/keepy-uppy',
  description: 'Don\'t let the ball touch the ground!',
  category: 'Tying it all together',
  tags: ['data', 'pointer', 'events', 'transform', 'multiple', 'condition', 'layer', 'demo', 'sample'],
  seeAlso: [Layers, Pointer, Transform, MultiTransform, ConditionalTransform, MultiConditionalTransform, ConditionalMultiTransform, MultiRender]
}

export default item