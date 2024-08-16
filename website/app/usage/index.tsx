import Basic from './(usage)/basic/menu-item'
import Layers from './(usage)/layers/menu-item'
import GlobalFilters from './(usage)/global-filters/menu-item'
import Filters from './(usage)/filters/menu-item'
import Data from './(usage)/data/menu-item'
import Transform from './(usage)/transform/menu-item'

import Focus from './(usage)/focus/menu-item'
import Keyboard from './(usage)/keyboard/menu-item'
import Click from './(usage)/click/menu-item'
import Pointer from './(usage)/pointer/menu-item'
import Resize from './(usage)/resize/menu-item'

import MultiRender from './(usage)/multi-render/menu-item'
import ConditionalRender from './(usage)/conditional-render/menu-item'
import MultiConditionalRender from './(usage)/multi-conditional-render/menu-item'
import ConditionalMultiRender from './(usage)/conditional-multi-render/menu-item'
import MultiFilter from './(usage)/multi-filter/menu-item'
import ConditionalFilter from './(usage)/conditional-filter/menu-item'
import MultiConditionalFilter from './(usage)/multi-conditional-filter/menu-item'
import ConditionalMultiFilter from './(usage)/conditional-multi-filter/menu-item'
import MultiTransform from './(usage)/multi-transform/menu-item'
import ConditionalTransform from './(usage)/conditional-transform/menu-item'
import MultiConditionalTransform from './(usage)/multi-conditional-transform/menu-item'
import ConditionalMultiTransform from './(usage)/conditional-multi-transform/menu-item'

import Grid from './(usage)/grid/menu-item'
import CustomGrid from './(usage)/custom-grid/menu-item'
import Details from './(usage)/details/menu-item'
import CustomDetails from './(usage)/custom-details/menu-item'

import Debug from './(usage)/debug/menu-item'
import ConditionalDebug from './(usage)/conditional-debug/menu-item'

import LifeCycle from './(usage)/lifecycle/menu-item'
import DataIsolation from './(usage)/data-isolation/menu-item'
import RenderContext from './(usage)/render-context/menu-item'
import FilterContext from './(usage)/filter-context/menu-item'
import UtilityContext from './(usage)/utility-context/menu-item'
import UtilityOrder from './(usage)/utility-order/menu-item'

import KeepyUppy from './(usage)/keepy-uppy/menu-item'

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

    Focus,
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

    LifeCycle,
    DataIsolation,
    RenderContext,
    FilterContext,
    UtilityContext,
    UtilityOrder,

    KeepyUppy
  ]
}

export { getMenus }