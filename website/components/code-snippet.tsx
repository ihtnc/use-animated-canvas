import hljs from 'highlight.js/lib/core'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import 'highlight.js/styles/github.css'
import { type LanguageFn } from 'highlight.js'

export interface CodeSnippetComponent {
  ({ code, collapsible }: {
    code: string,
    collapsible?: boolean
  }): JSX.Element
}

type CodeSnippetProps = {
  language: string,
  code: string,
  languageFn: LanguageFn,
  collapsible?: boolean
}

export default function CodeSnippet ({code, language, languageFn, collapsible = true}: CodeSnippetProps) {
  hljs.registerLanguage(language, languageFn)

  const highlighted = hljs.highlight(code, { language })

  const snippet = () => (
    <div className="rounded-lg w-full max-h-[75dvh] md:max-h-fit p-2 bg-gradient-to-b from-gray-300 dark:from-neutral-700 to-transparent overflow-auto">
      <pre>
        <code dangerouslySetInnerHTML={{ __html: highlighted.value }}></code>
      </pre>
    </div>
  )

  const collapsibleSnippet = () => (
    <Disclosure as="div" defaultOpen={true} className="pb-4 w-full">
      <DisclosureButton as="h3" className="flex w-fit group text-xl font-semibold cursor-pointer">
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
        {snippet()}
      </DisclosurePanel>
    </Disclosure>
  )

  return (<>
    {collapsible ? collapsibleSnippet() : snippet()}
  </>)
}