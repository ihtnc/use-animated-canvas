'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function GlobalFilters() {

  const { Canvas } = use2dAnimatedCanvas({
    globalFilter: (context) => {
      context.strokeStyle = '#7B3F00'
    },
    renderBackground: (context, data) => {
      const frame = data?.drawData?.frame ?? 0
      const center = context.canvas.width / 4
      const radius = center
      const current = (frame + radius * 0.5) % radius
      context.beginPath()
      context.arc(center, center, current, 0, 2*Math.PI)
      context.stroke()
    },
    render: (context, data) => {
      const frame = data?.drawData?.frame ?? 0
      const center = context.canvas.width / 2
      const radius = context.canvas.width / 4
      const current = (frame) % radius
      context.beginPath()
      context.arc(center, center, current, 0, 2*Math.PI)
      context.stroke()
    },
    renderForeground: (context, data) => {
      const frame = data?.drawData?.frame ?? 0
      const center = context.canvas.width * 0.75
      const radius = context.canvas.width / 4
      const current = (frame + radius * 1.75) % radius
      context.beginPath()
      context.arc(center, center, current, 0, 2*Math.PI)
      context.stroke()
    }
  })

  const code = `
    export default function GlobalFilters() {
      const { Canvas } = use2dAnimatedCanvas({
        globalFilter: (context) => {
          // this function gets called every frame
          //   and is called before any other render or filter functions
          // ideally, this function should be used to make global changes to the context
          //   which will persist when succeeding functions are called
          // the context will be reset after all other render or filter function calls

          // set line color for the entire canvas
        },

        // since there is a separate function for applying global filters,
        //   render functions can then focus on just rendering objects
        //   in a their respective layers
        renderBackground: (context, data) => {
          // render a circle in the top left of the canvas
          //   that grows a little bit every frame
        },
        render: (context, data) => {
          // render a circle in the middle of the canvas
          //   that grows a little bit every frame
        },
        renderForeground: (context, data) => {
          // render a circle in the bottom right of the canvas
          //   that grows a little bit every frame
        }
      })

      return <Canvas />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black dark:border-gray-300' />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
