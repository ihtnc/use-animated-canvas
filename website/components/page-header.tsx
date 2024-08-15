import PageLink from "@/components/page-link"
import Link from "next/link"

export default function PageHeader() {
  return (<>
    <h1 className="ml-4 mr-4 text-3xl text-center font-semibold">
      <Link href="/">use-animated-canvas</Link>
    </h1>
    <span className="flex row">
      <PageLink href="/" label="home" />
      <PageLink href="https://www.npmjs.com/package/@ihtnc/use-animated-canvas" label="package" />
      <PageLink href="https://github.com/ihtnc/use-animated-canvas" label="repo" />
    </span>
  </>)
}