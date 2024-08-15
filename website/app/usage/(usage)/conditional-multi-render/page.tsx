'use client'

import {
  type AnimatedCanvasConditionalFunction,
  type AnimatedCanvasRenderFunction,
  not,
  renderWhen,
  use2dAnimatedCanvas
} from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { type PointerEventHandler } from 'react'

const getDate = (date?: Date) => {
  const month = date?.getMonth() ?? -1
  const day = date?.getDate() ?? -1
  switch (month) {
    case 0: return `${day} January`
    case 1: return `${day} February`
    case 2: return `${day} March`
    case 3: return `${day} April`
    case 4: return `${day} May`
    case 5: return `${day} June`
    case 6: return `${day} July`
    case 7: return `${day} August`
    case 8: return `${day} September`
    case 9: return `${day} October`
    case 10: return `${day} November`
    case 11: return `${day} December`
    default: return 'Date'
  }
}

export default function ConditionalMultiRender() {
  type PageData = {
    isClicked: boolean,
    date: Date
  }
  let clicked: boolean

  const isClicked: AnimatedCanvasConditionalFunction<PageData> = (data) => data?.data?.isClicked ?? false

  const renderBackground: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillText('Click and hold', 5, 5)
  }

  const renderClockBase: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.save()
    context.beginPath()
    context.fillStyle = '#7B3F00'
    context.fillRect(context.canvas.width / 6, context.canvas.height / 6, context.canvas.width * 2 / 3, context.canvas.height * 2 / 3)
    context.restore()
  }

  const renderHourHand: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.save()
    context.beginPath()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    const hour = (data?.data?.date.getHours() ?? 0 % 12)
    const hourDegree = (360 / 12 * hour) - 90

    context.fillStyle = '#808080'
    context.rotate(hourDegree * Math.PI / 180)
    context.fillRect(-3, -3, context.canvas.width / 4, 6)
    context.restore()
  }

  const renderMinuteHand: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    if (data?.data === undefined) { return }

    context.save()
    context.beginPath()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    const minute = data?.data?.date.getMinutes() ?? 0
    const minuteDegree = (360 / 60 * minute) - 90

    context.fillStyle = data.drawData.isDarkMode ? '#E5E7EB' : '#000000'
    context.rotate(minuteDegree * Math.PI / 180)
    context.moveTo(-3, -3)
    context.lineTo(-3, 3)
    context.lineTo(context.canvas.width * 3 / 7, 0)
    context.fill()
    context.restore()
  }

  const renderSecondHand: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.save()
    context.beginPath()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    const second = data?.data?.date.getSeconds() ?? 0
    const secondDegree = (360 / 60 * second) - 90

    context.fillStyle = '#FFBF00'
    context.rotate(secondDegree * Math.PI / 180)
    context.moveTo(-1, -1)
    context.lineTo(-1, 1)
    context.lineTo(context.canvas.width * 3 / 7, 0)
    context.fill()
    context.restore()
  }

  const renderDigitalClock: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.save()
    const time = data?.data?.date.toLocaleTimeString() ?? 'Time'
    context.fillStyle = '#FFBF00'
    context.font = '16px Arial'
    context.textAlign = 'center'
    context.fillText(time, context.canvas.width / 2, context.canvas.height / 2)
    context.restore()
  }

  const renderDate: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.save()
    const day = getDate(data?.data?.date)

    context.fillStyle = '#FFBF00'
    context.font = '16px Arial'
    context.textAlign = 'center'
    context.fillText(day, context.canvas.width / 2, context.canvas.height * 0.75)
    context.restore()
  }

  const { Canvas } = use2dAnimatedCanvas<PageData>({
    preRenderTransform: (data) => {
      data.data = {
        date: new Date(),
        isClicked: clicked
      }

      return data
    },
    renderBackground,
    render: [
      renderClockBase,
      renderWhen(not(isClicked), [renderDigitalClock]),
      renderWhen(isClicked, [renderHourHand, renderMinuteHand, renderSecondHand])
    ],
    renderForeground: renderWhen(isClicked, renderDate)
  })

  const onPointerEnterHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
  }

  const onPointerDownHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = true
  }

  const onPointerUpHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
  }

  const onPointerOutHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
  }

  const code = `
    export default function ConditionalMultiRender() {
      type PageData = { isClicked: boolean, date: Date }

      // will store the value for the current mouse position and click status
      let clicked: boolean

      const isClicked = (data) => data?.data?.isClicked ?? false

      const renderBackground = (context, data) => {
        // render instructions
      }
      const renderClockBase = (context, data) => {
        // render the base of the clock
      }
      const renderHourHand = (context, data) => {
        // render the hour hand of the clock
      }
      const renderMinuteHand = (context, data) => {
        // render the minute hand of the clock
      }
      const renderSecondHand = (context, data) => {
        // render the second hand of the clock
      }
      const renderDigitalClock = (context, data) => {
        // render the time in digital format
      }
      const renderDate = (context, data) => {
        // render the date
      }

      const { Canvas } = use2dAnimatedCanvas<Date>({
        preRenderTransform: (data) => {
          // set the data to the current date, and clicked values
          return data
        },

        // renderBackground also supports renderWhen functions with multiple render functions
        renderBackground,

        // notice that an array of render functions can be specified
        //   on the renderWhen function instead of a single one
        // render functions functions are called in the order that they appear in the array
        // these render functions will only be called if the condition function returns true
        // the idea of multiple render functions in the renderWhen function
        //   is to further separate the actual rendering operation
        //   this makes it easier to manage rendering complex objects
        render: [
          renderClockBase,

          // renderWhen functions can accept a single condition function
          //   or an array of condition functions
          //   as well as a single render function or an array of render functions
          // the not function can be used to negate
          //   the result of a condition function when called
          renderWhen([not(isClicked)], [renderDigitalClock]),

          renderWhen(isClicked, [renderHourHand, renderMinuteHand, renderSecondHand])
        ],

        renderForeground: renderWhen(isClicked, [renderDate])
      })

      const onPointerEnterHandler = (event) => {
        // set clicked to false
      }
      const onPointerDownHandler = (event) => {
        // set clicked to true
      }
      const onPointerUpHandler = (event) => {
        // set clicked to false
      }
      const onPointerOutHandler = (event) => {
        // set clicked to false
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
      <Canvas
        className='w-full h-full border border-black dark:border-gray-300'
        onPointerEnter={onPointerEnterHandler}
        onPointerDown={onPointerDownHandler}
        onPointerUp={onPointerUpHandler}
        onPointerOut={onPointerOutHandler}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
