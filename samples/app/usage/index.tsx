import Basic from './basic/menu-item'
import Layers from './layers/menu-item'
import Filters from './filters/menu-item'

export type MenuItem = {
  label: string,
  href: string,
  description: string,
  category: string,
  tags?: Array<string>
}

export type Menu = {
  category: string,
  items: Array<MenuItem>
}

const getMenus = (): Array<MenuItem> => {
  return [Basic, Layers, Filters]
}

export { getMenus }