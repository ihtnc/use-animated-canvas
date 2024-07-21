'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import menu from './menu-item'

export default function Layers() {
  hljs.registerLanguage('typescript', typescript)

  const { Canvas } = use2dAnimatedCanvas({
    renderBackground: (context, data) => {
      context.save()
      context.strokeStyle = '#FF0000'
      for(let i = 10; i < context.canvas.height; i += 25) {
        context.beginPath()
        context.moveTo(0, i)
        context.lineTo(context.canvas.width, i)
        context.stroke()
      }
      context.restore()
    },
    render: (context, data) => {
      context.save()
      const frame = data?.drawData?.frame ?? 0
      context.fillStyle = '#808080'
      context.beginPath()
      context.arc(50, 50, 20*Math.sin(frame*0.05)**2, 0, 2*Math.PI)
      context.fill()
      context.restore()
    },
    renderForeground: (context, data) => {
      context.save()
      context.fillStyle = '#0000FF'
      context.font = '20px Arial'
      context.textAlign = 'center'
      context.fillText('Foreground', context.canvas.width / 2, context.canvas.height / 2)
      context.restore()
    }
  })

  const highlighted = hljs.highlight(`
    export default function Layers() {
      const { Canvas } = use2dAnimatedCanvas({
        renderBackground: (context, data) => {
          // this function gets called every frame
          //   and is called before the render function
          // draw lines in the background
        },
        render: (context, data) => {
          // this function gets called every frame
          //   and is called after the renderBackground function
          //   but before the renderForeground function
          // draw a circle that grows/shrinks a little bit every frame
        },
        renderForeground: (context, data) => {
          // this function gets called every frame
          //   and is called after the render function
          // draw text in the foreground
        }
      })

      return <Canvas />
    }
  `, { language: 'typescript' })


  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black' />
    </div>
    <h3 className='text-xl font-semibold'>Code</h3>
    <pre>
      <code dangerouslySetInnerHTML={{ __html: highlighted.value }}></code>
    </pre>
  </>)
}
