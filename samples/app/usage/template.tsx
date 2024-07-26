import Link from "next/link"

const Template = ({ children }: { children: JSX.Element }) => {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="mb-4 text-3xl font-semibold">use2dAnimatedCanvas Examples</h1>
      <span className="mb-4">
        [<a href="https://www.npmjs.com/package/@ihtnc/use-animated-canvas" className="text-blue-500">package</a>]
        [<a href="https://github.com/ihtnc/use-animated-canvas" className="text-blue-500">repo</a>]
      </span>
      <div className="grid place-self-start">
        <Link
          href="../"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h3 className="text-xl font-semibold">
            <span className="inline-block transition-transform group-hover:-translate-x-1 motion-reduce:transform-none">
              &lt;-
            </span>
            {" "}Back
          </h3>
        </Link>
      </div>
      <div className="flex flex-col w-full h-full pl-16">
        {children}
      </div>
    </main>
  )
}

export default Template