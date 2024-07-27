'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { useDarkMode } from 'usehooks-ts'

export default function UtilityOrder() {
  const { isDarkMode } = useDarkMode()

  const { Canvas } = use2dAnimatedCanvas({
    renderForeground: (context) => {
      context.fillStyle = '#7B3F00'
      context.beginPath()
      context.moveTo(0, context.canvas.height)
      context.lineTo(context.canvas.width * 0.75, context.canvas.height)
      context.lineTo(context.canvas.width * 0.375, 0)
      context.fill()
    },
    renderGridLayer: (context) => {
      context.fillStyle = '#68CDFE'
      context.beginPath()
      context.moveTo(context.canvas.width * 0.5, context.canvas.height)
      context.lineTo(context.canvas.width, context.canvas.height)
      context.lineTo(context.canvas.width * 0.75, context.canvas.height * 0.25)
      context.fillRect(context.canvas.width * 0.3, context.canvas.height * 0.3, context.canvas.width * 0.7, context.canvas.height * 0.7)
    },
    renderEnvironmentLayer: (context) => {
      context.fillStyle = isDarkMode ? '#E5E7EB' : '#000000'
      context.beginPath()
      context.arc(context.canvas.width * 0.5, context.canvas.height * 0.75, context.canvas.width / 4, 0, 2*Math.PI)
      context.fill()
      context.fill()
    }
  })

  const code = `
    export default function UtilityOrder() {
      const { Canvas } = use2dAnimatedCanvas({
        renderForeground: (context) => {
          // render a triangle
        },
        renderGridLayer: (context) => {
          // render a square
          // notice that the grid layer is rendered after the renderForeground layer
        },
        renderEnvironmentLayer: (context) => {
          // render a circle
          // notice that the environment details layer is rendered after the grid layer
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
