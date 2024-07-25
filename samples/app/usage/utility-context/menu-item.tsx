import type { MenuItem } from '@/app/usage'
import Layers from '@/app/usage/layers/menu-item'
import GlobalFilters from '@/app/usage/global-filters/menu-item'
import Grid from '@/app/usage/grid/menu-item'
import CustomDetails from '@/app/usage/custom-details/menu-item'
import RenderContext from '@/app/usage/render-context/menu-item'

const item: MenuItem = {
  label: 'Utility Context',
  href: '/usage/utility-context',
  description: 'Understand the behaviour of utility layer render functions',
  category: 'Advanced Concepts',
  tags: ['context', 'utility', 'helper', 'grid', 'custom', 'environment', 'details', 'autoResetContext', 'renderGridLayer', 'renderEnvironmentLayer', 'options'],
  seeAlso: [Layers, GlobalFilters, Grid, CustomDetails, RenderContext]
}

export default item