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
import { type PointerEventHandler } from 'react'

export default function ConditionalMultiTransform() {
  type PageData = {
    width: number,
    rotation: number,
    coordinates?: Coordinates,
    clicked: boolean
  }

  let current: Coordinates | undefined
  let clicked: boolean = false

  const setClicked: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.clicked = clicked

    return data
  }

  const setCoordinates: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined || current === undefined) { return data }

    data.data.coordinates = current

    return data
  }

  const isClicked: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    return data.data.clicked
  }

  const isWithinBounds: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.coordinates === undefined) { return false }

    const ul = { x: data.drawData.width / 2 - 30, y: data.drawData.height / 2 - 30 }
    const lr = { x: data.drawData.width / 2 + 30, y: data.drawData.height / 2 + 30 }
    const coordinates = data.data.coordinates

    return coordinates.x >= ul.x && coordinates.x <= lr.x && coordinates.y >= ul.y && coordinates.y <= lr.y
  }

  const rotate: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.rotation += 1

    return data
  }

  const increaseWidth: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.width += 1

    return data
  }

  const renderBackground: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillText('Click and hold', 5, 5)
    context.fillText('on the square', 5, 25)
  }

  const render: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    if (data?.data === undefined) { return }

    context.save()

    const { width } = data.data
    const newWidth = 30 + (20 * Math.sin(width*0.05)**2)
    context.translate(data.drawData.width / 2, data.drawData.height / 2)
    context.rotate(data.data.rotation * Math.PI / 180)
    context.fillStyle = data.drawData.isDarkMode ? '#E5E7EB' : '#000000'
    context.fillRect(-newWidth/2, -newWidth/2, newWidth, newWidth)

    context.restore()
  }

  const { Canvas } = use2dAnimatedCanvas({
    initialiseData: () => ({
      clicked: false,
      width: 0,
      rotation: 0
    }),
    preRenderTransform: [
      setCoordinates,
      setClicked,
      when([isClicked, isWithinBounds], [rotate, increaseWidth])
    ],
    renderBackground,
    render
  })

  const onPointerEnterHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
    current = undefined
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
    clicked = false
    current = undefined
  }

  const code = `
    export default function ConditionalMultiTransform() {
      type PageData = { width: number, rotation: number, coordinates: Coordinates, clicked: boolean }

      // will store the value for the current mouse position and clicked state
      let current: Coordinates | undefined
      let clicked: boolean

      const setClicked = (data) => {
        // set the data to the current clicked state
        return data
      }
      const setCoordinates = (data) => {
        // set the data to the current mouse position
        return data
      }

      const isClicked = (data) => {
        // return true if clicked is true in the data
      }
      const isWithinBounds = (data) => {
        // return true if the coordinates value in the data is within the square
      }

      const rotate = (data) => {
        // increase rotation in the data
        return data
      }
      const increaseWidth = (data) => {
        // increase the width in the data
        return data
      }

      const renderBackground = (context, data) => {
        // render instructions
      }
      const render = (context, data) => {
        // render square with a width and rotation as specified in the data
      }

      const { Canvas } = use2dAnimatedCanvas<Date>({
        initialiseData: () => {
          // set the initial data
        },

        // notice that an array of data transformation functions can be specified
        //   on the when function instead of a single one
        // transformation functions are evaluated in the order that they appear in the array
        // these transformations function will only be called
        //   if the condition function returns true
        // the idea of multiple transformation functions in the when function
        //   is to further separate the actual transformation operation
        //   this makes it easier to manage the transformation of complex objects
        preRenderTransform: [
          setCoordinates,
          setClicked,
          when([isClicked, isWithinBounds], [rotate, increaseWidth])
        ],

        renderBackground,
        render,

        // postRenderTransform also supports when functions
        //   with multiple data transformation functions
      })

      const onPointerEnterHandler = (event) => {
        // reset current values
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
