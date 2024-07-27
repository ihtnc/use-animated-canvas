'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function Filters() {
  const globalFilter = (context: CanvasRenderingContext2D) => {
    context.fillStyle = '#7B3F00'
  }

  const drawBackgroundTriangle = (context: CanvasRenderingContext2D) => {
    context.beginPath()
    context.moveTo(0, context.canvas.height)
    context.lineTo(context.canvas.width * 0.75, context.canvas.height)
    context.lineTo(context.canvas.width * 0.375, 0)
    context.fill()
  }

  const drawTriangle = (context: CanvasRenderingContext2D) => {
    context.beginPath()
    context.moveTo(context.canvas.width * 0.5, context.canvas.height)
    context.lineTo(context.canvas.width, context.canvas.height)
    context.lineTo(context.canvas.width * 0.75, context.canvas.height * 0.25)
    context.fill()
  }

  const drawForegroundTriangle = (context: CanvasRenderingContext2D) => {
    context.beginPath()
    context.moveTo(context.canvas.width * 0.25, context.canvas.height)
    context.lineTo(context.canvas.width * 0.75, context.canvas.height)
    context.lineTo(context.canvas.width * 0.5, context.canvas.height * 0.5)
    context.fill()
  }

  const { Canvas } = use2dAnimatedCanvas({
    globalFilter,
    renderBackgroundFilter: (context) => {
      context.globalAlpha = 0.25
    },
    renderBackground: drawBackgroundTriangle,
    renderFilter: (context) => {
      context.globalAlpha = 0.5
    },
    render: drawTriangle,
    renderForegroundFilter: (context) => {
      context.globalAlpha = 0.75
    },
    renderForeground: drawForegroundTriangle
  })

  const code = `
    export default function Filters() {
      const globalFilter = (context) => {
        // set the fill style for the entire canvas
      }

      // since there is a separate function for applying layer-specific filters,
      //   render functions can then focus on just rendering objects in their respective layers
      const drawBackgroundTriangle = (context) => {
        // render a triangle in the background
      }
      const drawTriangle = (context) => {
        // render a triangle
      }
      const drawForegroundTriangle = (context) => {
        // render a triangle in the foreground
      }

      const { Canvas } = use2dAnimatedCanvas({
        globalFilter,

        renderBackgroundFilter: (context) => {
          // this function gets called before the renderBackground function
          // ideally, this function should be used to make global changes to the context
          //   which will persist when the renderBackground function is called
          // the context will be reset after the renderBackground function call
          //   however, the changes made on the globalFilter function will persist

          // set the opacity of the background layer
        },
        renderBackground: drawBackgroundTriangle,

        renderFilter: (context) => {
          // this function gets called before the render function
          // ideally, this function should be used to make global changes to the context
          //   which will persist when the render function is called
          // the context will be reset after the render function call
          //   however, the changes made on the globalFilter function will persist

          // set the opacity of the background layer
        },
        render: drawTriangle,

        renderForegroundFilter: (context) => {
          // this function gets called before the renderForeground function
          // ideally, this function should be used to make global changes to the context
          //   which will persist when the renderForeground function is called
          // the context will be reset after the renderForeground function call
          //   however, the changes made on the globalFilter function will persist

          // set the opacity of the background layer
        },
        renderForeground: drawForegroundTriangle
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
