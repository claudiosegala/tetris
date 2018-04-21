// Model
let state // the current state of the game

const game  = {
	rows:     16,
	cols:   8,
	size:    127
} 

const LEFT  = { x:  0, y: -1 }
const DOWN  = { x:  1, y:  0 }
const RIGHT = { x:  0, y:  1 }
const TURN  = {}

// Consider the state.currentPiece the position of the pivo
// This is an array of relative positions in the pivo
const pieceTypes = [
	[
		[[ 0, -1], [-1,  0], [ 1,  0]],
		[[ 0, -1], [ 0,  1], [ 1,  0]],   //  o
		[[-1,  0], [ 0,  1], [ 1,  0]],   // ooo
		[[ 0,  1], [ 0, -1], [-1,  0]]
	], [                                // oo
		[[ 1,  0], [ 1,  1], [ 0,  1]]  // oo
	], [
		[[-1,  0], [-1, -1], [ 0,  1]],  // oo
		[[ 1,  0], [-1,  1], [ 0,  1]]   //  oo
	], [
		[[ 1,  0], [ 0,  1], [ 1,  1]], //  oo
		[[-1,  0], [ 0,  1], [-1, -1]]  // oo
	], [
		[[-1,  0], [ 1,  0], [ 2,  0]], // oooo
		[[ 0, -1], [ 0,  1], [ 0,  2]]
	]
]

const nextPiece = () => {
	return {
		position: { x: 2, y: 2 },
		rotation: 0,
		type: rnd(len(pieceTypes))
	}
}

// TODO: not functional enough
const matrix = (n, m) => {
	var row = new Array (n)
	return map(row, x => x = new Array (m))
}

const initState = () => {
	return {
		score: 0,
		board: matrix(game.rows, game.cols),
		currentPiece: nextPiece()
	}
}

// View
const score  = document.getElementById('score')
const canvas = document.getElementById('board')
const ctx    = canvas.getContext('2d')

const newPos = (i, j) => [5 + 40*j, 5 + 40*i, 35, 35]

const inLimits = (i, j) => (i >= 0 && j >= 0 && i < game.rows && j < game.cols)

const fillBoard = (a, fn, n, max) => {
	if (n >= 0) {
		const i = n % max
		const j = div(n, max)

		if (fn(a[n])) {
			ctx.fillRect(...newPos(i, j))
		}

		fillBoard(a, fn, n-1, max)
	}
}

const relIdx = (i, j) => k => { return { x: k[0] + i, y: k[1] + j} }

const fillCurPiece = (p) => {
	const i      = p.position.x; // position of pivot
	const j      = p.position.y;
	const t      = p.type;       // piece type
	const r      = p.rotation    // piece rotation
	const relPos = map(concat(pieceTypes[t][r], [[0, 0]]), relIdx(i, j))
	
	each(relPos, (p, i) => ctx.fillRect(...newPos(p.x, p.y)))
}

const drawFrame = () => {
	const board = flatten(state.board)

	// clean board
	ctx.fillStyle = "rgb(51, 51, 51)"
	fillBoard(board, x => true, game.size, game.rows)

	// draw the dead pieces
	ctx.fillStyle = "rgb(255, 255, 255)"
	fillBoard(board, x => x, game.size, game.rows)

	// draw current pieces
	ctx.fillStyle = "rgb(127, 255, 127)"
	fillCurPiece(state.currentPiece)
}

const updateScore = () => score.textContent = (state.score + 'pt')

// Controller
const nextState = (action) => {
	const p = state.currentPiece;
	if (action == TURN) {
		state.currentPiece.rotation = (p.rotation + 1) % len(pieceTypes[p.type])
	} else {
		var x = state.currentPiece.position.x + action.x
		var y = state.currentPiece.position.y + action.y
		
		if (inLimits(x, y)) {
			state.currentPiece.position = { x: x, y: y }
		}
	}
}

const changeState = (event) => {
	switch (event.key) {
		case 'a': case 'A': case 'ArrowLeft':  nextState(LEFT); break;
		case 's': case 'S': case 'ArrowDown':  nextState(DOWN); break;
		case 'd': case 'D': case 'ArrowRight': nextState(RIGHT); break;
		case 'w': case 'W': case 'ArrowUp':    nextState(TURN); break;
	}
}

const refresh = () => {
	updateScore() // print the score of the game
	drawFrame()   // draw the init game
}

const gravity = () => nextState(DOWN)

const tetris = () => {
	// init the state of the game
	state = initState()

	// Start listening for keystrokes
	window.addEventListener('keydown', changeState)

	// Start refreshing the canvas every 100ms
	const refreshId = window.setInterval(refresh, 100)

	// Current Piece goes down every 1s
	const gravityId = window.setInterval(gravity, 1000)
}

tetris()