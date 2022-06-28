import { makeAddress } from "./address.js"
import { getRotatedCorners } from "./corners.js"
import { addStep, makeRoute } from "./route.js"

//========//
// COLOUR //
//========//
export const COLOUR_HEXES = [
	GREEN,
	BLUE,
	RED,
	YELLOW,
	ORANGE,
	ROSE,
	CYAN,
	PURPLE,
	GREY,
]

export const makeColours = () => {
	const colours = {}
	for (const hex of COLOUR_HEXES) {
		colours[hex] = makeColour(hex)
	}
	return colours
}

export const makeColour = (hex) => {
	const screens = []
	const colour = {hex, screens}
	return colour
}

//=========//
// SCREENS //
//=========//
export const removeAllScreens = (colour) => {
	colour.screens.length = 0
}

export const removeScreensSet = (colour, screensSet) => {
	colour.screens = colour.screens.filter(screen => !screensSet.has(screen))
}

export const removeScreen = (colour, screen) => {
	colour.screens = colour.screens.filter(s => s !== screen)
}

export const removeScreenNumber = (colour, number) => {
	colour.screens.splice(number, 1)
}

export const removeScreenAddress = (address) => {
	const {colour, number} = address
	removeScreenNumber(colour, number)
}

export const addScreen = (colour, screen) => {
	const number = colour.screens.push(screen) - 1
	return number
}

export const setScreenNumber = (colour, number, screen) => {
	colour.screens[number] = screen
}

export const rotateScreenNumber = (colour, number, angle) => {
	const screen = colour.screens[number]
	screen.corners = getRotatedCorners(screen.corners, angle)
}

// Corrects a provided route too
export const moveAddressToBack = (address, route = undefined) => {
	const {colour, number} = address
	const screen = colour.screens[number]
	removeScreenAddress(address)
	const newNumber = addScreen(colour, screen)
	const newAddress = makeAddress(colour, newNumber)
	if (route === undefined) {
		return newAddress
	}

	const {start, steps} = route
	let routeScreen = start

	const newRoute = makeRoute(start)

	for (const step of steps) {
		let stepNumber = step.item
		if (routeScreen.colour === colour) {
			if (stepNumber === number) {
				stepNumber = newNumber
			} else if (stepNumber > number) {
				stepNumber--
			}
		}
		addStep(newRoute, stepNumber)
		routeScreen = routeScreen.colour.screens[stepNumber]
	}

	return [newAddress, newRoute]
	
}