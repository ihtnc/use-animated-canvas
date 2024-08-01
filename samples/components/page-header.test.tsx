import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import PageHeader from './page-header'

describe('PageHeader component', () => {
  test('should render correctly', () => {
    const { container } = render(<PageHeader />)

    expect(container).toMatchSnapshot()
  })

  test('should render two anchor elements', () => {
    const { container } = render(<PageHeader />)

    const links = container.querySelectorAll('a')

    expect(links).not.toBeNull()
    expect(links!).toHaveLength(2)
  })

  test('should render link for the package', () => {
    const { container } = render(<PageHeader />)

    const links = container.querySelectorAll('a')

    let link: HTMLAnchorElement | null = null
    links.forEach((item) => {
      if (item.text === 'package') {
        link = item
      }
    })

    expect(link).not.toBeNull()
  })

  test('should render link for the repo', () => {
    const { container } = render(<PageHeader />)

    const links = container.querySelectorAll('a')

    let link: HTMLAnchorElement | null = null
    links.forEach((item) => {
      if (item.text === 'repo') {
        link = item
      }
    })

    expect(link).not.toBeNull()
  })
})