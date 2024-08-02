'use client'

import {
  type AnimatedCanvasConditionalFunction,
  type AnimatedCanvasRenderFunction,
  type AnimatedCanvasTransformFunction,
  type CanvasResizeHandler,
  type Coordinates,
  type AnimatedCanvasRenderFilterFunction,
  use2dAnimatedCanvas,
  when,
  not,
  filterWhen,
  renderWhen
} from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { type PointerEventHandler } from 'react'

export default function KeepyUppy() {

  type PageData = {
    ball: {
      radius: number,
      coordinates?: Coordinates
    },
    block: {
      width: number,
      height: number,
      coordinates?: Coordinates
    }
    canvasState: {
      ballForwardX: boolean,
      ballForwardY: boolean,
      ballStepX?: number,
      ballStepY?: number,

      score: number,
      balls: number,

      controlRadius: number,

      resetGame: boolean,
      newBall: boolean,
      sourceBounce: string,

      ballSpeed: number,
      blockSpeed: number
    },
    client: {
      command?: string,
      pointerCoordinates?: Coordinates,
      pointerClick: boolean
    }
  }

  let hasResized: boolean = false
  let command: string = ''
  let pointerCoordinates: Coordinates | undefined
  let pointerClick: boolean = false

  const waitForCanvasResize: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined || hasResized === false) { return data }

    data.data.canvasState.resetGame = true
    hasResized = false

    return data
  }

  const initialiseGame: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    if (data.data.block.coordinates === undefined) {
      data.data.block.coordinates = {
        x: data.drawData.width / 2,
        y: data.drawData.height - data.data.block.height / 2 - 10 - data.data.ball.radius * 2
      }
    }

    const { canvasState } = data.data
    canvasState.balls = 3
    canvasState.score = 0
    canvasState.resetGame = false
    canvasState.newBall = true

    return data
  }

  const setNewBall: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.block.coordinates === undefined || data.data.canvasState.newBall === false) { return data }

    data.data.ball.coordinates = {
      x: data.data.block.coordinates.x,
      y: data.data.block.coordinates.y - data.data.block.height / 2 - data.data.ball.radius
    }

    const { canvasState } = data.data
    canvasState.ballStepX = undefined
    canvasState.ballStepY = undefined
    canvasState.newBall = false
    canvasState.ballSpeed = 1
    canvasState.blockSpeed = 1
    canvasState.balls--
    canvasState.sourceBounce = 'block'

    return data
  }

  const setClientCommand: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.client.command = command

    return data
  }

  const setClientPointerValues: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.client.pointerCoordinates = pointerCoordinates
    data.data.client.pointerClick = pointerClick

    return data
  }

  const convertPointerValuesToCommand: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    if (not(isPointerClicked)(data)) { return data }

    if (isPointerOnLeftControl(data)) {
      data.data.client.command ='a'
    } else if (isPointerOnRightControl(data)) {
      data.data.client.command ='d'
    } else {
      data.data.client.command = 'enter'
    }

    return data
  }

  const executeCommand: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.block.coordinates === undefined) { return data }

    const { command } = data.data.client
    const { canvasState, ball } = data.data
    const { coordinates, height } = data.data.block

    const isNotMoving = isBallMoving(data) === false
    const isDone = isGameEnded(data)

    switch (command) {
      case 'a':
        canvasState.blockSpeed += 0.05
        const leftOffset = 5 * canvasState.blockSpeed
        coordinates.x = Math.max(coordinates.x - leftOffset, 0)

        if (isNotMoving) {
          ball.coordinates = { x: coordinates.x, y: coordinates.y - height / 2 - ball.radius }
        }
        break

      case 'd':
        canvasState.blockSpeed += 0.05
        const rightOffset = 5 * canvasState.blockSpeed
        coordinates.x = Math.min(coordinates.x + rightOffset, data.drawData.width)

        if (isNotMoving) {
          ball.coordinates = { x: coordinates.x, y: coordinates.y - height / 2 - ball.radius }
        }
        break

      case 'enter':
        if (isNotMoving) {
          canvasState.ballForwardY = false
          canvasState.ballForwardX = (Math.random() * 10) < 5
          canvasState.ballStepX = Math.random() + 1
          canvasState.ballStepY = Math.random() + 1

        } else if (isDone) {
          canvasState.resetGame = true
        }
        break

      default:
        canvasState.blockSpeed = 1
        break
    }

    return data
  }

  const setSourceBounceToTopEdge: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.sourceBounce = 'top'

    return data
  }

  const setSourceBounceToLeftEdge: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.sourceBounce = 'left'

    return data
  }

  const setSourceBounceToRightEdge: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.sourceBounce = 'right'

    return data
  }

  const setSourceBounceToBlock: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.sourceBounce = 'block'

    return data
  }

  const sendBallDown: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.ballForwardY = true

    return data
  }

  const sendBallUp: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.ballForwardY = false

    return data
  }

  const sendBallLeft: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.ballForwardX = false

    return data
  }

  const sendBallRight: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.ballForwardX = true

    return data
  }

  const getNextBallCoordinates: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.ball.coordinates === undefined) { return data }

    const multiplierX = (data.data.canvasState.ballForwardX ? 1 : -1) * data.data.canvasState.ballSpeed
    const multiplierY = (data.data.canvasState.ballForwardY ? 1 : -1) * data.data.canvasState.ballSpeed

    const { coordinates } = data.data.ball
    coordinates.x = coordinates.x + (data.data.canvasState.ballStepX! * multiplierX)
    coordinates.y = coordinates.y + (data.data.canvasState.ballStepY! * multiplierY)

    return data
  }

  const increaseSpeed: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.ballSpeed += 0.05

    return data
  }

  const requestNewBall: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.newBall = true

    return data
  }

  const increaseScore: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.score++

    return data
  }

  const isGameReset: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    return data.data.canvasState.resetGame
  }

  const isNewBall: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    return data.data.canvasState.newBall
  }

  const isBallMoving: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.ball.coordinates === undefined) { return false }

    const { ballStepX, ballStepY } = data.data.canvasState
    return ballStepX !== undefined && ballStepY !== undefined
  }

  const isBallTouchingTopEdge: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.ball.coordinates === undefined) { return false }
    const { coordinates, radius } = data.data.ball
    return coordinates.y - radius <= 0
  }

  const isBallTouchingBottomEdge: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.ball.coordinates === undefined) { return false }
    const { coordinates, radius } = data.data.ball
    return coordinates.y + radius >= data.drawData.height
  }

  const isBallTouchingLeftEdge: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.ball.coordinates === undefined) { return false }
    const { coordinates, radius } = data.data.ball
    return coordinates.x - radius <= 0
  }

  const isBallTouchingRightEdge: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.ball.coordinates === undefined) { return false }
    const { coordinates, radius } = data.data.ball
    return coordinates.x + radius >= data.drawData.width
  }

  const isBallTouchingBlockLeftSide: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.ball.coordinates === undefined || data.data.block.coordinates === undefined) { return false }

    const { coordinates, radius } = data.data.ball

    const { x, y } = data.data.block.coordinates

    const xIntersect = coordinates.x + radius >= x - data.data.block.width / 2 && coordinates.x - radius < x
    const yIntersect = coordinates.y + radius >= y - data.data.block.height / 2 && coordinates.y - radius <= y + data.data.block.height / 2

    return xIntersect && yIntersect
  }

  const isBallTouchingBlockRightSide: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.ball.coordinates === undefined || data.data.block.coordinates === undefined) { return false }

    const { coordinates, radius } = data.data.ball

    const { x, y } = data.data.block.coordinates

    const xIntersect = coordinates.x + radius >= x && coordinates.x - radius <= x + data.data.block.width / 2
    const yIntersect = coordinates.y + radius >= y - data.data.block.height / 2 && coordinates.y - radius <= y + data.data.block.height / 2

    return xIntersect && yIntersect
  }

  const isBallTouchingBlock: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    return isBallTouchingBlockLeftSide(data) || isBallTouchingBlockRightSide(data)
  }

  const isSourceBounceTopEdge: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    return data.data.canvasState.sourceBounce === 'top'
  }

  const isSourceBounceLeftEdge: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    return data.data.canvasState.sourceBounce === 'left'
  }

  const isSourceBounceRightEdge: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    return data.data.canvasState.sourceBounce === 'right'
  }

  const isSourceBounceBlock: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    return data.data.canvasState.sourceBounce === 'block'
  }

  const isPointerOnLeftControl: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.client.pointerCoordinates === undefined) { return false }

    const pointer = data.data.client.pointerCoordinates
    const { controlRadius } = data.data.canvasState
    const { height } = data.drawData
    const padding = 5
    const lineWidth = 5
    const x = padding + lineWidth + controlRadius
    const y = height - padding - lineWidth - controlRadius

    const distance = Math.sqrt((pointer.x - x)**2 + (pointer.y - y)**2)
    return distance < controlRadius
  }

  const isPointerOnRightControl: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined || data.data.client.pointerCoordinates === undefined) { return false }

    const pointer = data.data.client.pointerCoordinates
    const { controlRadius } = data.data.canvasState
    const { width, height } = data.drawData
    const padding = 5
    const lineWidth = 5
    const x = width - padding - lineWidth - controlRadius
    const y = height - padding - lineWidth - controlRadius

    const distance = Math.sqrt((pointer.x - x)**2 + (pointer.y - y)**2)
    return distance < controlRadius
  }

  const isPointerClicked: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    return data.data.client.pointerClick
  }

  const isGameEnded: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    return data.data.canvasState.balls < 0
  }

  const renderInstructions: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'bottom'
    context.textAlign = 'center'
    context.fillText('enter | click = start', data.drawData.width / 2, data.drawData.height - 25)
    context.fillText('a | d | buttons = move', data.drawData.width / 2, data.drawData.height - 5)
  }

  const renderLeftControl: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    if (data?.data === undefined) { return }

    const { controlRadius } = data.data.canvasState
    const { height } = data.drawData
    const padding = 5
    const lineWidth = 5
    context.save()
    context.beginPath()

    context.globalAlpha = isPointerOnLeftControl(data) ? 0.8 : 0.5
    context.lineWidth = lineWidth
    context.strokeStyle = '#FF7A00'

    const x = padding + lineWidth + controlRadius
    const y = height - padding - lineWidth - controlRadius
    context.beginPath()
    context.arc(x, y, controlRadius, 0, 2*Math.PI)
    context.stroke()

    context.font = "30px Arial"
    context.lineWidth = 2
    context.textAlign = "center"
    context.textBaseline = "middle"

    context.strokeText("<", x, y)

    context.restore()
  }

  const renderRightControl: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    if (data?.data === undefined) { return }

    const { controlRadius } = data.data.canvasState
    const { width, height } = data.drawData
    const padding = 5
    const lineWidth = 5
    context.save()
    context.beginPath()

    context.globalAlpha = isPointerOnRightControl(data) ? 0.8 : 0.5
    context.lineWidth = lineWidth
    context.strokeStyle = '#FF7A00'

    const x = width - padding - lineWidth - controlRadius
    const y = height - padding - lineWidth - controlRadius
    context.beginPath()
    context.arc(x, y, controlRadius, 0, 2*Math.PI)
    context.stroke()

    context.font = "30px Arial"
    context.lineWidth = 2
    context.textAlign = "center"
    context.textBaseline = "middle"

    context.strokeText(">", x, y)

    context.restore()
  }

  const renderBall: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    if (data?.data === undefined || data.data.ball.coordinates === undefined) { return }

    const { radius, coordinates } = data.data.ball
    context.fillStyle = '#FF7A00'
    context.beginPath()
    context.arc(coordinates.x, coordinates.y, radius, 0, 2*Math.PI)
    context.fill()
  }

  const renderBlock: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    if (data?.data === undefined || data.data.block.coordinates === undefined) { return }

    const { height, width } = data.data.block
    const { x, y } = data.data.block.coordinates

    context.fillStyle = data.drawData.isDarkMode ? '#E5E7EB' : '#000000'
    context.fillRect(x - width / 2, y - height / 2, width, height)
  }

  const renderScore: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    if (data?.data === undefined) { return }

    context.fillStyle = '#7B3F00'
    context.font = 'bold 15px Arial'
    context.textBaseline = 'top'
    context.fillText(`Score: ${data.data.canvasState.score}`, 5, 5)
  }

  const renderBalls: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    if (data?.data === undefined) { return }

    const { radius } = data.data.ball
    const r = radius / 3
    context.fillStyle = '#FF7A00'
    context.beginPath()
    let x = 5
    for (let i = 0; i < data.data.canvasState.balls; i++) {
      x += r
      context.arc(x, 25 + r, r, 0, 2*Math.PI)
      x += 10
    }

    context.fill()
  }

  const renderGameOver: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    if (data?.data === undefined) { return }

    context.fillStyle = data.drawData.isDarkMode ? '#E5E7EB' : '#000000'
    context.font = '30px Arial'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText('Game Over', data.drawData.width / 2, data.drawData.height / 2 - 15)

    context.font = '25px Arial'
    context.fillText('Score: ' + data.data.canvasState.score, data.drawData.width / 2, data.drawData.height / 2 + 15)

    context.font = '15px Arial'
    context.textBaseline = 'bottom'
    context.fillText('enter | click = start', data.drawData.width / 2, data.drawData.height - 5)
  }

  const blurFilter: AnimatedCanvasRenderFilterFunction = (context) => {
    context.filter = 'blur(2px)'
  }

  const opacityFilter: AnimatedCanvasRenderFilterFunction = (context) => {
    context.globalAlpha = 0.5
  }

  const { Canvas } = use2dAnimatedCanvas({
    initialiseData: () => ({
      ball: {
        radius: 20
      },
      canvasState: {
        ballForwardX: true,
        ballForwardY: false,
        score: 0,
        balls: 3,
        controlRadius: 30,
        newBall: false,
        resetGame: false,
        ballSpeed: 1,
        blockSpeed: 1,
        canScore: false,
        sourceBounce: 'block'
      },
      block: {
        height: 10,
        width: 100
      },
      client: {
        pointerClick: false
      }
    }),
    preRenderTransform: [
      waitForCanvasResize,
      when(isGameReset, initialiseGame),
      when(isNewBall, setNewBall),
      setClientCommand,
      setClientPointerValues,
      convertPointerValuesToCommand,
      executeCommand,
      when([
        isBallTouchingTopEdge,
        isBallMoving,
        not(isSourceBounceTopEdge)
      ], [
        setSourceBounceToTopEdge,
        sendBallDown,
        increaseSpeed
      ]),
      when([
        isBallTouchingLeftEdge,
        isBallMoving,
        not(isSourceBounceLeftEdge)
      ], [
        setSourceBounceToLeftEdge,
        sendBallRight,
        increaseSpeed
      ]),
      when([
        isBallTouchingRightEdge,
        isBallMoving,
        not(isSourceBounceRightEdge)
      ], [
        setSourceBounceToRightEdge,
        sendBallLeft,
        increaseSpeed
      ]),
      when([
        isBallTouchingBottomEdge,
        isBallMoving
      ], requestNewBall),
      when([
        isBallTouchingBlockLeftSide,
        isBallMoving,
        not(isSourceBounceBlock)
      ], [
        sendBallLeft
      ]),
      when([
        isBallTouchingBlockRightSide,
        isBallMoving,
        not(isSourceBounceBlock)
      ], [
        sendBallRight,
      ]),
      when([
        isBallTouchingBlock,
        isBallMoving,
        not(isSourceBounceBlock)
      ], [
        setSourceBounceToBlock,
        sendBallUp,
        increaseSpeed,
        increaseScore
      ]),
      when(isBallMoving, getNextBallCoordinates)
    ],
    renderBackgroundFilter: filterWhen([
      isGameEnded
    ], [
      blurFilter,
      opacityFilter
    ]),
    renderBackground: [
      renderInstructions,
      renderLeftControl,
      renderRightControl
    ],
    renderFilter: filterWhen([
      isGameEnded
    ], [
      blurFilter,
      opacityFilter
    ]),
    render: [
      renderBall,
      renderBlock
    ],
    renderForeground: [
      renderWhen(not(isGameEnded), [
        renderScore,
        renderBalls
      ]),
      renderWhen(isGameEnded, [
        renderGameOver
      ])
    ]
  })

  const onKeyDownHandler = (event: KeyboardEvent) => {
    command = event.key.toLowerCase()
  }

  const onKeyUpHandler = (event: KeyboardEvent) => {
    command = ''
  }

  const onCanvasResizeHandler: CanvasResizeHandler = (width, height) => {
    hasResized = true
  }

  const onPointerEnterHandler: PointerEventHandler = (event) => {
    pointerCoordinates = undefined
    pointerClick = false
  }

  const onPointerMoveHandler: PointerEventHandler  = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    pointerCoordinates = { x, y }
  }

  const onPointerDownHandler: PointerEventHandler = () => {
    pointerClick = true
  }

  const onPointerUpHandler: PointerEventHandler = () => {
    pointerClick = false
  }

  const onPointerOutHandler: PointerEventHandler = () => {
    pointerCoordinates = undefined
    pointerClick = false
  }

  const code = `
    // this function is used to render a ball
    //   that moves around the canvas and bounces off the edges
    // a block at the bottom can be controlled to prevent the ball
    //   from touching the bottom edge
    // a point is scored when the ball touches the block
    // the round ends when the ball touches the bottom edge
    //   a ball is also lost in the process and a new round begins
    // the player has 3 balls to play with
    // the game ends when there are no more balls left
    export default function KeepyUppy() {

      // the data is grouped into different sections
      //   this helps in organizing the data and making it easier to understand
      type PageData = {

        // the object used for rendering the ball in the canvas
        ball: {
          radius: number,
          coordinates?: Coordinates
        },

        // the object used for rendering the block in the canvas
        block: {
          width: number,
          height: number,
          coordinates?: Coordinates
        }

        // the object used to store various states of the canvas
        //   like scores, number of balls, etc
        canvasState: {

          // indicates the direction of the ball's movement
          ballForwardX: boolean,
          ballForwardY: boolean,

          // indicates the number of units the ball moves in the canvas
          ballStepX?: number,
          ballStepY?: number,

          // indicates the current score and the number of balls left
          score: number,
          balls: number,

          // indicates the size of the control
          controlRadius: number,

          // flags that signifies various operations
          resetGame: boolean,
          newBall: boolean,
          sourceBounce: string,

          // modifiers for the movement of the ball and the block
          ballSpeed: number,
          blockSpeed: number
        },

        // the object used to store the changes made by the client
        client: {
          command?: string,
          pointerCoordinates?: Coordinates,
          pointerClick: boolean
        }
      }

      // the following variables are used to store the changes made by the client
      // this is used to separate them from the data used by the canvas
      // the idea is that the various events (keyboard events, etc)
      //   will update these variables afterwhich the data transformation functions
      //   will take these variables to update the internal data it will then use
      //   and finally the render functions will use these internal data
      //   to render objects in the canvas
      // this keeps the data flow more straightforward and easy to understand
      // basically this makes the rendering functions to just focus on the internal data,
      //   and the event handlers to just focus on the storing their values
      //   in a separate set of variables

      // this variable is used as a flag to indicate whether the resize event has occurred
      // since the canvas is set to fill the size of the parent container,
      //   the canvas will undergo a resize
      // this variable will then be updated after the resize event
      let hasResized: boolean | undefined

      // this variable will store the current key that is pressed
      //   (updated by the key down event and reset by the key up event)
      let command: string = ''

      // this variable will store the current coordinate of the pointer
      //   (updated by the pointer move event and reset by the pointer enter/out event)
      let pointerCoordinates: Coordinates | undefined

      // this variable will store whether the pointer is being clicked
      //   (updated by the pointer down and reset by the pointer up event)
      let pointerClick: boolean = false

      // the following functions are used for the initialisiation of the game

      const waitForCanvasResize = (data) => {
        // this is intended to be called once to start the initialisation of the game
        // the canvas resize event will switch on the flag that activates this function
        // it will then switch on the flag for initialisation
        //   then switch off it's own flag
      }

      const initialiseGame = (data) => {
        // this is intended to be called once per game to set the initial state the game
        // the previous function will switch on the initialisation flag
        //   that activates this function
        // it will then set the initial values for the game (number of balls, score, etc)
        //   then switch off the initialisation flag
      }

      const setNewBall = (data) => {
        // this is intended to be called once per round to set the initial state of the ball
        // the initialisation function or the end of a round
        //   will switch on the new ball flag
        // it will then set the initial values for the ball (coordinates, speed, etc)
        //   then switch off the new ball flag
      }

      // the following functions are used to capture the input
      //   and execute the command associated to that input

      const setClientCommand = (data) => {
        // update the internal data with the current pressed key
      }

      const setClientPointerValues = (data) => {
        // update the internal data with the current pointer coordinates and click state
      }

      const convertPointerValuesToCommand = (data) => {
        // convert the pointer values to a command
        // i.e.: if the pointer is within the left control and the pointer is clicked,
        //   make it look like the key 'a' is pressed
      }

      const executeCommand = (data) => {
        // modify internal data to respond to the current pressed key
        // i.e.: if the pressed key is 'a', move the block coordinates to the left
      }

      // the following functions are used to ensure the ball doesn't bounce again
      //   on the same edge/block if it is still touching that edge/block
      //   on it's way out away from that edge/block

      const setSourceBounceToTopEdge = (data) => {
        // sets the flag to indicate that the ball has touched the top edge
      }

      const setSourceBounceToLeftEdge = (data) => {
        // sets the flag to indicate that the ball has touched the left edge
      }

      const setSourceBounceToRightEdge = (data) => {
        // sets the flag to indicate that the ball has touched the right edge
      }

      const setSourceBounceToBlock = (data) => {
        // sets the flag to indicate that the ball has touched the block
      }

      // the following functions are used to force the direction of the ball
      // using the "reverse direction on touch" approach would cause the ball
      //   to "bounce back and forth" when it is still touching that edge/block
      //   on it's way out away from it
      // these functions are instead used to force a certain direction
      //   and prevent the issue

      const sendBallDown = (data) => {
        // force the direction of the ball to go down the y-axis
      }

      const sendBallUp = (data) => {
        // force the direction of the ball to go up the y-axis
      }

      const sendBallLeft = (data) => {
        // force the direction of the ball to go left on the x-axis
      }

      const sendBallRight = (data) => {
        // force the direction of the ball to go right on the x-axis
      }

      // the following function is used control the movement of the ball

      const getNextBallCoordinates = (data) => {
        // get the next coordinates of the ball based on the current step values
      }

      const increaseSpeed = (data) => {
        // increase the speed of the ball
      }

      // the following function is used to start a new round

      const requestNewBall = (data) => {
        // sets the flag to request a new ball
        // this is intended to be called when the ball touches the bottom edge
        //   to start a new round
      }

      // the following function is used for scoring a point

      const increaseScore = (data) => {
        // increases the score of the game
      }

      // the following functions are used to check the various conditions
      //   to determine the behavior of the data transformation functions
      // it's a good idea to separate these functions to keep them focused on a single task
      // all of these functions will work on the internal data used by the canvas

      const isGameReset = (data) => {
        // checks if the initialisation flag is set
      }

      const isNewBall = (data) => {
        // checks if the new ball flag is set
      }

      const isBallMoving = (data) => {
        // checks if the ball is moving
      }

      const isBallTouchingTopEdge = (data) => {
        // checks if the ball is touching the top edge of the canvas
      }

      const isBallTouchingBottomEdge = (data) => {
        // checks if the ball is touching the bottom edge of the canvas
      }

      const isBallTouchingLeftEdge = (data) => {
        // checks if the ball is touching the left edge of the canvas
      }

      const isBallTouchingRightEdge = (data) => {
        // checks if the ball is touching the right edge of the canvas
      }

      const isBallTouchingBlockLeftSide = (data) => {
        // checks if the ball is touching the left half of the block
      }

      const isBallTouchingBlockRightSide = (data) => {
        // checks if the ball is touching the right half of the block
      }

      const isBallTouchingBlock = (data) => {
        // checks if the ball is touching any part of the block
      }

      const isSourceBounceTopEdge = (data) => {
        // checks if the ball bounced off the top edge
      }

      const isSourceBounceLeftEdge = (data) => {
        // checks if the ball bounced off the left edge
      }

      const isSourceBounceRightEdge = (data) => {
        // checks if the ball bounced off the right edge
      }

      const isSourceBounceBlock = (data) => {
        // checks if the ball bounced off the block
      }

      const isPointerOnLeftControl = (data) => {
        // checks if the pointer coordinates is within the left control
      }

      const isPointerOnRightControl = (data) => {
        // checks if the pointer coordinates is within the right control
      }

      const isPointerClicked = (data) => {
        // checks if the pointer is clicked
      }

      const isGameEnded = (data) => {
        // checks if there are no more balls left
      }

      // the following functions are used to render objects on the canvas

      const renderInstructions = (context, data) => {
        // render instructions on the canvas
      }

      const renderLeftControl = (context, data) => {
        // render the left control on the canvas
      }

      const renderRightControl = (context, data) => {
        // render the right control on the canvas
      }

      const renderBall = (context, data) => {
        // render the ball on the canvas
        // it uses the internal data to render the ball in a certain coordinate,
        //   with a certain radius, and a certain color

        // notice that the render function is just focused on rendering the circle
        //   given the values on the internal data
        // the various data transformation functions
        //   are responsible for updating the internal data every frame
        //   causing the ball to appear to move
      }

      const renderBlock = (context, data) => {
        // render the block on the canvas
        // it uses the internal data to render the block in a certain coordinate,
        //   with a certain width, height, and color
      }

      const renderScore = (context, data) => {
        // render the current score on the canvas
      }

      const renderBalls = (context, data) => {
        // render the number of balls left on the canvas
      }

      const renderGameOver = (context, data) => {
        // render the game over message on the canvas
      }

      // the following functions are used to apply filters to the canvas

      const blurFilter = (context) => {
        // apply a blur filter to the canvas
      }

      const opacityFilter = (context) => {
        // apply an opacity filter to the canvas
      }

      const { Canvas } = use2dAnimatedCanvas<Date>({
        initialiseData: () => {
          // set the initial values for the internal data
        },

        // proper naming of the functions makes the code more readable
        //   and easier to understand
        preRenderTransform: [

          // will wait for the canvas to resize before setting the initialisation flag
          waitForCanvasResize,

          // initialisation flag will be set on canvas resize and on game end
          when(isGameReset, initialiseGame),

          // new ball flag will be set on on new round and on game end
          when(isNewBall, setNewBall),

          // get the currently pressed key or pointer values
          //   and execute the corresponding command
          setClientCommand,
          setClientPointerValues,
          convertPointerValuesToCommand,
          executeCommand,

          // bounce the ball when it touches an edge
          when([
            isBallTouchingTopEdge,
            isBallMoving,
            not(isSourceBounceTopEdge)
          ], [
            setSourceBounceToTopEdge,
            sendBallDown,
            increaseSpeed
          ]),
          when([
            isBallTouchingLeftEdge,
            isBallMoving,
            not(isSourceBounceLeftEdge)
          ], [
            setSourceBounceToLeftEdge,
            sendBallRight,
            increaseSpeed
          ]),
          when([
            isBallTouchingRightEdge,
            isBallMoving,
            not(isSourceBounceRightEdge)
          ], [
            setSourceBounceToRightEdge,
            sendBallLeft,
            increaseSpeed
          ]),

          // end the round when the ball touches the bottom edge
          when([
            isBallTouchingBottomEdge,
            isBallMoving
          ], requestNewBall),

          // move the ball to a specific direction
          //   when it touches a specific side of the block
          when([
            isBallTouchingBlockLeftSide,
            isBallMoving,
            not(isSourceBounceBlock)
          ], [
            sendBallLeft
          ]),
          when([
            isBallTouchingBlockRightSide,
            isBallMoving,
            not(isSourceBounceBlock)
          ], [
            sendBallRight
          ]),

          // move the ball up if it touches the block
          //   and score a point
          when([
            isBallTouchingBlock,
            isBallMoving,
            not(isSourceBounceBlock)
          ], [
            setSourceBounceToBlock,
            sendBallUp,
            increaseSpeed,
            increaseScore
          ]),

          // get the next coordinates of the ball
          when(isBallMoving, getNextBallCoordinates)
        ],

        // the background layer will be blurred and slightly transparent when the game ends
        renderBackgroundFilter: filterWhen([
          isGameEnded
        ], [
          blurFilter,
          opacityFilter
        ]),
        renderBackground: [
          renderInstructions,
          renderLeftControl,
          renderRightControl
        ],,

        // the main layer will be blurred and slightly transparent when the game ends
        renderFilter: filterWhen([
          isGameEnded
        ], [
          blurFilter,
          opacityFilter
        ]),
        render: [
          renderBall,
          renderBlock
        ],

        // the foreground layer will either show the score or the game end screen
        renderForeground: [
          renderWhen(not(isGameEnded), [
            renderScore,
            renderBalls
          ]),
          renderWhen(isGameEnded, [
            renderGameOver
          ])
        ]
      })

      const onKeyDownHandler = (event) => {
        // set the pressed key value
      }

      const onKeyUpHandler = (event) => {
        // reset the pressed key value
      }

      const onCanvasResizeHandler = (width, height) => {
        // set the canvas resized flag
      }

      const onPointerEnterHandler = (event) => {
        // reset pointer values
      }

      const onPointerMoveHandler = (event) => {
        // get the x and y values based on the translated pointer coordinates
        //   since the canvas coordinates are relative to the viewport
        // set pointer coordinates to the x and y values
      }

      const onPointerDownHandler = (event) => {
        // set pointer click to true
      }

      const onPointerUpHandler = (event) => {
        // set pointer click to false
      }

      const onPointerOutHandler = (event) => {
        // reset pointer values
      }

      return <Canvas
        onKeyDown={onKeyDownHandler}
        onKeyUp={onKeyUpHandler}
        onCanvasResize={onCanvasResizeHandler}
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
    <div className='max-w-[36rem] h-[24rem] mx-8 mb-8'>
      <Canvas className='w-full h-full border border-black dark:border-gray-300'
        onKeyDown={onKeyDownHandler}
        onKeyUp={onKeyUpHandler}
        onCanvasResize={onCanvasResizeHandler}
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
