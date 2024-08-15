import bash from 'highlight.js/lib/languages/bash'
import CodeSnippet, { type CodeSnippetComponent } from './code-snippet'

const code: CodeSnippetComponent = ({ code, collapsible }) => <CodeSnippet
  code={code}
  language='bash'
  languageFn={bash}
  collapsible={collapsible}
  />

export default code