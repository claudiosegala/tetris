// Model
const game  = {
	rows:  16,
	cols:   8,
	size: 127
} 

const LEFT  = { x:  0, y: -1 }
const DOWN  = { x:  1, y:  0 }
const RIGHT = { x:  0, y:  1 }
const TURN  = {}

const pieceTypes = [
	[
		[{ x: 0,y: 0} , { x: 0, y:-1 }, { x:-1, y: 0 }, { x: 1, y: 0 }],
		[{ x: 0,y: 0} , { x: 0, y:-1 }, { x: 0, y: 1 }, { x: 1, y: 0 }], //  o
		[{ x: 0,y: 0} , { x:-1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }], // ooo
		[{ x: 0,y: 0} , { x: 0, y: 1 }, { x: 0, y:-1 }, { x:-1, y: 0 }]
	], [                                                                 // oo
		[{ x: 0,y: 0} , { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }]  // oo
	], [
		[{ x: 0,y: 0} , { x:-1, y: 0 }, { x:-1, y:-1 }, { x: 0, y: 1 }], // oo
		[{ x: 0,y: 0} , { x: 1, y: 0 }, { x:-1, y: 1 }, { x: 0, y: 1 }]  //  oo
	], [
		[{ x: 0,y: 0} , { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], //  oo
		[{ x: 0,y: 0} , { x:-1, y: 0 }, { x: 0, y: 1 }, { x:-1, y:-1 }]  // oo
	], [
		[{ x: 0,y: 0} , { x:-1, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], // oooo
		[{ x: 0,y: 0} , { x: 0, y:-1 }, { x: 0, y: 1 }, { x: 0, y: 2 }]
	]
]

const nextPiece = () => {
	return {
		x:        2, 
		y:        2,
		rotation: 0,
		type:     rnd(len(pieceTypes))
	}
}

let state = {
	score: 0,
	board: matrix(game.rows, game.cols),
	currentPiece: nextPiece()
}

// View
const score  = document.getElementById('score')
const canvas = document.getElementById('board')
const ctx    = canvas.getContext('2d')

const updateScore = () => score.textContent = (state.score + 'pt')

const newPos = (i, j) => [5 + 40*j, 5 + 40*i, 35, 35]

const adjIdx = (i, j) => k => { return { x: k.x + i, y: k.y + j } }

const fillBoard = (a, fn, n, max) => {
	if (n >= 0) {
		const i = div(n, max)
		const j = n % max

		if (fn(a[n])) {
			ctx.fillRect(...newPos(i, j))
		}

		fillBoard(a, fn, n-1, max)
	}
}

const fillCurPiece = (p) => {
	const piece  = pieceTypes[p.type][p.rotation]
	const relPos = map(piece, adjIdx(p.x, p.y))
	
	each(relPos, (p, i) => ctx.fillRect(...newPos(p.x, p.y)))
}

const drawFrame = () => {
	const board = flatten(state.board)

	// clean board
	ctx.fillStyle = "rgb(51, 51, 51)"
	fillBoard(board, x => true, game.size, game.cols)

	// draw the dead pieces
	ctx.fillStyle = "rgb(255, 255, 255)"
	fillBoard(board, x => x, game.size, game.cols)

	// draw current pieces
	ctx.fillStyle = "rgb(127, 255, 127)"
	fillCurPiece(state.currentPiece)
}

// Controller
const hitWall   = (i, j) => (j < 0 || j >= game.cols)
const hitFloor  = (i, j) => (i < 0 || i >= game.rows)
const inLimits  = (i, j) => (!hitWall && !hitFloor)
const hitBlock  = (i, j) => (inLimits(i, j) && state.board[i][j])
const killPiece = (i, j) => (state.board[i][j] = true)

const nextState = (act) => {
	const p = state.currentPiece;

	if (act == TURN) {
		state.currentPiece.rotation = (p.rotation + 1) % len(pieceTypes[p.type])
	} else {
		const newX   = p.x + act.x
		const newY   = p.y + act.y
		const piece  = pieceTypes[p.type][p.rotation]
		const curPos = map(piece, adjIdx(p.x, p.y))
		const nxtPos = map(piece, adjIdx(newX, newY))

		const hWall  = len(filter(nxtPos, k => hitWall(k.x, k.y)))
		const hFloor = len(filter(nxtPos, k => hitFloor(k.x, k.y)))
		const hBlock = len(filter(nxtPos, k => hitBlock(k.x, k.y)))

		// console.log(state.board)
		// console.log(hWall)
		// console.log(hFloor)
		console.log(hBlock)

		if (hFloor || hBlock) {
			state.currentPiece = nextPiece()
			each(curPos, k => killPiece(k.x, k.y))
		} else if (!hWall){
			state.currentPiece.x = newX
			state.currentPiece.y = newY
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

// Setup
const init = () => {
	// Start listening for keystrokes
	window.addEventListener('keydown', changeState)

	// Start refreshing the canvas every 100ms
	const refreshId = window.setInterval(drawFrame, 100)

	// Current Piece goes down every 1s
	const gravityId = window.setInterval(() => nextState(DOWN), 1000)
}

init()