'use client'

import { type AnimatedCanvasRenderFilterFunction, type AnimatedCanvasRenderFunction, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { useDarkMode } from 'usehooks-ts'

export default function MultiFilter() {
  const { isDarkMode } = useDarkMode()

  const brownFill: AnimatedCanvasRenderFilterFunction = (context) => {
    context.fillStyle = '#7B3F00'
  }

  const blueFill: AnimatedCanvasRenderFilterFunction = (context) => {
    context.fillStyle = '#68CDFE'
  }

  const redStroke: AnimatedCanvasRenderFilterFunction = (context) => {
    context.strokeStyle = isDarkMode ? '#B6391F' : '#FF0000'
    context.lineWidth = 3
  }

  const brownStroke: AnimatedCanvasRenderFilterFunction = (context) => {
    context.strokeStyle = '#7B3F00'
    context.lineWidth = 3
  }

  const opacity50: AnimatedCanvasRenderFilterFunction = (context) => {
    context.globalAlpha = 0.5
  }

  const opacity25: AnimatedCanvasRenderFilterFunction = (context) => {
    context.globalAlpha = 0.25
  }

  const drawBackgroundTriangle = (context: CanvasRenderingContext2D) => {
    context.beginPath()
    context.moveTo(0, context.canvas.height)
    context.lineTo(context.canvas.width * 0.75, context.canvas.height)
    context.lineTo(context.canvas.width * 0.375, 0)
    context.closePath()
    context.fill()
    context.stroke()
  }

  const drawTriangle = (context: CanvasRenderingContext2D) => {
    context.beginPath()
    context.moveTo(context.canvas.width * 0.5, context.canvas.height)
    context.lineTo(context.canvas.width, context.canvas.height)
    context.lineTo(context.canvas.width * 0.75, context.canvas.height * 0.25)
    context.closePath()
    context.fill()
    context.stroke()
  }

  const drawForegroundTriangle = (context: CanvasRenderingContext2D) => {
    context.beginPath()
    context.moveTo(context.canvas.width * 0.25, context.canvas.height)
    context.lineTo(context.canvas.width * 0.75, context.canvas.height)
    context.lineTo(context.canvas.width * 0.5, context.canvas.height * 0.5)
    context.closePath()
    context.fill()
    context.stroke()
  }

  const { Canvas } = use2dAnimatedCanvas({
    globalFilter: [brownFill, redStroke],
    renderBackgroundFilter: opacity25,
    renderBackground: drawBackgroundTriangle,
    renderFilter: [blueFill, brownStroke, opacity50],
    render: drawTriangle,
    renderForegroundFilter: [blueFill],
    renderForeground: drawForegroundTriangle
  })

  const code = `
    export default function MultiFilter() {
      // since an array of filter functions can be used instead of a single filter function,
      //   the filter function can then focus on just updating a specific setting in the context
      // this makes the filters more modular and more straightforward

      const brownFill = (context) => {
        // set the fill style to brown
      }

      const blueFill: AnimatedCanvasRenderFilterFunction = (context) => {
        // set the fill style to blue
      }

      const redStroke: AnimatedCanvasRenderFilterFunction = (context) => {
        // set the stroke style to red
      }

      const brownStroke: AnimatedCanvasRenderFilterFunction = (context) => {
        // set the stroke style to brown
      }

      const opacity50: AnimatedCanvasRenderFilterFunction = (context) => {
        // set the opacity to 0.5
      }

      const opacity25: AnimatedCanvasRenderFilterFunction = (context) => {
        // set the opacity to 0.25
      }

      const drawBackgroundTriangle = (context: CanvasRenderingContext2D) => {
        // render a triangle in the background
      }

      const drawTriangle = (context: CanvasRenderingContext2D) => {
        // render a triangle
      }

      const drawForegroundTriangle = (context: CanvasRenderingContext2D) => {
        // render a triangle in the foreground
      }

      const { Canvas } = use2dAnimatedCanvas<Date>({
        // notice that an array of filter functions can be specified instead of a single one
        // the order in which they are specified in the array is the order in which they will be called
        // the idea here is to separate the usage of different context settings in the same layer
        //   this makes it easier to manage complex filtering requirements
        //   and also makes the filtering logic more modular and more straightforward
        // like single filter functions, the context is handled the same with an array of filter functions
        //   as this is like calling all these filter functions from one big filter function
        globalFilter: [brownFill, redStroke],

        // renderBackgroundFilter can also be an array of filter functions
        renderBackgroundFilter: opacity25,
        renderBackground: drawBackgroundTriangle,

        // global and layer-specific filter functions both can accept an array of filter function or a single one
        renderFilter: [blueFill, brownStroke, opacity50],
        render: drawTriangle,

        // this is essentially the same as
        //   "renderForegroundFilter: blueFill"
        renderForegroundFilter: [blueFill],
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
