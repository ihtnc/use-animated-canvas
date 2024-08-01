import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import 'highlight.js/styles/github.css'

type TypeScriptCodeProps = {
  code: string
}

export default function TypeScriptCode({code}: TypeScriptCodeProps) {
  hljs.registerLanguage('typescript', typescript)

  const highlighted = hljs.highlight(code, { language: 'typescript' })

  return (<>
    <Disclosure as="span" defaultOpen={true} className="pb-4">
      <DisclosureButton as="h3" className="flex group text-xl font-semibold cursor-pointer">
        Code&nbsp;
        <span className="inline-block transition-transform motion-reduce:transform-none
          group-data-[open]:-rotate-90
          group-data-[open]:pl-1
          group-data-[open]:pt-1
          group-hover:group-data-[open]:-translate-y-1
          group-hover:translate-y-1
          rotate-90
          pb-1">
          -&gt;
        </span>
      </DisclosureButton>
      <DisclosurePanel>
        <pre>
          <code dangerouslySetInnerHTML={{ __html: highlighted.value }}></code>
        </pre>
      </DisclosurePanel>
    </Disclosure>
  </>)
}