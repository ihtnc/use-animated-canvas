'use client'

import { type AnimatedCanvasRenderFunction, type AnimatedCanvasTransformFunction, type InitialiseDataHandler, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function KeepFrames() {
  type Data = { x: number, y: number, xOffset: number, yOffset: number, radius: number }

  const radius = 8

  const initialiseData: InitialiseDataHandler<Data> = (canvas) => {
    const x = Math.floor(canvas.width / 2)
    const y = Math.floor(canvas.height / 2)
    const xOffsetValue = Math.floor(Math.random() * 4 + 1)
    const yOffsetValue = Math.floor(Math.random() * 4 + 1)
    const xOffset = xOffsetValue * (Math.random() > 0.5 ? 1 : -1)
    const yOffset = yOffsetValue * (Math.random() > 0.5 ? 1 : -1)
    return { x, y, xOffset, yOffset, radius }
  }

  const preRenderTransform: AnimatedCanvasTransformFunction<Data> = (data) => {
    const newData = {
      x: data.data!.x,
      y: data.data!.y,
      xOffset: data.data!.xOffset,
      yOffset: data.data!.yOffset,
      radius: data.data!.radius
    }

    const xOffsetValue = Math.floor(Math.random() * 4 + 1)
    const yOffsetValue = Math.floor(Math.random() * 4 + 1)

    newData.x += newData.xOffset
    if (newData.x >= data.drawData.width) {
      newData.x = data.drawData.width
      newData.xOffset = xOffsetValue * -1
    }
    else if (newData.x <= 0) {
      newData.x = 0
      newData.xOffset = xOffsetValue
    }

    newData.y += newData.yOffset
    if (newData.y >= data.drawData.height) {
      newData.y = data.drawData.height
      newData.yOffset = yOffsetValue * -1
    }
    else if (newData.y <= 0) {
      newData.y = 0
      newData.yOffset = yOffsetValue
    }

    data.data = newData
    return data
  }

  const render: AnimatedCanvasRenderFunction<Data> = (context, data) => {
    const value = data?.data!
    context.fillStyle = data.drawData.isDarkMode ? '#E5E7EB' : '#000000'
    context.beginPath()
    context.arc(value.x, value.y, value.radius, 0, 2*Math.PI)
    context.fill()
  }

  const { Canvas } = use2dAnimatedCanvas<Data>({
    initialiseData,
    preRenderTransform,
    render,
    options: {
      clearEveryFrame: false
    }
  })

  const code = `
    export default function ClearEveryFrame() {
      // contains the current coordinates and their offsets
      type Data = { }

      const initialiseData = (canvas) => {
        // initialise coordinates in the middle of the canvas
        // initialise random offset values
      }

      const preRenderTransform = (data) => {
        // adjust both x and y coordinates by their offset values
        // if the new values exceed the canvas width or height,
        //   adjust the coordinates to be within bounds,
        //   randomise a new offset value,
        //   then reverse it (positive to negative and vice versa)
      }

      const render = (context, data) => {
        // draw a circle in the given coordinates
      }

      const { Canvas } = use2dAnimatedCanvas<Data>({
        initialiseData,
        preRenderTransform,
        render,
        options: {
          // when the value is false,
          //   the entire canvas won't be cleared every frame
          // each render will be drawn on top of the previous frames
          // in this example, if clearEveryFrame is set to true,
          //   the circle will appear to be moving around the canvas
          //   and not leaving any trails
          // clearEveryFrame is set to true by default
          clearEveryFrame: false
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
