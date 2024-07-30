'use client'

import {
  type AnimatedCanvasConditionalFunction,
  type AnimatedCanvasRenderFunction,
  type AnimatedCanvasTransformFunction,
  type CanvasResizeHandler,
  type Coordinates,
  use2dAnimatedCanvas,
  when,
  whenAny
} from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { type PointerEventHandler } from 'react'

export default function BouncyBall() {
  type PageData = {
    circle: {
      radius: number,
      coordinates?: Coordinates,
      colorIndex: number
    },
    blocks: Array<{
      coordinates: Coordinates,
      active: boolean
    }>,
    canvasState: {
      circleForwardX: boolean,
      circleForwardY: boolean,
      circleStepX?: number,
      circleStepY?: number,
      blockWidth: number,
      maxBlockCount: number
    },
    client: {
      clicked: boolean,
      coordinates?: Coordinates
    }
  }

  let circleCoordinates: Coordinates | undefined
  let pointerCoordinates: Coordinates | undefined
  let clicked: boolean = false

  const setInitialCircleCoordinates: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined || circleCoordinates === undefined || data.data?.circle.coordinates !== undefined) { return data }

    data.data.circle.coordinates = circleCoordinates
    return data
  }

  const setClientClicked: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.client.clicked = clicked

    return data
  }

  const setClientCoordinates: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined || pointerCoordinates === undefined) { return data }

    data.data.client.coordinates = pointerCoordinates

    return data
  }

  const setInitialCircleMovementStep: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.canvasState.circleStepX !== undefined || data.data.canvasState.circleStepY !== undefined) { return data }

    data.data.canvasState.circleStepX = Math.random() + 1
    data.data.canvasState.circleStepY = Math.random() + 1

    return data
  }

  const addBlockItem: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.client.coordinates === undefined) { return data }

    const { coordinates } = data.data.client
    const list = data.data.blocks
    if (list.some(block => block.coordinates.x === coordinates.x && block.coordinates.y === coordinates.y)) {
      return data
    }

    list.push({
      coordinates: data.data.client.coordinates,
      active: true
    })

    if (list.length > data.data.canvasState.maxBlockCount) {
      list.shift()
    }

    data.data.blocks = list

    return data
  }

  const reverseCircleMovementX: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.circleForwardX = !data.data.canvasState.circleForwardX

    return data
  }

  const reverseCircleMovementY: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.circleForwardY = !data.data.canvasState.circleForwardY

    return data
  }

  const setCircleColor: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.circle.colorIndex = (data.data.circle.colorIndex + 1) % 10

    return data
  }

  const getNextCircleCoordinates: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.circle.coordinates === undefined || data.data.canvasState.circleStepX === undefined || data.data.canvasState.circleStepY === undefined) { return data }

    const multiplierX = (data.data.canvasState.circleForwardX ? 1 : -1)
    const multiplierY = (data.data.canvasState.circleForwardY ? 1 : -1)

    data.data.circle.coordinates = {
      x: data.data.circle.coordinates.x + (data.data.canvasState.circleStepX * multiplierX),
      y: data.data.circle.coordinates.y + (data.data.canvasState.circleStepY * multiplierY)
    }

    return data
  }

  const resetClicked: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.client.clicked = false
    clicked = false

    return data
  }

  const deactivateTouchingBlocks: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.circle.coordinates === undefined) { return data }

    const { coordinates, radius } = data.data.circle
    const isWithinBounds = (block: { coordinates: Coordinates, active: boolean }) => {
      if (!block.active) { return false }

      const { x, y } = block.coordinates

      return (x >= coordinates.x - radius && x <= coordinates.x + radius) &&
        (y >= coordinates.y - radius && y <= coordinates.y + radius)
    }

    data.data.blocks.forEach(block => {
      if (isWithinBounds(block)) {
        block.active = false
      }
    })

    return data
  }

  const removeInactiveBlocks: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.blocks = data.data.blocks.filter(block => block.active)

    return data
  }

  const isCircleStill: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.circle.coordinates === undefined) { return false }

    const { circleStepX, circleStepY } = data.data.canvasState
    return circleStepX === undefined || circleStepY === undefined
  }

  const isTouchingTopEdge: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.circle.coordinates === undefined) { return false }
    const { coordinates, radius } = data.data.circle
    return coordinates.y - radius <= 0
  }

  const isTouchingBottomEdge: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.circle.coordinates === undefined) { return false }
    const { coordinates, radius } = data.data.circle
    return coordinates.y + radius >= data.drawData.height
  }

  const isTouchingLeftEdge: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.circle.coordinates === undefined) { return false }
    const { coordinates, radius } = data.data.circle
    return coordinates.x - radius <= 0
  }

  const isTouchingRightEdge: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.circle.coordinates === undefined) { return false }
    const { coordinates, radius } = data.data.circle
    return coordinates.x + radius >= data.drawData.width
  }

  const isTouchingABlock: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.circle.coordinates === undefined) { return false }

    const { coordinates, radius } = data.data.circle
    const isWithinBounds = (block: { coordinates: Coordinates, active: boolean }) => {
      if (!block.active) { return false }

      const { x, y } = block.coordinates

      return (x >= coordinates.x - radius && x <= coordinates.x + radius) &&
        (y >= coordinates.y - radius && y <= coordinates.y + radius)
    }

    return data.data.blocks.some(isWithinBounds)
  }

  const isClicked: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    return data.data.client.clicked
  }

  const isInsideCircle: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.circle.coordinates === undefined || data.data.client.coordinates === undefined) { return false }

    const center = { x: data.data.circle.coordinates.x, y: data.data.circle.coordinates.y }
    const coordinates = data.data.client.coordinates
    const radius = data.data.circle.radius

    const distance = Math.sqrt((coordinates.x - center.x)**2 + (coordinates.y - center.y)**2)
    return distance <= radius
  }

  const isOutsideCircle: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.circle.coordinates === undefined || data.data.client.coordinates === undefined) { return false }

    const center = { x: data.data.circle.coordinates.x, y: data.data.circle.coordinates.y }
    const coordinates = data.data.client.coordinates
    const radius = data.data.circle.radius

    const distance = Math.sqrt((coordinates.x - center.x)**2 + (coordinates.y - center.y)**2)
    return distance > radius
  }

  const renderInstructions: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillText('Click anywhere', 5, 5)
  }

  const renderCircle: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    if (data?.data === undefined || data.data.circle.coordinates === undefined) { return }

    const colors: Array<string> = [
      '#FFBF00', '#FF7A00', '#FF3C00', '#FF006E', '#C837AB',
      '#8378FF', '#00B4D8', '#00D8A8', '#5CDB5C', '#8B8B8B'
    ]

    const { radius, coordinates, colorIndex } = data.data.circle
    context.fillStyle = colors[colorIndex % colors.length]
    context.beginPath()
    context.arc(coordinates.x, coordinates.y, radius, 0, 2*Math.PI)
    context.fill()
  }

  const renderBlocks: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    if (data?.data === undefined) { return }

    const { blockWidth } = data.data.canvasState

    data.data.blocks.forEach(block => {
      if (block.active) {
        context.fillStyle = '#7B3F00'
        context.fillRect(block.coordinates.x - blockWidth, block.coordinates.y - blockWidth, blockWidth * 2, blockWidth * 2)
      }
    })
  }

  const { Canvas } = use2dAnimatedCanvas({
    initialiseData: () => ({
      circle: {
        radius: 20,
        colorIndex: 0
      },
      canvasState: {
        circleForwardX: true,
        circleForwardY: true,
        blockWidth: 5,
        maxBlockCount: 10
      },
      blocks: [],
      client: {
        clicked: false
      }
    }),
    preRenderTransform: [
      setInitialCircleCoordinates,
      setClientClicked,
      setClientCoordinates,
      when([
        isClicked,
        isCircleStill,
        isInsideCircle
      ], [
        setInitialCircleMovementStep
      ]),
      when([
        isClicked,
        isOutsideCircle
      ], [
        addBlockItem
      ]),
      whenAny([
        isTouchingTopEdge,
        isTouchingBottomEdge
      ], [
        reverseCircleMovementY,
        setCircleColor
      ]),
      whenAny([
        isTouchingLeftEdge,
        isTouchingRightEdge
      ], [
        reverseCircleMovementX,
        setCircleColor
      ]),
      whenAny([
        isTouchingABlock
      ], [
        reverseCircleMovementX,
        reverseCircleMovementY,
        setCircleColor
      ]),
      deactivateTouchingBlocks,
      getNextCircleCoordinates
    ],
    renderBackground: renderInstructions,
    render: [
      renderCircle,
      renderBlocks
    ],
    postRenderTransform: [
      resetClicked,
      removeInactiveBlocks
    ]
  })

  const onPointerEnterHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
    pointerCoordinates = undefined
  }

  const onPointerMoveHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    pointerCoordinates = { x, y }
  }

  const onPointerDownHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = true
  }

  const onPointerUpHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
  }

  const onPointerOutHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    clicked = false
    pointerCoordinates = undefined
  }

  const onCanvasResize: CanvasResizeHandler = (width, height) => {
    circleCoordinates = { x: width / 2, y: height / 2 }
  }

  const code = `
    // this function is used to render a ball
    //   that moves around the canvas and bounces off the edges
    // additional blocks can be added on the canvas that obstruct the ball's path
    //   and cause it to bounce off them as well
    // the blocks gets removed after the ball touches them
    export default function BouncyBall() {

      // the data is grouped into different sections
      //   this helps in organizing the data and making it easier to understand
      type PageData = {

        // the object used for rendering the circle in the canvas
        circle: {
          radius: number,
          coordinates?: Coordinates,
          colorIndex: number
        },

        // the object used for rendering the blocks in the canvas
        blocks: Array<{
          coordinates: Coordinates,
          active: boolean
        }>,

        // the object used to store various state of the canvas
        //   like the direction of the circle, the number of blocks that can be added, etc
        canvasState: {

           // indicates the direction of the circle
          circleForwardX: boolean,
          circleForwardY: boolean,

          // indicates the number of units the circle moves in the canvas
          circleStepX?: number,
          circleStepY?: number,

          // the size of the block and the number of blocks allowed to be added
          blockWidth: number,
          maxBlockCount: number
        },

        // the object used to store the changes made by the client
        client: {
          clicked: boolean,
          coordinates?: Coordinates
        }
      }

      // the following variables are used to store the changes made by the client
      // this is used to separate them from the data used by the canvas
      // the idea is that the various events (pointer events, etc) will update these variables
      //   then the data transformation functions will take these variables to update the internal data it then will use
      //   then the render functions will use these internal data to render objects in the canvas
      // this keeps the data flow more straightforward and easy to understand
      // basically this makes the rendering functions to just focus on the internal data,
      //   and the event handlers to just focus on the storing their values in a separate set of variables

      // this variable is used to store the center coordinates of the canvas
      //   to be used as the initial coordinates for the circle
      // since the canvas is set to fill the size of the parent container, the canvas will undergo a resize
      //   this variable will then be updated after the resize event
      let circleCoordinates: Coordinates | undefined

      // this variable will store the current pointer coordinates
      //   (updated by the pointer move event)
      let pointerCoordinates: Coordinates | undefined

      // this variable will store whether the pointer has been clicked on the canvas or not
      let clicked: boolean

      // the following functions are used to transfer the values from the client
      //   to the internal data used by the canvas
      // it's a good idea to separate these functions to keep them focused on a single task

      const setInitialCircleCoordinates = (data) => {
        // update the internal data with the current circleCoordinates value
      }
      const setClientClicked = (data) => {
        // update the internal data with the current clicked value
      }
      const setClientCoordinates = (data) => {
        // update the internal data with the current pointerCoordinates value
      }

      // the following functions are used to update the internal data
      //   that facilitates the interactivity

      const setInitialCircleMovementStep = (data) => {
        // set the initial movement step for the circle

        // this is intended to be called once to start the movement of the circle
        //   this function will return early if the circle is already moving
      }
      const addBlockItem = (data) => {
        // add an item to the blocks array in data
        // this function will ensure the number of blocks are not exceeded
      }
      const reverseCircleMovementX = (data) => {
        // reverse the direction of the circle in the x-axis
      }
      const reverseCircleMovementY = (data) => {
        // reverse the direction of the circle in the y-axis
      }
      const setCircleColor = (data) => {
        // set a new color index from for the circle
        // this function will ensure the index does not exceed the number of available colors
      }
      const getNextCircleCoordinates = (data) => {
        // get the next coordinates for the circle
        //   based on the current direction and step values

        // this is what gives the circle the appearance of moving
        // by updating the circle's coordinates based on the provided step values,
        //   the circle is on a different position on each frame
      }
      const resetClicked = (data) => {
        // reset the current clicked value to false

        // the idea here is that the clicked value will only be used for a single frame
        //   to ensure only one block is added per click
        //   since the mouse up event could run across multiple frames
      }
      const deactivateTouchingBlocks = (data) => {
        // deactivate blocks that are touching the circle

        // this function will iterate through all items in the blocks array
        //   and determine which of those are touching the circle
        //   then it will deactivate those blocks
      }
      const removeInactiveBlocks = (data) => {
        // remove inactive blocks from the data

        // this is intended as a cleanup function where in inactive blocks
        //   are removed from the blocks array so they won't be rendered on succeeding frames
      }

      // the following functions are used to check the various conditions
      //   to determine the behavior of the data transformation functions
      // it's a good idea to separate these functions to keep them focused on a single task
      // all of these functions will work on the internal data used by the canvas

      const isCircleStill = (data) => {
        // check if the circle is not moving (specifically if the step values are not yet set)

        // this function is making an assumption that the internal data
        //   will initially not have the step values set
      }
      const isTouchingTopEdge = (data) => {
        // check if the circle in its current coordinates is touching the top edge of the canvas
      }
      const isTouchingBottomEdge = (data) => {
        // check if the circle in its current coordinates is touching the bottom edge of the canvas
      }
      const isTouchingLeftEdge = (data) => {
        // check if the circle in its current coordinates is touching the left edge of the canvas
      }
      const isTouchingRightEdge = (data) => {
        // check if the circle in its current coordinates is touching the right edge of the canvas
      }
      const isTouchingABlock = (data) => {
        // check if the circle in its current coordinates is touching any of the blocks

        // this function will iterate through all items in the blocks array
        //   and checks if any of those are touching the circle in it's current coordinates
      }
      const isClicked = (data) => {
        // check if the canvas is clicked
      }
      const isOutsideCircle = (data) => {
        // check if the pointer coordinates are outside the circle
      }
      const isInsideCircle = (data) => {
        // check if the pointer coordinates are inside the circle
      }

      // the following functions are used to render objects on the canvas

      const renderInstructions = (context, data) => {
        // render instructions on the canvas
      }
      const renderCircle = (context, data) => {
        // render the circle on the canvas
        // it uses the internal data to render the circle in a certain coordinate,
        //   with a certain radius, and a certain color

        // notice that the render function is just focused on rendering the circle
        //   given the values on the internal data
        // the various data transformation functions are responsible for updating the internal data
      }
      const renderBlocks = (context, data) => {
        // render the blocks on the canvas

        // this function will iterate through all items in the blocks array
        //   and render those that are active
      }

      const { Canvas } = use2dAnimatedCanvas<Date>({
        initialiseData: () => {
          // set the initial values for the internal data
        },

        preRenderTransform: [
          // these functions are for transfering the values from the client to the internal data
          setInitialCircleCoordinates,
          setClientClicked,
          setClientCoordinates,

          // proper naming of the functions makes the code more readable and easier to understand

          // this section basically says we initiate the movement of the circle
          //   when the canvas is clicked, the circle is not moving yet, and the pointer is inside the circle
          when([
            isClicked,
            isCircleStill,
            isInsideCircle
          ], [
            setInitialCircleMovementStep
          ]),

          // this adds a block in the canvas
          when([
            isClicked,
            isOutsideCircle
          ], [
            addBlockItem
          ]),

          // this set of functions changes the direction of the circle when it hits something
          whenAny([
            isTouchingTopEdge,
            isTouchingBottomEdge
          ], [
            reverseCircleMovementY,
            setCircleColor
          ]),
          whenAny([
            isTouchingLeftEdge,
            isTouchingRightEdge
          ], [
            reverseCircleMovementX,
            setCircleColor
          ]),
          whenAny([
            isTouchingABlock
          ], [
            reverseCircleMovementX,
            reverseCircleMovementY,
            setCircleColor
          ]),

          // flags the blocks that are touching the circle as inactive
          deactivateTouchingBlocks,

          // get the next coordinates for the next frame
          getNextCircleCoordinates
        ],

        renderBackground: renderInstructions,
        render: [
          renderCircle,
          renderBlocks
        ],

        postRenderTransform: [
          // reset the clicked value in the client
          resetClicked,

          // remove any inactive blocks
          removeInactiveBlocks
        ]
      })

      const onPointerEnterHandler = (event) => {
        // reset current pointerCoordinates and clicked values
      }
      const onPointerMoveHandler = (event) => {
        // get the x and y values based on the translated pointer coordinates
        //   since the canvas coordinates are relative to the viewport
        // set pointerCoordinates to the x and y values
      }
      const onPointerDownHandler = (event) => {
        // set clicked value to true
      }
      const onPointerUpHandler = (event) => {
        // set clicked valued to false
      }
      const onPointerOutHandler = (event) => {
        // reset current pointerCoordinates and clicked values
      }
      const onCanvasResize = (width, height) => {
        // set the circleCoordinates value
      }

      return <Canvas
        onPointerEnter={onPointerEnterHandler}
        onPointerMove={onPointerMoveHandler}
        onPointerDown={onPointerDownHandler}
        onPointerUp={onPointerUpHandler}
        onPointerOut={onPointerOutHandler}
        onCanvasResize={onCanvasResize}
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
        onCanvasResize={onCanvasResize}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
