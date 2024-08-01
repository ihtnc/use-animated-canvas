import { render } from '@testing-library/react'
import SeeAlso from './see-also'
import { describe, expect, test } from 'vitest'
import { MenuItem } from '@/app/usage'

describe('SeeAlso component', () => {
  test('should render correctly', () => {
    const references: Array<MenuItem> = [
      { href: '/page1', label: 'Page 1', description: 'Page 1 description', category: 'Page 1 category' }
    ]

    const { container } = render(<SeeAlso references={references} />)

    expect(container).toMatchSnapshot()
  })

  test('should render null when references is undefined', () => {
    const { container } = render(<SeeAlso />)
    expect(container.firstChild).toBeNull()
  })

  test('should render null when references is an empty array', () => {
    const { container } = render(<SeeAlso references={[]} />)
    expect(container.firstChild).toBeNull()
  })

  test('should render the heading', () => {
    const references: Array<MenuItem> = [
      { href: '/page1', label: 'Page 1', description: 'Page 1 description', category: 'Page 1 category' }
    ]
    const { getByText } = render(<SeeAlso references={references} />)

    const heading = getByText('See also')
    expect(heading).not.toBeNull()
  })

  test('should render as many anchor elements as the reference', () => {
    const references: Array<MenuItem> = [
        { href: '/page1', label: 'Page 1', description: 'Page 1 description', category: 'Page 1 category' },
        { href: '/page2', label: 'Page 2', description: 'Page 2 description', category: 'Page 2 category' },
      ]
      const { container } = render(<SeeAlso references={references} />)
    const links = container.querySelectorAll('a')

    expect(links).not.toBeNull()
    expect(links!).toHaveLength(2)
  })

  test('should render the heading and links when references are provided', () => {
    const menu: MenuItem = { href: '/page1', label: 'Page 1', description: 'Page 1 description', category: 'Page 1 category' }
    const references = [menu]

    const { container } = render(<SeeAlso references={references} />)

    const link = container.querySelector('a')
    expect(link).not.toBeNull()
    expect(link!.text).toBe(menu.label)
    expect(link!.getAttribute('href')).toBe(menu.href)
  })
})