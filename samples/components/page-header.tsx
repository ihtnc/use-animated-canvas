import PageLink from "@/components/page-link"

export default function PageHeader() {
  return (<>
    <h1 className="mb-4 ml-4 mr-4 text-3xl text-center font-semibold">use2dAnimatedCanvas Examples</h1>
    <span className="mb-4 flex row">
      <PageLink href="https://www.npmjs.com/package/@ihtnc/use-animated-canvas" label="package" />
      <PageLink href="https://github.com/ihtnc/use-animated-canvas" label="repo" />
    </span>
  </>)
}