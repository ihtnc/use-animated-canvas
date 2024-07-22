'use client'

import { type AnimatedCanvasRenderFunction, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function Transform() {
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

  const code = `
    export default function Transform() {
      const render: AnimatedCanvasRenderFunction<number> = (context, data) => {
        // render a circle in the center of the canvas
        // the circle has the radius of data
        // since there are separate functions to update the data,
        //   the render function can then focus on just rendering the data
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
          // the data returned here will be the new value moving forward
          return data
        },
        render,
        postRenderTransform: (data) => {
          // this function gets called every frame
          //   and is called after all rendering functions
          // ideally, this function should be used to clean up the data
          //   in preparation for the next frame

          // reset the data (radius) to 0 if it will exceed the bounds of the canvas
          // the data returned here will be the new value moving forward
          return data
        }
      })

      return <Canvas />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black' />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
