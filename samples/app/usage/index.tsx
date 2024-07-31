import Basic from './basic/menu-item'
import Layers from './layers/menu-item'
import GlobalFilters from './global-filters/menu-item'
import Filters from './filters/menu-item'
import Data from './data/menu-item'
import Transform from './transform/menu-item'

import Keyboard from './keyboard/menu-item'
import Click from './click/menu-item'
import Pointer from './pointer/menu-item'
import Resize from './resize/menu-item'

import MultiRender from './multi-render/menu-item'
import ConditionalRender from './conditional-render/menu-item'
import MultiConditionalRender from './multi-conditional-render/menu-item'
import ConditionalMultiRender from './conditional-multi-render/menu-item'
import MultiFilter from './multi-filter/menu-item'
import ConditionalFilter from './conditional-filter/menu-item'
import MultiConditionalFilter from './multi-conditional-filter/menu-item'
import ConditionalMultiFilter from './conditional-multi-filter/menu-item'
import MultiTransform from './multi-transform/menu-item'
import ConditionalTransform from './conditional-transform/menu-item'
import MultiConditionalTransform from './multi-conditional-transform/menu-item'
import ConditionalMultiTransform from './conditional-multi-transform/menu-item'

import Grid from './grid/menu-item'
import CustomGrid from './custom-grid/menu-item'
import Details from './details/menu-item'
import CustomDetails from './custom-details/menu-item'

import Debug from './debug/menu-item'
import ConditionalDebug from './conditional-debug/menu-item'

import RenderContext from './render-context/menu-item'
import FilterContext from './filter-context/menu-item'
import UtilityContext from './utility-context/menu-item'
import UtilityOrder from './utility-order/menu-item'

import KeepyUppy from './keepy-uppy/menu-item'

export type MenuItem = {
  label: string,
  href: string,
  description: string,
  category: string,
  tags?: Array<string>,
  seeAlso?: Array<MenuItem>
}

export type Menu = {
  category: string,
  items: Array<MenuItem>
}

const getMenus = (): Array<MenuItem> => {
  return [
    Basic,
    Layers,
    GlobalFilters,
    Filters,
    Data,
    Transform,

    Keyboard,
    Click,
    Pointer,
    Resize,

    MultiRender,
    ConditionalRender,
    MultiConditionalRender,
    ConditionalMultiRender,
    MultiFilter,
    ConditionalFilter,
    MultiConditionalFilter,
    ConditionalMultiFilter,
    MultiTransform,
    ConditionalTransform,
    MultiConditionalTransform,
    ConditionalMultiTransform,

    Grid,
    CustomGrid,
    Details,
    CustomDetails,

    Debug,
    ConditionalDebug,

    RenderContext,
    FilterContext,
    UtilityContext,
    UtilityOrder,

    KeepyUppy
  ]
}

export { getMenus }