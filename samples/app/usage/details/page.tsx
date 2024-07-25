'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function Details() {
  const { Canvas } = use2dAnimatedCanvas({
    renderBackground: (context) => {
      context.fillStyle = '#E5E7EB'
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    },
    render: (context, data) => {
      const frame = data?.drawData?.frame ?? 0
      context.fillStyle = '#7B3F00'
      context.beginPath()
      context.arc(context.canvas.width / 2, context.canvas.height / 2, 20*Math.sin(frame*0.05)**2, 0, 2*Math.PI)
      context.fill()
    },
    renderEnvironmentLayer: true
  })

  const code = `
    export default function Details() {
      const { Canvas } = use2dAnimatedCanvas({
        renderBackground: (context) => {
          // render a gray square that covers the whole canvas
        },
        render: (context, data) => {
          // render a circle that grows/shrinks a little bit every frame
        },

        // the internal environment details layer render function is called every frame
        //   after all other rendering functions
        //   including the grid layer render function
        renderEnvironmentLayer: true
        /*
        the following achieves the same result:
          renderEnvironmentLayer: true
          renderEnvironmentLayer: "#000000"
          renderEnvironmentLayer: RenderLocation.TopLeft
          renderEnvironmentLayer: { x: 10, y: 20 }
          renderEnvironmentLayer: {
            location: RenderLocation.TopLeft,
            color: "#000000",
            opacity: 1,
            renderFps: true,
            renderSize: true,
            renderClientSize: true,
            renderPixelRatio: true,
            renderFrameNumber: true
          }
        */
      })

      return <Canvas />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-96 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black dark:border-gray-300' />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
