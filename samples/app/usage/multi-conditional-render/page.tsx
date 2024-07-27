'use client'

import {
  type AnimatedCanvasConditionalRenderFunction,
  type AnimatedCanvasRenderFunction,
  renderWhen,
  use2dAnimatedCanvas
} from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { useDarkMode } from 'usehooks-ts'
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

export default function MultiConditionalRender() {
  const { isDarkMode } = useDarkMode()

  type PageData = {
    isClicked: boolean,
    isWithinBounds: boolean,
    date: Date
  }
  let clicked: boolean
  let withinBounds: boolean
  let buttonWidth = 20

  const isClicked: AnimatedCanvasConditionalRenderFunction<PageData> = (data) => data?.data?.isClicked ?? false
  const isWithinBounds: AnimatedCanvasConditionalRenderFunction<PageData> = (data) => data?.data?.isWithinBounds ?? false

  const renderBackground: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillRect(0, 0, buttonWidth, buttonWidth)
    context.fillText('Click and hold', buttonWidth + 5, 5)
    context.fillText('the gray box', buttonWidth + 5, context.canvas.height - 20)
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

    context.fillStyle = isDarkMode ? '#E5E7EB' : '#000000'
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
        isClicked: clicked,
        isWithinBounds: withinBounds
      }

      return data
    },
    renderBackground,
    render: [
      renderClockBase,
      renderHourHand,
      renderMinuteHand,
      renderWhen([isClicked, isWithinBounds], renderSecondHand)
    ],
    renderForeground: [renderWhen([isClicked, isWithinBounds], renderDate)]
  })

  const onPointerEnterHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
  }

  const onPointerMoveHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    withinBounds = x >= 0 && x <= buttonWidth && y >= 0 && y <= buttonWidth
  }

  const onPointerDownHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = true
  }

  const onPointerUpHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
  }

  const onPointerOutHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
    withinBounds = false
  }

  const code = `
    export default function MultiConditionalRender() {
      type PageData = { isClicked: boolean, isWithinBounds: boolean, date: Date }

      // will store the value for the current mouse position and click status
      let clicked: boolean
      let withinBounds: boolean

      const isClicked = (data) => data?.data?.isClicked ?? false
      const isWithinBounds = (data) => data?.data?.isWithinBounds ?? false

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
      const renderDate = (context, data) => {
        // render the date
      }

      const { Canvas } = use2dAnimatedCanvas<Date>({
        preRenderTransform: (data) => {
          // set the data to the current date, clicked, and withinBounds values
          return data
        },

        // renderBackground also supports renderWhen functions with multiple conditions
        renderBackground,

        // notice that an array of condition functions can be specified
        //   on the renderWhen function instead of a single one
        // condition functions are evaluated in the order that they appear in the array
        // the associated render function will only be called if all condition functions return true
        // the idea of multiple conditions in the renderWhen function is to further separate the rendering logic
        //   this makes it easier to manage complex rules
        render: [
          renderClockBase,
          renderHourHand,
          renderMinuteHand,
          renderWhen([isClicked, isWithinBounds], renderSecondHand)
        ],

        // this is essentially the same as
        //   renderForeground: renderWhen([isClicked, isWithinBounds], renderDate)
        renderForeground: [
          renderWhen([isClicked, isWithinBounds], renderDate)
        ]
      })

      const onPointerEnterHandler = (event) => {
        // set clicked to false
      }
      const onPointerMoveHandler = (event) => {
        // get the x and y values based on the translated pointer coordinates
        //   since the canvas coordinates are relative to the viewport
        // set withinBounds to true if the pointer is within the bounds of the gray box
      }
      const onPointerDownHandler = (event) => {
        // set clicked to true
      }
      const onPointerUpHandler = (event) => {
        // set clicked to false
      }
      const onPointerOutHandler = (event) => {
        // set clicked and withinBounds to false
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
