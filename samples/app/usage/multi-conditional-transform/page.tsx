'use client'

import {
  type AnimatedCanvasConditionalFunction,
  type AnimatedCanvasRenderFunction,
  type AnimatedCanvasTransformFunction,
  type Coordinates,
  use2dAnimatedCanvas,
  when,
  whenNot
} from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { type PointerEventHandler } from 'react'

export default function MultiConditionalTransform() {
  type PageData = {
    radius: number,
    coordinates: Coordinates,
    clicked: boolean
  }

  let current: Coordinates | undefined
  let clicked: boolean = false

  const setCurrentValues: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined || current === undefined) { return data }

    data.data.coordinates = current
    data.data.clicked = clicked

    return data
  }
  const increaseRadius: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    const newRadius = data.data.radius + 1/3
    data.data.radius = Math.min(newRadius, 40)

    return data
  }
  const decreaseRadius: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    const newRadius = data.data.radius - 1/3

    data.data.radius = Math.max(newRadius, 10)

    return data
  }

  const isClicked: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    return data.data.clicked
  }

  const isWithinBounds: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    const center = { x: data.drawData.width / 2, y: data.drawData.height / 2 }
    const coordinates = data.data.coordinates
    const radius = 30

    const distance = Math.sqrt((coordinates.x - center.x)**2 + (coordinates.y - center.y)**2)
    return distance < radius
  }

  const renderBackground: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillText('Click and hold', 5, 5)
    context.fillText('on the circle', 5, 25)
  }

  const render: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    const radius = data?.data?.radius ?? 20
    context.fillStyle = data.drawData.isDarkMode ? '#E5E7EB' : '#000000'
    context.beginPath()
    context.arc(context.canvas.width / 2, context.canvas.height / 2, radius, 0, 2*Math.PI)
    context.fill()
  }

  const { Canvas } = use2dAnimatedCanvas({
    initialiseData: () => ({
      radius: 10,
      coordinates: { x: 0, y: 0 },
      clicked: false
    }),
    preRenderTransform: [
      setCurrentValues,
      whenNot([isClicked], decreaseRadius),
      when([isWithinBounds, isClicked], increaseRadius)
    ],
    renderBackground,
    render
  })

  const onPointerEnterHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    current = undefined
    clicked = false
  }

  const onPointerMoveHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    current = { x, y }
  }

  const onPointerDownHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = true
  }

  const onPointerUpHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
  }

  const onPointerOutHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    current = undefined
    clicked = false
  }

  const code = `
    export default function MultiConditionalTransform() {
      type PageData = { radius: number, coordinates: Coordinates, clicked: boolean }

      // will store the value for the current mouse position
      let current: Coordinates | undefined
      let clicked: boolean

      const setCurrentValues = (data) => {
        // set the data to the current mouse position and clicked state
        return data
      }
      const increaseRadius = (data) => {
        // increase radius in the data
        return data
      }
      const decreaseRadius = (data) => {
        // decrease the radius in the data
        return data
      }

      const isClicked = (data) => {
        // return true if clicked is true in the data
      }
      const isWithinBounds = (data) => {
        // return true if the current value in the data is within the circle
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

        // notice that an array of condition functions can be specified
        //   on the when function instead of a single one
        // condition functions are evaluated in the order that they appear in the array
        // the associated data transformation function will only be called
        //   if all condition functions return true
        // the idea of multiple conditions in the when function
        //   is to further separate the transformation logic
        //   this makes it easier to manage complex rules
        preRenderTransform: [
          setCurrentValues,

          // whenNot is another conditional function exposed by the library
          //   it is meant for calling data transformation functions
          //   when no conditions are met
          // like the when function, it can also accept an array of condition functions
          whenNot(isClicked, decreaseRadius),

          when([isWithinBounds, isClicked], increaseRadius)
        ],

        renderBackground,
        render,

        // postRenderTransform also supports when functions with multiple conditions
      })

      const onPointerEnterHandler = (event) => {
        // reset current value
      }
      const onPointerMoveHandler = (event) => {
        // get the x and y values based on the translated pointer coordinates
        //   since the canvas coordinates are relative to the viewport
        // set current to the x and y values
      }
      const onPointerDownHandler = (event) => {
        // set clicked to true
      }
      const onPointerUpHandler = (event) => {
        // set clicked to false
      }
      const onPointerOutHandler = (event) => {
        // reset current values
      }

      return <Canvas
        onPointerEnter={onPointerEnterHandler}
        onPointerMove={onPointerMoveHandler}
        onPointerDown={onPointerDownHandler}
        onPointerUp={onPointerUpHandler}
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
        onPointerDown={onPointerDownHandler}
        onPointerUp={onPointerUpHandler}
        onPointerOut={onPointerOutHandler}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
