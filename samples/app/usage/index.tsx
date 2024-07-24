import Basic from './basic/menu-item'
import Layers from './layers/menu-item'
import Filters from './filters/menu-item'
import Data from './data/menu-item'
import Transform from './transform/menu-item'
import Keyboard from './keyboard/menu-item'
import Click from './click/menu-item'
import Pointer from './pointer/menu-item'
import Resize from './resize/menu-item'
import Grid from './grid/menu-item'
import CustomGrid from './custom-grid/menu-item'
import Details from './details/menu-item'
import CustomDetails from './custom-details/menu-item'
import Debug from './debug/menu-item'
import ConditionalDebug from './conditional-debug/menu-item'

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
    Filters,
    Data,
    Transform,
    Keyboard,
    Click,
    Pointer,
    Resize,
    Grid,
    CustomGrid,
    Details,
    CustomDetails,
    Debug,
    ConditionalDebug
  ]
}

export { getMenus }