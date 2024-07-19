'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import menu from './menu-item'

export default function Filters() {
  hljs.registerLanguage('typescript', typescript)

  const drawBackgroundTriangle = (context: CanvasRenderingContext2D) => {
    context.save()
    context.fillStyle = '#7B3F00'
    context.beginPath()
    context.moveTo(0, context.canvas.height)
    context.lineTo(context.canvas.width * 0.75, context.canvas.height)
    context.lineTo(context.canvas.width * 0.375, 0)
    context.fill()
    context.restore()
  }

  const drawTriangle = (context: CanvasRenderingContext2D) => {
    context.save()
    context.fillStyle = '#7B3F00'
    context.beginPath()
    context.moveTo(context.canvas.width * 0.5, context.canvas.height)
    context.lineTo(context.canvas.width, context.canvas.height)
    context.lineTo(context.canvas.width * 0.75, context.canvas.height * 0.25)
    context.fill()
    context.restore()
  }

  const drawForegroundTriangle = (context: CanvasRenderingContext2D) => {
    context.save()
    context.fillStyle = '#7B3F00'
    context.beginPath()
    context.moveTo(context.canvas.width * 0.25, context.canvas.height)
    context.lineTo(context.canvas.width * 0.75, context.canvas.height)
    context.lineTo(context.canvas.width * 0.5, context.canvas.height * 0.5)
    context.fill()
    context.restore()
  }

  const { Canvas } = use2dAnimatedCanvas({
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

  const highlighted = hljs.highlight(`
    export default function Filters() {
      const drawBackgroundTriangle = (context: CanvasRenderingContext2D) => {
        // draw a triangle in the background
        context.fillStyle = '#7B3F00'
      }

      const drawTriangle = (context: CanvasRenderingContext2D) => {
        // draw a triangle
        context.fillStyle = '#7B3F00'
      }

      const drawForegroundTriangle = (context: CanvasRenderingContext2D) => {
        // draw a triangle in the foreground
        context.fillStyle = '#7B3F00'
      }

      const { Canvas } = use2dAnimatedCanvas({
        renderBackgroundFilter: (context) => {
          // this function gets called before the renderBackground function
          // ideally, this function should be used to make global changes to the context
          //   which will persist when the renderBackground function is called
          // the context will be reset after the renderBackground function call
          context.globalAlpha = 0.25
        },
        renderBackground: drawBackgroundTriangle,
        renderFilter: (context) => {
          // this function gets called before the render function
          // ideally, this function should be used to make global changes to the context
          //   which will persist when the render function is called
          // the context will be reset after the render function call
          context.globalAlpha = 0.5
        },
        render: drawTriangle,
        renderForegroundFilter: (context) => {
          // this function gets called before the renderForeground function
          // ideally, this function should be used to make global changes to the context
          //   which will persist when the renderForeground function is called
          // the context will be reset after the renderForeground function call
          context.globalAlpha = 0.75
        },
        renderForeground: drawForegroundTriangle
      })

      return <Canvas />
    }
  `, { language: 'typescript' })


  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black' />
    </div>
    <h3 className='text-xl font-semibold'>Code</h3>
    <pre>
      <code dangerouslySetInnerHTML={{ __html: highlighted.value }}></code>
    </pre>
  </>)
}
