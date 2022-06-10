import { getCanvasPositions, getRelativePositions } from "./position.js"
import { makeScreen} from "./screen.js"
import { VIEW_CORNERS } from "./corners.js"

//======//
// DRAW //
//======//
// This file contains primitive + agnostic drawing functions
// For higher-level drawing functions, go to 'colour.js'
export const SCREEN_BORDER_WIDTH = 1
export const drawBorder = (context, screen) => {

	const {colour, corners} = screen
	fillBackground(context, {colour: Colour.Black, corners})

	const canvasCornerPositions = getCanvasPositions(context, corners)
	const [a, b, c, d] = canvasCornerPositions

	context.beginPath()
	context.moveTo(...a)
	context.lineTo(...b)
	context.lineTo(...d)
	context.lineTo(...c)
	context.closePath()

	context.lineWidth = SCREEN_BORDER_WIDTH
	context.strokeStyle = colour.hex
	context.stroke()
}

export const fillBackground = (context, screen) => {

	const {colour, corners} = screen
	const canvasCornerPositions = getCanvasPositions(context, corners)
	const [a, b, c, d] = canvasCornerPositions

	context.beginPath()
	context.moveTo(...a)
	context.lineTo(...b)
	context.lineTo(...d)
	context.lineTo(...c)
	context.closePath()

	context.fillStyle = colour.hex
	context.fill()
}

//=======//
// QUEUE //
//=======//
export const clearQueue = (context, queue, camera) => {
	const {canvas} = context
	context.clearRect(0, 0, canvas.width, canvas.height)

	const {colour} = camera
	const screen = makeScreen(colour, VIEW_CORNERS)
	queue.clear()
	queue.push(screen)
}

export const addChildrenToQueue = (queue, screen) => {
	let i = 1
	const {colour, corners} = screen
	for (let c = colour.screens.length-1; c >= 0; c--) {
		const child = colour.screens[c]
		const relativeCorners = getRelativePositions(child.corners, corners)
		const screen = makeScreen(child.colour, relativeCorners)
		queue.push(screen)
		i++
	}
	return i
}

export const continueDrawingQueue = (context, queue) => {
	
	// If the draw queue is empty, that means we've drawn everything already :)
	if (queue.isEmpty) {
		return
	}

	let i = 0
	while (!queue.isEmpty) {
		if (i >= 5_000) break
		const screen = queue.shift()
		drawBorder(context, screen)
		i += addChildrenToQueue(queue, screen)
	}

}