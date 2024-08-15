'use client'

import PageLink from "@/components/page-link"
import TypeScriptCode from "@/components/typescript-code"
import BashCode from "@/components/bash-code"

export default function Home() {
  const installationCode = `
    npm install @ihtnc/use-animated-canvas
  `

  const usageCode = `
    import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'

    const App = () => {
      const { Canvas } = use2dAnimatedCanvas({
        render: (context, data) => {
          // this function gets called every frame
          // use context to draw on the canvas
          // use data to access details like frame count, fps, etc
          // data can also include a user-defined value if supplied
        }
      })

      return <Canvas />
    };
  `

  return (
    <>
      <section className="w-full flex flex-col gap-3 text-center mb-4">
        <p>
          A React hook to create a canvas element with a built-in render loop.
          <br />
          Useful for creating animations, games, and other interactive graphics.
        </p>
      </section>
      <section className="w-full flex flex-col gap-3 mb-4">
        <h3 className="text-center text-xl font-semibold">Installation</h3>
        <BashCode code={installationCode} collapsible={false} />
      </section>
      <section className="w-full flex flex-col gap-3 mb-4">
        <h3 className="text-center text-xl font-semibold">Usage</h3>
        <TypeScriptCode code={usageCode} collapsible={false} />
        <p className="p-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 border-2 border-gray-300" role="alert">
          More usage examples are available <span className="inline-block"><PageLink href='/usage' label='here' /></span>.
        </p>
      </section>
      <section className="w-full flex flex-col gap-3 mb-4">
        <h3 className="text-center text-xl font-semibold">Animation</h3>
        <p>
          The HTML canvas element allows us to render objects (images, lines, shapes, text, etc) through code.
          Animation in a canvas is achieved by rendering a series of images (frames) in quick succession.
          This gives the illusion of movement (think <span className="inline-block"><PageLink href="https://en.wikipedia.org/wiki/Zoetrope" label="zoetrope" /></span>).
        </p>
        <p>
          The <span className="inline-block"><PageLink href="https://www.npmjs.com/package/@ihtnc/use-animated-canvas" label="@ihtnc/use-animated-canvas" /></span> package provides React hooks as a way to create animations by calling various handlers to render a single frame in a canvas HTML element.
          The hook will then start a loop (render loop) that calls each of these handlers perpetually.
        </p>
        <p>
          The idea is that by adding some logic, the handlers will "slightly modify" the frame rendered to the canvas on each iteration.
          And since the loop calls these handlers in rapid succession, the image rendered on the canvas will appear to animate.
        </p>
      </section>
      <section className="w-full flex flex-col gap-3 mb-4">
        <h3 className="text-center text-xl font-semibold">Rendering loop</h3>
        <p>
          Below are handlers exposed by the hook and the order in which they are called in the render loop.
          Every handler except `initialiseData` is called on each iteration of the render loop.
        </p>
        <div className="w-full overflow-auto max-h-[75dvh] md:max-h-full">
          <table className="table-auto w-full text-left rounded-lg p-2 bg-gradient-to-b from-gray-300 dark:from-neutral-700 to-transparent">
            <thead className="text-sm uppercase border-b border-gray-700 dark:border-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3"></th>
                <th scope="col" className="px-6 py-3">Handler</th>
                <th scope="col" className="px-6 py-3">Purpose</th>
                <th scope="col" className="hidden md:table-cell px-6 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-gray-200 odd:dark:bg-neutral-500 mix-blend-multiply dark:mix-blend-lighten">
                <th scope="row" className="px-3 py-2 font-medium">-</th>
                <td className="px-3 py-2">initialiseData</td>
                <td className="px-3 py-2">for initialising data</td>
                <td className="hidden md:table-cell px-3 py-2">called before the render loop starts</td>
              </tr>
              <tr className="odd:bg-gray-200 odd:dark:bg-neutral-500 mix-blend-multiply dark:mix-blend-lighten">
                <th scope="row" className="px-3 py-2 font-medium">1</th>
                <td className="px-3 py-2">preRenderTransform</td>
                <td className="px-3 py-2">for transforming data before any rendering operations</td>
                <td className="hidden md:table-cell px-3 py-2"></td>
              </tr>
              <tr className="odd:bg-gray-200 odd:dark:bg-neutral-500 mix-blend-multiply dark:mix-blend-lighten">
                <th scope="row" className="px-3 py-2 font-medium">2</th>
                <td className="px-3 py-2">globalFilter</td>
                <td className="px-3 py-2">for applying filter operations on all layers</td>
                <td className="hidden md:table-cell px-3 py-2"></td>
              </tr>
              <tr className="odd:bg-gray-200 odd:dark:bg-neutral-500 mix-blend-multiply dark:mix-blend-lighten">
                <th scope="row" className="px-3 py-2 font-medium">3</th>
                <td className="px-3 py-2">renderBackgroundFilter</td>
                <td className="px-3 py-2">for applying filter operations on the background layer</td>
                <td className="hidden md:table-cell px-3 py-2"></td>
              </tr>
              <tr className="odd:bg-gray-200 odd:dark:bg-neutral-500 mix-blend-multiply dark:mix-blend-lighten">
                <th scope="row" className="px-3 py-2 font-medium">4</th>
                <td className="px-3 py-2">renderBackground</td>
                <td className="px-3 py-2">for rendering elements on the background layer</td>
                <td className="hidden md:table-cell px-3 py-2"></td>
              </tr>
              <tr className="odd:bg-gray-200 odd:dark:bg-neutral-500 mix-blend-multiply dark:mix-blend-lighten">
                <th scope="row" className="px-3 py-2 font-medium">5</th>
                <td className="px-3 py-2">renderFilter</td>
                <td className="px-3 py-2">for applying filter operations on the main layer</td>
                <td className="hidden md:table-cell px-3 py-2">these "layers" are just added for logical grouping as they are essentially the same as their background/foreground counterparts</td>
              </tr>
              <tr className="odd:bg-gray-200 odd:dark:bg-neutral-500 mix-blend-multiply dark:mix-blend-lighten">
                <th scope="row" className="px-3 py-2 font-medium">6</th>
                <td className="px-3 py-2">render</td>
                <td className="px-3 py-2">for rendering elements on the main layer</td>
                <td className="hidden md:table-cell px-3 py-2">these "layers" are just added for logical grouping as they are essentially the same as their background/foreground counterparts</td>
              </tr>
              <tr className="odd:bg-gray-200 odd:dark:bg-neutral-500 mix-blend-multiply dark:mix-blend-lighten">
                <th scope="row" className="px-3 py-2 font-medium">7</th>
                <td className="px-3 py-2">renderForegroundFilter</td>
                <td className="px-3 py-2">for applying filter operations on the foreground layer</td>
                <td className="hidden md:table-cell px-3 py-2"></td>
              </tr>
              <tr className="odd:bg-gray-200 odd:dark:bg-neutral-500 mix-blend-multiply dark:mix-blend-lighten">
                <th scope="row" className="px-3 py-2 font-medium">8</th>
                <td className="px-3 py-2">renderForeground</td>
                <td className="px-3 py-2">for rendering elements on the foreground layer</td>
                <td className="hidden md:table-cell px-3 py-2"></td>
              </tr>
              <tr className="odd:bg-gray-200 odd:dark:bg-neutral-500 mix-blend-multiply dark:mix-blend-lighten">
                <th scope="row" className="px-3 py-2 font-medium">9</th>
                <td className="px-3 py-2">postRenderTransform</td>
                <td className="px-3 py-2">for transforming data before the next frame</td>
                <td className="hidden md:table-cell px-3 py-2">ideally for data clean ups</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="p-4 mb-4 text-yellow-800 rounded-lg bg-yellow-50 dark:text-yellow-300 dark:bg-gray-800 border-2 border-gray-300" role="alert">
          <span className="font-medium">IMPORTANT!</span>&nbsp;
          Pay close attention to the order on which you render objects on the canvas.
          Like drawing on a paper, the last thing you draw would overlap the previous drawings.
          The rendering handlers are grouped into 3 layers (background, main, and foreground) to help clearly facilitate this order.
        </p>
      </section>
      <section className="w-full flex flex-col gap-3 mb-4">
        <h3 className="text-center text-xl font-semibold">Stay a while and listen...</h3>
        <p>
          This is a port of the rendering framework developed as part of the <span className="inline-block"><PageLink href='https://github.com/ihtnc/canvas-concoctions' label='canvas-concoctions' /></span> project.
          It has since then been modified to add more features, refactor functionalities, and fix several issues.
        </p>
      </section>
    </>
  )
}
