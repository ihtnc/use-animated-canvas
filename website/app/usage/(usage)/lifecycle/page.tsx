'use client'

import { type CanvasResizeHandler, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { useRef, useState } from 'react'

export default function LifeCycle() {
  type PageData = {
    handlerId: number,
    currentFrame: number
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setRenderTime] = useState<Date>()
  const historyRef = useRef<HTMLDivElement>(null)

  const counter = useRef<PageData>({
    handlerId: 0,
    currentFrame: 0
  })

  const pushHandler = (handler: string) => {
    if (historyRef.current === null) { return }

    const div = historyRef.current
    let child: Element | null = null
    if (div.children.length >= 90) {
      child = div.lastElementChild!
      child.remove()
    }

    const { currentFrame, handlerId } = counter.current
    const id = `[${handlerId}]`
    const span = child ?? div.ownerDocument.createElement('span')
    span.textContent = `${id}: ${handler}`
    span.className = `${currentFrame % 2 === 1 ? 'bg-gray-300 dark:bg-neutral-800' : 'bg-gray-200 dark:bg-neutral-700'} pl-1 text-nowrap`

    div.insertAdjacentElement('afterbegin', span)
    counter.current.handlerId++
  }

  const { Canvas, debug } = use2dAnimatedCanvas({
    initialiseData: () => {
      pushHandler('initialise')
      return undefined
    },
    preRenderTransform: (data) => {
      pushHandler('pre-transform')
      return data
    },
    globalFilter: () => {
      pushHandler('global-filter')
    },
    renderBackgroundFilter: () => {
      pushHandler('background-filter')
    },
    renderBackground: (context, data) => {
      pushHandler('background-render')

      let y = 5
      context.fillStyle = '#808080'
      context.textAlign = 'center'
      context.textBaseline = 'top'
      context.font = '15px Arial'
      context.fillText(`click me too`, data.drawData.width / 2, y)
    },
    renderFilter: () => {
      pushHandler('main-filter')
    },
    render: (context, data) => {
      pushHandler('main-render')

      const frame = data?.drawData?.frame ?? 0
      context.fillStyle = data.drawData.isDarkMode ? '#E5E7EB' : '#000000'
      context.beginPath()
      context.arc(context.canvas.width / 2, context.canvas.height / 2, 20*Math.cos(frame*0.2)**2, 0, 2*Math.PI)
      context.fill()
    },
    renderForegroundFilter: () => {
      pushHandler('foreground-filter')
    },
    renderForeground: (context, data) => {
      pushHandler('foreground-render')
    },
    postRenderTransform: (data) => {
      pushHandler('post-transform')
      counter.current.currentFrame = data.drawData.frame + 1
      return data
    },
    options: {
      enableDebug: true,
      autoStart: false
    }
  })

  const code = `
    export default function LifeCycle() {
      // to display the execution sequence, rendering will be done per frame
      // we need to use the debug object to control the rendering
      const { Canvas, debug } = use2dAnimatedCanvas({
        initialiseData: () => {
          // notice that initialiseData is called only once even on rerenders
          //   and that it is called after onCanvasResize
          // this ensures the canvas has been fully resized before any succeeding renders

          // log "initialise"
        },
        preRenderTransform: (data) => {
          // log "pre-transform"
          return data
        },
        globalFilter: () => {
          // log "global-filter"
        },
        renderBackgroundFilter: () => {
          // log "background-filter"
        },
        renderBackground: (context, data) => {
          // log "background-render"
          // render instructions
        },
        renderFilter: () => {
          // log "main-filter"
        },
        render: (context, data) => {
          // log "main-render"
          // render a circle that grows/shrinks a little bit every frame
        },
        renderForegroundFilter: () => {
          // log "foreground-filter"
        },
        renderForeground: (context, data) => {
          // log "foreground-render"
        },
        postRenderTransform: (data) => {
          // log "post-transform"
          return data
        },
        options: {
          enableDebug: true,

          // this is set to false since rendering will be done per frame
          autoStart: false
        }
      })

      // it may seem that the following event handlers are called before the next frame,
      //   but they can actually be called in the middle of the rendering loop
      // ideally, these handlers should update a separate set of variables
      //   which would then be fed back to the internal data
      //   via the data transformation functions
      // this means the changes initiated by events will only reflect on the next frame
      // this ensures that the internal data is consistent when rendering a frame

      const onCanvasResizeHandler = (width, height) => {
        // notice that onCanvasResize is called after each rerender

        // log "resize"
      }

      const onClickHandler = () => {
        // log "click"
      }

      // render one frame to start logging
      debug.renderStep()

      return <Canvas
        onCanvasResize={onCanvasResizeHandler}
        onClick={onClickHandler}
      />
    }
  `

  const onCanvasResizeHandler: CanvasResizeHandler = (width, height) => {
    pushHandler('resize')
  }

  const onClickHandler = () => {
    pushHandler('click')
  }

  debug.renderStep()

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='ml-8 mb-2'>
      Choose one:&nbsp;
      <button
        className='hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 rounded-lg border border-transparent px-2 py-2 transition-colors'
        onClick={() => setRenderTime(new Date())}>
        Rerender
      </button>
      <button
        className='hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 rounded-lg border border-transparent px-2 py-2 transition-colors'
        onClick={() => { debug.renderStep() }}>
        Next Frame
      </button>
    </div>
    <div className='w-full h-full flex flex-row'>
      <div className='w-32 h-32 ml-8 mb-8'>
        <Canvas className='w-full h-full border border-black dark:border-gray-300'
          onCanvasResize={onCanvasResizeHandler}
          onClick={onClickHandler}
        />
      </div>
      <div ref={historyRef} className='w-52 h-32 ml-4 mb-8 border border-black dark:border-gray-300 overflow-y-scroll flex flex-col-reverse' />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
