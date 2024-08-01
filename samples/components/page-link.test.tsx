import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import PageLink from './page-link'

describe('PageLink component', () => {
  test('should render correctly', () => {
    const { container } = render(<PageLink href='/href' label='label' />)

    expect(container).toMatchSnapshot()
  })

  test('should render anchor element correctly', () => {
    const href = '/test'
    const label = 'test-label'

    const { container } = render(<PageLink href={href} label={label} />)

    const link = container.querySelector('a')

    expect(link).not.toBeNull()
    expect(link!.getAttribute('href')).toBe(href)
    expect(link!.text).toBe(label)
  })
})