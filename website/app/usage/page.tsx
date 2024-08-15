'use client'

import { useEffect, useState } from 'react'
import { getMenus, type Menu, type MenuItem } from './'
import Link from 'next/link'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'

export default function Usage() {
  const [ menus, setMenus ] = useState<Array<MenuItem>>([])
  const [ filtered, setFiltered ] = useState<Array<MenuItem>>([])
  const [ display, setDisplay ] = useState<Array<Menu>>([])

  const filter = (search?: string): Array<MenuItem> => {
    if (search === undefined || search.trim().length === 0) { return [...menus] }

    return menus.filter((item) => {
      const label = item.label.toLowerCase().includes(search.toLowerCase())
      const category = item.category.toLowerCase().includes(search.toLowerCase())
      const description = item.description.toLowerCase().includes(search.toLowerCase())
      const tags = item.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))

      return label || category || description || tags
    })
  }

  const categorise = (items: Array<MenuItem>): Array<Menu> => {
    const categories = items.map((item) => item.category)
    const unique = Array.from(new Set(categories))

    const menuItemGroups = unique.map((category) => {
      return {
        category,
        items: items.filter((item) => item.category === category)
      }
    })

    return menuItemGroups.filter((group) => group.items.length > 0)
  }

  useEffect(() => {
    setMenus(getMenus())
  }, [])

  useEffect(() => {
    setFiltered(filter())
  }, [menus])

  useEffect(() => {
    setDisplay(categorise(filtered))
  }, [filtered])

  return (
    <>
      <h2 className="mt-4 ml-4 mr-4 text-2xl text-center font-semibold">use2dAnimatedCanvas Examples</h2>
      <input
        type="search"
        placeholder="Search examples..."
        className="rounded-lg border border-gray-300 text-gray-600 px-5 py-4 transition-colors hover:border-gray-400 focus:border-gray-400 focus:outline-none mb-4 caret-current"
        onInput={(event) => setFiltered(filter(event.currentTarget.value))}
        autoFocus
      />
      {display.map((group, index) => (
        <Disclosure as="span" key={index} defaultOpen={index <= 1} className="w-full">
          <DisclosureButton as="h3" className="flex group w-fit mx-auto col-span-4 text-xl font-semibold mb-3 cursor-pointer">
            {group.category}&nbsp;
            <span className="inline-block transition-transform motion-reduce:transform-none
              group-data-[open]:-rotate-90
              group-data-[open]:pl-1
              group-data-[open]:pt-1
              group-hover:group-data-[open]:-translate-y-1
              group-hover:translate-y-1
              rotate-90
              pb-1">
              -&gt;
            </span>
          </DisclosureButton>
          <DisclosurePanel className="md:w-full md:max-w-5xl rounded-lg p-2 mb-8 bg-gradient-to-b from-gray-300 dark:from-neutral-700 to-transparent">
            <div className="grid text-center w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:text-left">
              {group.items.map((item, itemIndex) => (
                <Link
                  href={item.href}
                  className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                  rel="noopener noreferrer"
                  key={`${index}_${itemIndex}`}
                >
                  <h2 className="mb-3 text-2xl font-semibold">
                    {`${item.label} `}
                    <span className="inline-block text-lg transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                      -&gt;
                    </span>
                  </h2>
                  <p className="m-0 text-sm opacity-50">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>
      ))}
    </>
  )
}
