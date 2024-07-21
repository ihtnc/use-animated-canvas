'use client'

import { type AnimatedCanvasRenderFunction, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import menu from './menu-item'

export default function Transform() {
  hljs.registerLanguage('typescript', typescript)

  const render: AnimatedCanvasRenderFunction<number> = (context, data) => {
    const radius = data?.data ?? 0
    context.fillStyle = '#000000'
    context.beginPath()
    context.arc(context.canvas.width / 2, context.canvas.height / 2, radius, 0, 2*Math.PI)
    context.fill()
  }

  const { Canvas } = use2dAnimatedCanvas({
    initialiseData: () => 0,
    preRenderTransform: (data) => {
      if (data.data !== undefined) {
        data.data += 1
      }
      return data
    },
    render,
    postRenderTransform: (data) => {
      if (data.data !== undefined) {
        const radius = data.data
        if (radius * 2 >= data.context.canvas.width || radius * 2 >= data.context.canvas.height) {
          data.data = 0
        }
      }
      return data
    }
  })

  const highlighted = hljs.highlight(`
    export default function Transform() {
      const render: AnimatedCanvasRenderFunction<number> = (context, data) => {
        // render a circle in the center of the canvas
        // the circle has the radius of data
      }

      const { Canvas } = use2dAnimatedCanvas({
        initialiseData: () => {
          // set the initial data to 0
          // this is similar to "use2dAnimatedCanvas({ ... }, 0)"
          // data will serve as the radius of the circle
          return 0
        },
        preRenderTransform: (data) => {
          // this function gets called every frame
          //   and is called before any rendering functions
          // ideally, this function should be used to update the data
          //   in preparation for the rendering functions

          // increase data (radius) by 1 every frame
          // the data returned here will be the new value for the data
          return data
        },
        render,
        postRenderTransform: (data) => {
          // this function gets called every frame
          //   and is called after all rendering functions
          // ideally, this function should be used to clean up the data
          //   in preparation for the next frame

          // reset the data (radius) to 0 if it will exceed the bounds of the canvas
          // the data returned here will be the new value for the data
          return data
        }
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
