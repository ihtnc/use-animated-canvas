import typescript from 'highlight.js/lib/languages/typescript'
import CodeSnippet, { type CodeSnippetComponent } from './code-snippet'

const code: CodeSnippetComponent = ({ code, collapsible }) => <CodeSnippet
  code={code}
  language='typescript'
  languageFn={typescript}
  collapsible={collapsible}
/>

export default code