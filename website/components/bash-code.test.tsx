import { describe, test, expect, vi, beforeEach, afterAll } from 'vitest'
import { render } from '@testing-library/react'
import CodeSnippet from './code-snippet'
import bash from 'highlight.js/lib/languages/bash'
import BashCode from './bash-code'

vi.mock('@/components/code-snippet', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/components/code-snippet')>(),
  default: vi.fn().mockReturnValue(<div id='CodeSnippet' />)
}))

describe('BashCode component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  test('should render CodeSnippet component', () => {
    const code = 'npm run install'
    const { container } = render(<BashCode code={code} />)

    expect(container).toMatchSnapshot()
  })

  test('should call internal CodeSnippet component', () => {
    const code = 'npm run install'
    const collapsible = false
    render(<BashCode code={code} collapsible={collapsible} />)

    expect(CodeSnippet).toHaveBeenCalledWith({
      code,
      language: 'bash',
      languageFn: bash,
      collapsible
    }, expect.anything())
  })
})