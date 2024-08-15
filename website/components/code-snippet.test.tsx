import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import CodeSnippet from './code-snippet'
import typescript from 'highlight.js/lib/languages/typescript'

describe('CodeSnippet component', () => {
  test('should render collapsible code with typescript styles by default', () => {
    const code = 'const message = "Hello, world!";'
    const { container } = render(<CodeSnippet
      code={code}
      language='typescript'
      languageFn={typescript}
    />)

    expect(container).toMatchSnapshot()
  })

  test('should render collapsible code with typescript styles', () => {
    const code = 'const message = "Hello, world!";'
    const { container } = render(<CodeSnippet
      code={code}
      language='typescript'
      languageFn={typescript}
      collapsible={true}
    />)

    expect(container).toMatchSnapshot()
  })

  test('should render code with typescript styles', () => {
    const code = 'const message = "Hello, world!";'
    const { container } = render(<CodeSnippet
      code={code}
      language='typescript'
      languageFn={typescript}
      collapsible={false}
    />)

    expect(container).toMatchSnapshot()
  })

  test('should apply hljs-specific styles', () => {
    const code = 'const message = "Hello, world!";'
    const { container } = render(<CodeSnippet
      code={code}
      language='typescript'
      languageFn={typescript}
    />)

    const keywordValue = container.querySelector('.hljs-keyword')
    const stringValue = container.querySelector('.hljs-string')
    expect(keywordValue).not.toBeNull()
    expect(stringValue).not.toBeNull()
  })

  test('should render collapsible sections when specified', () => {
    const code = 'const message = "Hello, world!";'
    const { queryByText } = render(<CodeSnippet
      code={code}
      language='typescript'
      languageFn={typescript}
      collapsible={true}
    />)

    const collapseButton = queryByText('Code')
    expect(collapseButton).not.toBeNull()
  })

  test('should not render collapsible sections when specified', () => {
    const code = 'const message = "Hello, world!";'
    const { queryByText } = render(<CodeSnippet
      code={code}
      language='typescript'
      languageFn={typescript}
      collapsible={false}
    />)

    const collapseButton = queryByText('Code')
    expect(collapseButton).toBeNull()
  })
})