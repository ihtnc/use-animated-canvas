'use client'

import {
  type AnimatedCanvasConditionalFunction,
  type AnimatedCanvasRenderFunction,
  type AnimatedCanvasTransformFunction,
  type Coordinates,
  use2dAnimatedCanvas,
  when
} from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { useDarkMode } from 'usehooks-ts'
import { type PointerEventHandler } from 'react'

export default function ConditionalTransform() {
  const { isDarkMode } = useDarkMode()

  type PageData = {
    radius: number,
    coordinates: Coordinates,
    frame: number
  }

  let current: Coordinates | undefined

  const setCurrentCoordinates: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined || current === undefined) { return data }

    data.data.coordinates = current

    return data
  }
  const setRadius: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    const frame = data.data.frame

    data.data.radius = 20*Math.cos(frame*0.05)**2

    return data
  }
  const setFrame: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    const frame = data.data.frame

    data.data.frame = frame + 1

    return data
  }

  const isWithinBounds: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    const center = { x: data.drawData.width / 2, y: data.drawData.height / 2 }
    const coordinates = data.data.coordinates
    const radius = 20

    const distance = Math.sqrt((coordinates.x - center.x)**2 + (coordinates.y - center.y)**2)
    return distance < radius
  }

  const renderBackground: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillText('Hover over', 5, 5)
    context.fillText('the circle', 5, 25)
  }

  const render: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    const radius = data?.data?.radius ?? 20
    context.fillStyle = isDarkMode ? '#E5E7EB' : '#000000'
    context.beginPath()
    context.arc(context.canvas.width / 2, context.canvas.height / 2, radius, 0, 2*Math.PI)
    context.fill()
  }

  const { Canvas } = use2dAnimatedCanvas({
    initialiseData: () => ({
      radius: 20,
      coordinates: { x: 0, y: 0 },
      frame: 0
    }),
    preRenderTransform: [
      setCurrentCoordinates,
      when(isWithinBounds, setRadius)
    ],
    renderBackground,
    render,
    postRenderTransform: when(isWithinBounds, setFrame)
  })

  const onPointerEnterHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    current = undefined
  }

  const onPointerMoveHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    current = { x, y }
  }

  const onPointerOutHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    current = undefined
  }

  const code = `
    export default function ConditionalTransform() {
      type PageData = { radius: number, coordinates: Coordinates, frame: number }

      // will store the value for the current mouse position
      let current: Coordinates | undefined

      const setCurrentCoordinates = (data) => {
        // set the data to the current value
        return data
      }
      const setRadius = (data) => {
        // increase radius in the data
        return data
      }
      const setFrame = (data) => {
        // since the circle grows/shrinks only when the pointer is within the circle
        //   a value that is separate to the canvas frame number is needed
        //   to track the progress of rendering the circle

        // increase the frame number value in the data
        return data
      }

      const isWithinBounds = (data) => {
        // return true if coordinates are within the circle area
      }

      const renderBackground = (context, data) => {
        // render instructions
      }
      const render = (context, data) => {
        // render circle with a radius as specified in the data
      }

      const { Canvas } = use2dAnimatedCanvas<Date>({
        initialiseData: () => {
          // set the initial data
        },

        // notice that data transformation functions
        //   or conditional data transformation functions can be used
        // conditional data transformation functions are nothing but functions
        //   that returns an object with a data transformation function and a condition function
        // the data transformation function in the object will only be called
        //   if the corresponding condition function returns true
        //   the condition function will be passed the same data
        //   used by data transformation functions
        // the idea of the conditional data transformation function
        //   is to apply logic when performing data transformations
        // this makes the data transformation more flexible
        // the library exposes the when conditional data transformation function
        //   which accepts the condition function and the actual data transformation function
        //   to help facilitate the creation of the object
        preRenderTransform: [
          setCurrentCoordinates,
          when(isWithinBounds, setRadius)
        ],

        renderBackground,
        render,

        //  postRenderTransform can also be an array of data transformation functions
        //   or conditional data transformation functions
        postRenderTransform: when(isWithinBounds, setFrame)

        // the library also exposes the following conditional functions
        // whenAny is for calling data transformation functions when the condition is met
        // whenNot is for calling data transformation functions when the conditions is not met
        // these functions are similar to the when function,
        //   as they are essentially the same function but with different evaluation logic
      })

      const onPointerEnterHandler = (event) => {
        // reset current value
      }
      const onPointerMoveHandler = (event) => {
        // get the x and y values based on the translated pointer coordinates
        //   since the canvas coordinates are relative to the viewport
        // set current to the x and y values
      }
      const onPointerOutHandler = (event) => {
        // reset current values
      }

      return <Canvas
        onPointerEnter={onPointerEnterHandler}
        onPointerMove={onPointerMoveHandler}
        onPointerOut={onPointerOutHandler}
      />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black dark:border-gray-300'
        onPointerEnter={onPointerEnterHandler}
        onPointerMove={onPointerMoveHandler}
        onPointerOut={onPointerOutHandler}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
