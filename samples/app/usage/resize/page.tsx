'use client'

import { type AnimatedCanvasRenderFunction, type CanvasResizeHandler, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { useState } from 'react'

export default function Resize() {
  let radius = 0

  const renderBackground: AnimatedCanvasRenderFunction<number> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillText('Resize me', 5, 5)
  }

  const render: AnimatedCanvasRenderFunction<number> = (context, data) => {
    context.fillStyle = '#7B3F00'
    context.globalAlpha = 0.8
    context.beginPath()
    context.arc(context.canvas.width / 2, context.canvas.height / 2, radius, 0, 2*Math.PI)
    context.fill()
  }

  const { Canvas } = use2dAnimatedCanvas<number>({
    initialiseData: () => 0,
    preRenderTransform: (data) => {
      data.data = radius
      return data
    },
    renderBackground,
    render,
    options: {
      resizeDelayMs: 200
    }
  })

  const code = `
    export default function Resize() {
      // will store 1/3 the value of the current width of the canvas
      let radius = 0

      const renderBackground = (context, data) => {
        // render instructions in the top left corner
      }
      const render = (context, data) => {
        // render a circle in the center of the canvas
        //   with the radius as specified in the data
      }

      const { Canvas } = use2dAnimatedCanvas({
        initialiseData: () => 0,
        preRenderTransform: (data) => {
          // update the data with the current radius value
          return data
        },
        renderBackground,
        render,
        options: {
          // this is the default value
          // the canvas resize event is debounced with this delay
          //   as the event can fire numerous times in quick succession
          resizeDelayMs: 200
        }
      })

      // the idea here is to let the render functions
      //   focus on rendering objects on the canvas based on a set of data
      // external factors (like resize events), can then update the data
      // these changes on the data, are fed back to the render functions
      //   via the transform functions
      // this makes the responsibilities of both the render functions and the event handlers
      //   more defined and straightforward
      const onCanvasResizeHandler = (width, height) => {
        // set the radius to 1/3 the width of the canvas
      }

      return <Canvas
        onCanvasResize={onCanvasResizeHandler}
      />
    }
  `

  const [sizeClass, setSizeClass] = useState('size-32')
  const onCanvasResizeHandler: CanvasResizeHandler = (width, height) => {
    radius = Math.min(width, height) * 0.3
  }

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='ml-8 mb-2'>
      Choose one:&nbsp;
      <button
        className={`${sizeClass === 'size-32' ? 'font-semibold pointer-events-none dark:text-gray-500' : 'hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'} rounded-lg border border-transparent px-2 py-2 transition-colors`}
        onClick={() => { setSizeClass('size-32') }}>
        128x128
      </button>
      <button
        className={`${sizeClass === 'size-36' ? 'font-semibold pointer-events-none dark:text-gray-500' : 'hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'} rounded-lg border border-transparent px-2 py-2 transition-colors`}
        onClick={() => { setSizeClass('size-36') }}>
        144x144
      </button>
      <button
        className={`${sizeClass === 'size-40' ? 'font-semibold pointer-events-none dark:text-gray-500' : 'hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'} rounded-lg border border-transparent px-2 py-2 transition-colors`}
        onClick={() => { setSizeClass('size-40') }}>
        160x160
      </button>
    </div>
    <div className={`${sizeClass} ml-8 mb-8`}>
      <Canvas className='w-full h-full border border-black dark:border-gray-300'
        onCanvasResize={onCanvasResizeHandler}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
