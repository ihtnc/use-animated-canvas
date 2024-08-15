'use client'

import { type AnimatedCanvasRenderFunction, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function BasicEvents() {
  let color: string

  const initialiseData = () => '#808080'

  const renderBackground: AnimatedCanvasRenderFunction<string> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillText('Put component', 5, 5)
    context.fillText('in/out of focus', 5, 25)
  }

  const render: AnimatedCanvasRenderFunction<string> = (context, data) => {
    const current = data?.data ?? ''
    if (current.trim().length === 0) { return }

    const frame = data?.drawData?.frame ?? 0
    context.fillStyle = current
    context.beginPath()
    context.arc(context.canvas.width / 2, context.canvas.height / 2, 20*Math.sin(frame*0.05)**2, 0, 2*Math.PI)
    context.fill()
  }

  const { Canvas } = use2dAnimatedCanvas<string>({
    initialiseData,
    preRenderTransform: (data) => {
      data.data = color
      return data
    },
    renderBackground,
    render
  })

  const onFocusHandler = (event: FocusEvent) => {
    color = '#7B3F00'
  }

  const onBlurHandler = (event: FocusEvent) => {
    color = '#808080'
  }

  const code = `
    export default function BasicEvents() {
      // will store the current color
      let color: string

      const initialiseData = () => '#808080'

      const renderBackground = (context, data) => {
        // render instructions in the top left corner
      }
      const render = (context, data) => {
        // render a circle that grows/shrinks a little bit every frame
        //   with a fill color as specified in the data
      }

      const { Canvas } = use2dAnimatedCanvas<string>({
        initialiseData,
        preRenderTransform: (data) => {
          // update the data with the current color value
          return data
        },
        renderBackground,
        render
      })

      // the idea here is to let the render functions
      //   focus on rendering objects on the canvas based on a set of data
      // external factors (like focus events), can then update the data
      // these changes on the data are fed back to the render functions
      //   via the transform functions
      // this makes the responsibilities of both the render functions
      //   and the event handlers more defined and straightforward
      const onFocusHandler = (event) => {
        // set the color to brown
        color = '#7B3F00'
      }
      const onBlurHandler = (event) => {
        // set the color to gray
        color = '#808080'
      }

      return <Canvas
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
      />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas
        className='w-full h-full border border-black dark:border-gray-300'
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
