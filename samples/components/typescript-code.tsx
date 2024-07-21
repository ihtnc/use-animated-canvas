import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import 'highlight.js/styles/vs.css'

type TypeScriptCodeProps = {
  code: string
}

export default function TypeScriptCode({code}: TypeScriptCodeProps) {
  hljs.registerLanguage('typescript', typescript)

  const highlighted = hljs.highlight(code, { language: 'typescript' })

  return (
    <pre>
      <code dangerouslySetInnerHTML={{ __html: highlighted.value }}></code>
    </pre>
  )
}