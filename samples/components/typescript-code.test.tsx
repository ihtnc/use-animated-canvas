import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import TypeScriptCode from './typescript-code'

describe('TypeScriptCode component', () => {
  test('should render code with typescript styles', () => {
    const code = 'const message = "Hello, world!";'
    const { container } = render(<TypeScriptCode code={code} />)

    expect(container).toMatchSnapshot()
  })

  test('should apply hljs-specific styles', () => {
    const code = 'const message = "Hello, world!";'
    const { container } = render(<TypeScriptCode code={code} />)

    const keywordValue = container.querySelector('.hljs-keyword')
    const stringValue = container.querySelector('.hljs-string')
    expect(keywordValue).not.toBeNull()
    expect(stringValue).not.toBeNull()
  })
})