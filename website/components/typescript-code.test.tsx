import { describe, test, expect, vi, beforeEach, afterAll } from 'vitest'
import { render } from '@testing-library/react'
import CodeSnippet from './code-snippet'
import typescript from 'highlight.js/lib/languages/typescript'
import TypeScriptCode from './typescript-code'

vi.mock('@/components/code-snippet', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/components/code-snippet')>(),
  default: vi.fn().mockReturnValue(<div id='CodeSnippet' />)
}))

describe('TypeScriptCode component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  test('should render CodeSnippet component', () => {
    const code = 'const message = "Hello, world!";'
    const { container } = render(<TypeScriptCode code={code} />)

    expect(container).toMatchSnapshot()
  })

  test('should call internal CodeSnippet component', () => {
    const code = 'const message = "Hello, world!";'
    const collapsible = false
    render(<TypeScriptCode code={code} collapsible={collapsible} />)

    expect(CodeSnippet).toHaveBeenCalledWith({
      code,
      language: 'typescript',
      languageFn: typescript,
      collapsible
    }, expect.anything())
  })
})