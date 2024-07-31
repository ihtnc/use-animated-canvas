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

      resetGame: boolean,
      newBall: boolean,
      canScore: boolean,

      ballSpeed: number,
      blockSpeed: number
    },
    client: {
      command?: string
    }
  }

  let hasResized: boolean = false
  let command: string = ''

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
    canvasState.canScore = false

    return data
  }

  const setClientCommand: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.client.command = command

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
          canvasState.ballForwardX = (Math.random() * 10) < 5
          canvasState.ballStepX = Math.random() + 1
          canvasState.ballStepY = Math.random() + 1

        } else if (isDone) {
          canvasState.resetGame = true
        }
        break

      default:
        canvasState.blockSpeed = 1
        break;
    }

    return data
  }

  const reverseBallMovementX: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.ballForwardX = !data.data.canvasState.ballForwardX

    return data
  }

  const reverseBallMovementY: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.ballForwardY = !data.data.canvasState.ballForwardY

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

  const startScoring: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.canScore = true

    return data
  }

  const stopScoring: AnimatedCanvasTransformFunction<PageData> = (data) => {
    if (data?.data === undefined) { return data }

    data.data.canvasState.canScore = false

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

  const isGameEnded: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    return data.data.canvasState.balls < 0
  }

  const isScoring: AnimatedCanvasConditionalFunction<PageData> = (data) => {
    if (data?.data === undefined) { return false }

    return data.data.canvasState.canScore
  }

  const renderInstructions: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillText('enter = start', 5, 5)
    context.fillText('a | d = move', 5, 25)
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
    context.font = '15px Arial'
    context.textBaseline = 'bottom'
    context.fillText(`Score: ${data.data.canvasState.score}`, 5, data.drawData.height - 5)
  }

  const renderBalls: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    if (data?.data === undefined) { return }

    const { radius } = data.data.ball
    const r = radius / 3
    context
    context.fillStyle = '#FF7A00'
    context.beginPath()
    let x = 5
    for (let i = 0; i < data.data.canvasState.balls; i++) {
      x += r
      context.arc(x, data.drawData.height - 25 - r, r, 0, 2*Math.PI)
      x += 10
    }

    context.fill()
  }

  const renderGameOver: AnimatedCanvasRenderFunction<PageData> = (context, data) => {
    context.fillStyle = data.drawData.isDarkMode ? '#E5E7EB' : '#000000'
    context.font = '30px Arial'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText('Game Over', data.drawData.width / 2, data.drawData.height / 2)

    context.font = '15px Arial'
    context.textBaseline = 'bottom'
    context.fillText('enter = start', data.drawData.width / 2, data.drawData.height - 5)
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
        newBall: false,
        resetGame: false,
        ballSpeed: 1,
        blockSpeed: 1,
        canScore: false
      },
      block: {
        height: 10,
        width: 100
      },
      client: {}
    }),
    preRenderTransform: [
      waitForCanvasResize,
      when(isGameReset, initialiseGame),
      when(isNewBall, setNewBall),
      setClientCommand,
      executeCommand,
      when([
        isBallTouchingTopEdge,
        isBallMoving
      ], [
        reverseBallMovementY,
        increaseSpeed,
        startScoring
      ]),
      when([
        isBallTouchingLeftEdge,
        isBallMoving
      ], [
        reverseBallMovementX,
        increaseSpeed,
        startScoring
      ]),
      when([
        isBallTouchingRightEdge,
        isBallMoving
      ], [
        reverseBallMovementX,
        increaseSpeed,
        startScoring
      ]),
      when([
        isBallTouchingBottomEdge,
        isBallMoving
      ], requestNewBall),
      when([
        isBallTouchingBlockLeftSide,
        isBallMoving
      ], [
        sendBallUp,
        sendBallLeft,
        increaseSpeed
      ]),
      when([
        isBallTouchingBlockRightSide,
        isBallMoving
      ], [
        sendBallUp,
        sendBallRight,
        increaseSpeed
      ]),
      when([
        isBallTouchingBlock,
        isBallMoving,
        isScoring
      ], [
        increaseScore,
        stopScoring
      ]),
      when(isBallMoving, getNextBallCoordinates)
    ],
    renderBackgroundFilter: filterWhen([
      isGameEnded
    ], [
      blurFilter,
      opacityFilter
    ]),
    renderBackground: renderInstructions,
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

  const onCanvasResize: CanvasResizeHandler = (width, height) => {
    hasResized = true
  }

  const code = `
    // this function is used to render a ball
    //   that moves around the canvas and bounces off the edges
    // a block at the bottom can be controlled to prevent the ball
    //   from touching the bottom edge
    // a point is scored when the ball touches the block
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

          // indicates the direction of the ball's direction
          ballForwardX: boolean,
          ballForwardY: boolean,

          // indicates the number of units the ball moves in the canvas
          ballStepX?: number,
          ballStepY?: number,

          // indicates the current score and the number of balls left
          score: number,
          balls: number,

          // flags that signifies various operations
          resetGame: boolean,
          newBall: boolean,
          canScore: boolean,

          // modifiers for the movement of the ball and the block
          ballSpeed: number,
          blockSpeed: number
        },

        // the object used to store the changes made by the client
        client: {
          command?: string
        }
      }

      // the following variables are used to store the changes made by the client
      // this is used to separate them from the data used by the canvas
      // the idea is that the various events (keyboard events, etc) will update these variables
      //   then the data transformation functions will take these variables to update the internal data it then will use
      //   then the render functions will use these internal data to render objects in the canvas
      // this keeps the data flow more straightforward and easy to understand
      // basically this makes the rendering functions to just focus on the internal data,
      //   and the event handlers to just focus on the storing their values in a separate set of variables

      // this variable is used as a flag to indicate whether the resize event has occurred
      // since the canvas is set to fill the size of the parent container, the canvas will undergo a resize
      //   this variable will then be updated after the resize event
      let hasResized: boolean | undefined

      // this variable will store the current key that is pressed
      //   (updated by the key up event and reset by the key down event)
      let command: string = ''

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
        // it will then switch off it's own flag
      }

      const setNewBall = (data) => {
        // this is intended to be called once per round to set the initial state of the ball
        // the initialisation function or the end of a round
        //   will switch on the new ball flag
        // it will then switch off it's own flag
      }

      // the following functions are used to execute the command input

      const setClientCommand = (data) => {
        // update the internal data with the current pressed key
      }

      const executeCommand = (data) => {
        // modify internal data to respond to the current pressed key
        // i.e.: if the pressed key is 'a', move the block coordinates to the left
      }

      // the following functions are used to manage the operations related to the ball

      const reverseBallMovementX = (data) => {
        // reverse the direction of the ball in the x-axis
      }

      const reverseBallMovementY = (data) => {
        // reverse the direction of the ball in the y-axis
      }

      const sendBallUp = (data) => {
        // force the direction of the ball to go up the y-axis
        // this is intended for when the ball touches the block
        //   to prevent the ball from going down when it still touches
        //   the block on it's way up
      }

      const sendBallLeft = (data) => {
        // force the direction of the ball to go left on the x-axis
        // this is intended to make the ball movement less predictable
      }

      const sendBallRight = (data) => {
        // force the direction of the ball to go right on the x-axis
        // this is intended to make the ball movement less predictable
      }

      const getNextBallCoordinates = (data) => {
        // get the next coordinates of the ball based on the current step values
      }

      const increaseSpeed = (data) => {
        // increase the speed of the ball
      }

      const requestNewBall = (data) => {
        // sets the flag to request a new ball
        // this is intended to be called when the ball touches the bottom edge
        //   to start a new round
      }

      // the following functions are used to manage the operations related to scoring

      const increaseScore = (data) => {
        // increases the score of the game
      }

      const startScoring = (data) => {
        // flags the game to start scoring
        // this is intended to be called when the ball touches the edges of the canvas
        //   to prevent the score from increasing when the ball
        //   is still touching the block on it's way up
      }

      const stopScoring = (data) => {
        // flags the game to stop scoring
        // this is intended to be called right after a score is made
        //   to prevent the score from increasing when the ball
        //   is still touching the block on it's way up
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
        // checks if the ball is touching the block
      }

      const isGameEnded = (data) => {
        // checks if there are no more balls left
      }

      const isScoring = (data) => {
        // checks if the scoring flag is set
      }

      // the following functions are used to render objects on the canvas

      const renderInstructions = (context, data) => {
        // render instructions on the canvas
      }

      const renderBall = (context, data) => {
        // render the ball on the canvas
        // it uses the internal data to render the ball in a certain coordinate,
        //   with a certain radius, and a certain color

        // notice that the render function is just focused on rendering the circle
        //   given the values on the internal data
        // the various data transformation functions are responsible for updating the internal data
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

        // proper naming of the functions makes the code more readable and easier to understand
        preRenderTransform: [

          // will wait for the canvas to resize before setting the initialisation flag
          waitForCanvasResize,

          // game will reset on canvas resize and on game end
          when(isGameReset, initialiseGame),

          // new ball will be set on game reset and on new round
          when(isNewBall, setNewBall),

          // get the currently pressed key and execure the corresponding command
          setClientCommand,
          executeCommand,

          // move the ball when it touches an edge
          when([
            isBallTouchingTopEdge,
            isBallMoving
          ], [
            reverseBallMovementY,
            increaseSpeed,
            startScoring
          ]),
          when([
            isBallTouchingLeftEdge,
            isBallMoving
          ], [
            reverseBallMovementX,
            increaseSpeed,
            startScoring
          ]),
          when([
            isBallTouchingRightEdge,
            isBallMoving
          ], [
            reverseBallMovementX,
            increaseSpeed,
            startScoring
          ]),

          // end the round when the ball touches the bottom edge
          when([
            isBallTouchingBottomEdge,
            isBallMoving
          ], requestNewBall),

          // move the ball up when it touches the block
          when([
            isBallTouchingBlockLeftSide,
            isBallMoving
          ], [
            sendBallUp,
            sendBallLeft,
            increaseSpeed
          ]),
          when([
            isBallTouchingBlockRightSide,
            isBallMoving
          ], [
            sendBallUp,
            sendBallRight,
            increaseSpeed
          ]),

          // score a point when the ball touches the block
          when([
            isBallTouchingBlock,
            isBallMoving,
            isScoring
          ], [
            increaseScore,
            stopScoring
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
        renderBackground: renderInstructions,

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

      const onCanvasResize = (width, height) => {
        // set the canvas resized flag
      }

      return <Canvas
        onKeyDown={onKeyDownHandler}
        onKeyUp={onKeyUpHandler}
        onCanvasResize={onCanvasResize}
      />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-[36rem] h-[24rem] ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black dark:border-gray-300'
        onKeyDown={onKeyDownHandler}
        onKeyUp={onKeyUpHandler}
        onCanvasResize={onCanvasResize}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
