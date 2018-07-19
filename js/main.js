// State
let state = {}

// Model
const RED = "rgb(255, 102, 102)"
const WHT = "rgb(255, 255, 255)"
const BLK = "rgb(51, 51, 51)"
const GRN = "rgb(127, 255, 127)"

const LEFT  = { x:  0, y: -1 }  // moves left
const DOWN  = { x:  1, y:  0 }  // moves down
const RIGHT = { x:  0, y:  1 }  // moves right
const TURN  = {}                // do not moves
const ROWS  = 16                // qnt of rows
const COLS  = 8                 // qnt of columns
const SIZE  = (ROWS * COLS)     // qnt of spaces in board
const RATE  = 100               // refresh rate of the game
const FALL  = 800               // gravity speed

const pieceTypes = [
	[                                                                     // oo
		[{ x: 0, y: 0} , { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }]  // oo
	], [
		[{ x: 0, y: 0} , { x: 0, y:-1 }, { x: 1, y:-1 }, { x: 2, y:-1 }], //  o
		[{ x: 0, y: 0} , { x: 0, y:-1 }, { x: 0, y:-2 }, { x: 1, y: 0 }], //  o
		[{ x: 0, y: 0} , { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y:-1 }], // oo
		[{ x: 0, y: 0} , { x: 0, y:-1 }, { x: 0, y:-2 }, { x:-1, y:-2 }]
	], [
		[{ x: 0, y: 0} , { x: 0, y:-1 }, { x:-1, y:-1 }, { x:-2, y:-1 }], // o
		[{ x: 0, y: 0} , { x: 0, y:-1 }, { x: 0, y:-2 }, { x: 1, y:-2 }], // o
		[{ x: 0, y: 0} , { x: 0, y:-1 }, { x: 1, y: 0 }, { x: 2, y: 0 }], // oo
		[{ x: 0, y: 0} , { x: 1, y: 0 }, { x: 1, y:-1 }, { x: 1, y:-2 }]
	], [
		[{ x: 0, y: 0} , { x: 0, y:-1 }, { x:-1, y: 0 }, { x: 1, y: 0 }],
		[{ x: 0, y: 0} , { x: 0, y:-1 }, { x: 0, y: 1 }, { x: 1, y: 0 }], //  o
		[{ x: 0, y: 0} , { x:-1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }], // ooo
		[{ x: 0, y: 0} , { x: 0, y: 1 }, { x: 0, y:-1 }, { x:-1, y: 0 }]
	], [
		[{ x: 0, y: 0} , { x: 0, y:-1 }, { x: 1, y: 0 }, { x: 1, y: 1 }], // oo
		[{ x: 0, y: 0} , { x: 1, y: 0 }, { x: 1, y:-1 }, { x: 2, y:-1 }]  //  oo
	], [
		[{ x: 0, y: 0} , { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y:-1 }], //  oo
		[{ x: 0, y: 0} , { x:-1, y:-1 }, { x: 0, y:-1 }, { x: 1, y: 0 }]  // oo
	], [
		[{ x: 0, y: 0} , { x:-1, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], // oooo
		[{ x: 0, y: 0} , { x: 0, y:-1 }, { x: 0, y: 1 }, { x: 0, y: 2 }]
	], 
]

const nextPiece = () => ({
	x:        2, 
	y:        2,
	rotation: 0,
	type:     rnd(len(pieceTypes))
})

const setRefreshRate = () => state.refreshId || window.setInterval(drawFrame, RATE)

const gravityFall = () => nextState(DOWN) 

const setGravity = (onStart = false) => {
	if (state.gravityId != null) {
		clearInterval(state.gravityId)
	}

	if (onStart) {
		return window.setInterval(gravityFall, FALL)
	}

	return window.setInterval(gravityFall, state.speed)
}

const incGravity = () => {
	if (state.score >= state.level) {
		state.level++;
		state.speed = max(state.speed - 60, RATE);
		state.gravityId = setGravity();
	}
}

const initState = () => ({
	over:  false,
	score: 0,
	level: 1,
	board: matrix(ROWS, COLS),
	speed: FALL,
	piece: nextPiece(),
	nxtPiece: nextPiece(),
	gravityId: setGravity(true),
	refreshId: setRefreshRate()
})

// View
const score = document.getElementById('score')
const canvas = document.getElementById('board')
const ctx = canvas.getContext('2d')

const updScore = () => {
	score.textContent = (state.score + ' pt')
	
	incGravity();
}

const newPos = (i, j) => ([5 + 40*j, 5 + 40*i, 35, 35])

const adjIdx = (i, j) => k => ({ x: k.x + i, y: k.y + j })

const nextPos = (t, r, x, y) => (map(pieceTypes[t][r], adjIdx(x, y)))

const drawBoard = (a, n = 0) => {
	if (n < SIZE) {
		const i = div(n, COLS)
		const j = n % COLS

		if (a[n]) {
			ctx.fillRect(...newPos(i, j))
		}

		drawBoard(a, n+1)
	}
}

const drawPiece = (p) => {
	const relPos = nextPos(p.type, p.rotation, p.x, p.y)
	
	each(relPos, (p, i) => ctx.fillRect(...newPos(p.x, p.y)))
}

const drawFrame = () => {
	const field = flatten(matrix(ROWS, COLS, true))
	const board = flatten(state.board)

	if (state.over) {
		state.over = false

		ctx.fillStyle = RED // red all board
		drawBoard(field) 
	} else {
		ctx.fillStyle = BLK // clean board
		drawBoard(field)

		ctx.fillStyle = WHT // draw the dead pieces
		drawBoard(board)

		ctx.fillStyle = GRN // draw current pieces
		drawPiece(state.piece)

		updScore()
	}
}

// Controller
const inLimits = (i, j) => (j >= 0 && j < COLS && i >= 0 && i < ROWS)

const hitWall = (i, j) => (j < 0 || j >= COLS)

const hitFloor = (i, j) => (i < 0 || i >= ROWS)

const hitBlock = (i, j) => (inLimits(i, j) && state.board[i][j])

const cntWall = (pos) => len(filter(pos, k => hitWall(k.x, k.y)))

const cntFloor = (pos) => len(filter(pos, k => hitFloor(k.x, k.y)))

const cntBlock = (pos) => len(filter(pos, k => hitBlock(k.x, k.y)))

const killPiece = (i, j) => (state.board[i][j] = true)

const endGame = () => (state.piece.x == 2 && state.piece.y == 2)

const isTrue = (x) => (x)

const chckRows = ([x, ...xs]) => def(x)
	? len(filter(x, isTrue)) == COLS 
		? [...chckRows(xs)] 
		: [x, ...chckRows(xs)]
	: []

const clnBoard = () => {
	state.board = chckRows(state.board)
	
	const curLen = len(state.board)
	const m = matrix(ROWS - curLen, COLS)
	const n = len(m)
	
	state.board = concat(m, state.board)

	if (n > 0) {
		state.score += n
	}
}

const onHit = (pos) => {
	if (!endGame()) {
		each(pos, k => killPiece(k.x, k.y))
		clnBoard()
		state.piece = state.nxtPiece
		state.nxtPiece = nextPiece()
	} else {
		state = initState()
		state.over = true
	}
}

const getHits = (pos) => ({
	wall:  cntWall(pos),
	floor: cntFloor(pos),
	block: cntBlock(pos)
})

const nextState = (act) => {
	const p = state.piece

	if (act == TURN) {
		const nextRot = (p.rotation + 1) % len(pieceTypes[p.type])
		const nxtPos  = nextPos(p.type, nextRot, p.x, p.y)
		const hits    = getHits(nxtPos)

		if (!hits.block && !hits.floor && !hits.wall){
			state.piece.rotation = nextRot
		}
	} else {
		const newX    = p.x + act.x
		const newY    = p.y + act.y
		const curPos  = nextPos(p.type, p.rotation, p.x, p.y)
		const nxtPos  = nextPos(p.type, p.rotation, newX, newY)
		const hits    = getHits(nxtPos)

		if (hits.floor || (hits.block && act == DOWN)) {
			onHit(curPos)
		} else if (!hits.wall && !hits.block){
			state.piece.x = newX
			state.piece.y = newY
		}
	}
}

const updState = (event) => {
	switch (event.key) {
		case 'a': case 'A': case 'ArrowLeft':  nextState(LEFT);  break;
		case 's': case 'S': case 'ArrowDown':  nextState(DOWN);  break;
		case 'd': case 'D': case 'ArrowRight': nextState(RIGHT); break;
		case 'w': case 'W': case 'ArrowUp':    nextState(TURN);  break;
	}
}

const init = () => {
	window.addEventListener('keydown', updState)

	state = initState();
}

init()
