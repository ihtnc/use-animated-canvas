'use client'

import { useEffect, useState } from 'react'
import { getMenus, type Menu, type MenuItem } from './usage'
import Link from 'next/link'

export default function Home() {
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
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="mb-4 text-3xl font-semibold">use2dAnimatedCanvas Examples</h1>
      <span className="mb-4">
        [<a href="https://www.npmjs.com/package/@ihtnc/use-animated-canvas" className="text-blue-500">package</a>]
        [<a href="https://github.com/ihtnc/use-animated-canvas" className="text-blue-500">repo</a>]
      </span>
      <input
        type="search"
        placeholder="Search examples..."
        className="rounded-lg border border-gray-300 px-5 py-4 transition-colors hover:border-gray-400 focus:border-gray-400 focus:outline-none mb-4"
        onInput={(event) => setFiltered(filter(event.currentTarget.value))}
        autoFocus
      />
      {display.map((group, index) => (
        <div className="grid text-center lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left mb-8" key={index}>
          <h3 className="col-span-4 text-xl font-semibold mb-3">{group.category}</h3>
          {group.items.map((item, itemIndex) => (
            <Link
              href={item.href}
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              rel="noopener noreferrer"
              key={`${index}_${itemIndex}`}
            >
              <h2 className="mb-3 text-2xl font-semibold">
                {`${item.label} `}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      ))}
    </main>
  );
}
