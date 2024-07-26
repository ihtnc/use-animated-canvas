'use client'

import { type AnimatedCanvasRenderFunction, renderWhen, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { useDarkMode } from 'usehooks-ts'

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

export default function ConditionalRender() {
  const { isDarkMode } = useDarkMode()

  const renderBackground: AnimatedCanvasRenderFunction<Date> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillText('Wait for 5 secs', 5, 5)
  }

  const renderClockBase: AnimatedCanvasRenderFunction<Date> = (context, data) => {
    context.save()
    context.beginPath()
    context.fillStyle = '#7B3F00'
    context.fillRect(context.canvas.width / 6, context.canvas.height / 6, context.canvas.width * 2 / 3, context.canvas.height * 2 / 3)
    context.restore()
  }

  const renderHourHand:  AnimatedCanvasRenderFunction<Date> = (context, data) => {
    context.save()
    context.beginPath()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    const hour = (data?.data?.getHours() ?? 0 % 12)
    const hourDegree = (360 / 12 * hour) - 90

    context.fillStyle = '#808080'
    context.rotate(hourDegree * Math.PI / 180)
    context.fillRect(-3, -3, context.canvas.width / 4, 6)
    context.restore()
  }

  const renderMinuteHand:  AnimatedCanvasRenderFunction<Date> = (context, data) => {
    context.save()
    context.beginPath()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    const minute = data?.data?.getMinutes() ?? 0
    const minuteDegree = (360 / 60 * minute) - 90

    context.fillStyle = isDarkMode ? '#E5E7EB' : '#000000'
    context.rotate(minuteDegree * Math.PI / 180)
    context.moveTo(-3, -3)
    context.lineTo(-3, 3)
    context.lineTo(context.canvas.width * 3 / 7, 0)
    context.fill()
    context.restore()
  }

  const renderSecondHand:  AnimatedCanvasRenderFunction<Date> = (context, data) => {
    context.save()
    context.beginPath()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    const second = data?.data?.getSeconds() ?? 0
    const secondDegree = (360 / 60 * second) - 90

    context.fillStyle = '#FFBF00'
    context.rotate(secondDegree * Math.PI / 180)
    context.moveTo(-1, -1)
    context.lineTo(-1, 1)
    context.lineTo(context.canvas.width * 3 / 7, 0)
    context.fill()
    context.restore()
  }

  const renderDate: AnimatedCanvasRenderFunction<Date> = (context, data) => {
    context.save()
    const day = getDate(data?.data)

    context.fillStyle = '#FFBF00'
    context.font = '16px Arial'
    context.textAlign = 'center'
    context.fillText(day, context.canvas.width / 2, context.canvas.height * 0.75)
    context.restore()
  }

  const check5SecondInterval: (date?: Date) => boolean = (date) => {
    return (date?.getSeconds() ?? 0) % 10 < 5
  }

  const { Canvas } = use2dAnimatedCanvas<Date>({
    preRenderTransform: (data) => {
      data.data = new Date()
      return data
    },
    renderBackground,
    render: [
      renderClockBase,
      renderHourHand,
      renderMinuteHand,
      renderWhen((data) => check5SecondInterval(data?.data), renderSecondHand)
    ],
    renderForeground: [renderWhen((data) => check5SecondInterval(data?.data), renderDate)]
  })

  const code = `
    export default function ConditionalRender() {
      const renderBackground: AnimatedCanvasRenderFunction<Date> = (context, data) => {
        // render instructions
      }

      const renderClockBase: AnimatedCanvasRenderFunction<Date> = (context, data) => {
        // render the base of the clock
      }

      const renderHourHand:  AnimatedCanvasRenderFunction<Date> = (context, data) => {
        // render the hour hand of the clock
      }

      const renderMinuteHand:  AnimatedCanvasRenderFunction<Date> = (context, data) => {
        // render the minute hand of the clock
      }

      const renderSecondHand:  AnimatedCanvasRenderFunction<Date> = (context, data) => {
        // render the second hand of the clock
      }

      const renderDate: AnimatedCanvasRenderFunction<Date> = (context, data) => {
        // render the date
      }

      const check5SecondInterval: (date?: Date) => boolean = (date) => {
        // check if 5 seconds has elapsed
      }

      const { Canvas } = use2dAnimatedCanvas<Date>({
        preRenderTransform: (data) => {
          // set the data to the current date
          return data
        },

        // renderBackground can also be an array of render or conditional render functions
        renderBackground,

        // notice that render functions or conditional render functions can be specified in the array
        // conditional render functions are nothing but functions
        //   that returns an object with a render function and a condition function
        // the render function in the object will only be called if the corresponding condition function returns true
        //   and similar to render functions, the condition function will also be passed the same data
        // the idea of the conditional render function is to separate the rendering logic from the actual rendering code
        //   this makes it easier to manage the rendering of objects with specific rules
        // the library exposes the renderWhen conditional render function
        //   which accepts the condition function and the actual render function
        //   to help facilitate the creation of the object
        render: [
          renderClockBase,
          renderHourHand,
          renderMinuteHand,
          renderWhen((data) => check5SecondInterval(data?.data), renderSecondHand)
        ],

        // this is essentially the same as
        //   "renderForeground: renderWhen((data) => check5SecondInterval(data?.data), renderDate)"
        renderForeground: [renderWhen((data) => check5SecondInterval(data?.data), renderDate)]

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
