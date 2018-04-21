// return if something is defined
const def     = x => typeof x !== 'undefined'

// return if something is not defined
const undef   = x => !def(x);

// return the head of the array
const head    = ([x]) => x;

// return the tail of the array
const tail    = ([x, ...xs]) => xs;

// return a new array with the results of calling a provided function on every element
const map     = ([x, ...xs], fn) => def(x) ? [fn(x), ...map(xs, fn)] : [];

// return a new array with all elements that pass the test implemented by the provided function
const filter  = ([x, ...xs], fn) => def(x) 
	? fn(x)
		? [x, ...filter(xs, fn)]
		: [...filter(xs, fn)]
	: [];

// return a new array with all elements that fails the test implemented by the provided function
const reject  = ([x, ...xs], fn) => def(x)  
	? fn(x)
		? [...filter(xs, fn)]
		: [x, ...filter(xs, fn)]
	: [];

// return if the object is an array
const isArray = xs => Array.isArray(xs)

// make a copy of the array
const copy    = xs => [...xs];

// find the lenght of the array
const len     = ([x, ...xs]) => def(x) ? 1 + len(xs) : 0;

// reverse the array
const rev     = ([x, ...xs]) => def(x) ? [...rev(xs), x] : [];

// create a new array with the first n elements
const first   = ([x, ...xs], n = 1) => def(x) && n ? [x, ...first(xs, n - 1)] : [];

// create a new array with the last n elements
const last    = (xs, n = 1) => rev(first(rev(xs), n));

// insert in a array in the index an element
const slice   = ([x, ...xs], i, y, curr = 0) => def(x)
  ? curr === i
    ? [y, x, ...slice(xs, i, y, curr + 1)]
    : [x, ...slice(xs, i, y, curr + 1)]
  : [];

// split the array in two, one passing the condition and the rest
const divide  = (xs, fn) => [filter(xs, fn), reject(xs, fn)];

// make an matrix an array
const flatten = ([x, ...xs]) => def(x)
	? isArray(x) 
		? [...flatten(x), ...flatten(xs)] 
		: [x, ...flatten(xs)]
	: [];

// Applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single value
const reduce  = ([x, ...xs], fn, acc, i = 0) => def(x)
	? reduce(xs, fn, fn(acc, x, i), i + 1) 
	: acc;

// Extract property value from array. Useful when combined with the map function
const pluck   = (key, object) => object[key];

// Each function consumes the return value of the function that came before
const flow = (...args) => init => reduce(args, (memo, fn) => fn(memo), init);

// Reverse of flow ex: compose(tax, discount, getPrice) -> (x => tax(discount(getPrice(x))))
const compose = (...args) => flow(...reverse(args))

// Util
const rnd = Math.random;

const div = (x, y) => Math.floor(x/y);

const sumVector = ([x, ...xs], [y, ...ys]) => def(x) && def(y)
	? [x + y, ...sumVector(xs, ys)]
	: [];

// Model
let state; // the current state of the game

const game  = {
	rows:     16,
	columns:   8,
	size:    127
}; 

const LEFT  = { x:  0, y: -1 };
const DOWN  = { x:  1, y:  0 };
const RIGHT = { x:  0, y:  1 };
const TURN  = {};

const pieceTypes = [
	[
		[
			[0, 0, 1, 0],
			[0, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		],[
			[0, 0, 1, 0],
			[0, 0, 1, 1],
			[0, 0, 1, 0],
			[0, 0, 0, 0]
		],[
			[0, 0, 0, 0],
			[0, 1, 1, 1],
			[0, 0, 1, 0],
			[0, 0, 0, 0]
		],[
			[0, 0, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 0]
		]
	], [
		[
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		],[
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		],[
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		],[
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		],
	], [
		[
			[0, 1, 0, 0],
			[0, 1, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 0]
		],[
			[0, 0, 0, 0],
			[0, 0, 1, 1],
			[0, 1, 1, 0],
			[0, 0, 0, 0]
		],[
			[0, 1, 0, 0],
			[0, 1, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 0]
		],[
			[0, 0, 0, 0],
			[0, 0, 1, 1],
			[0, 1, 1, 0],
			[0, 0, 0, 0]
		]
	], [
		[
			[0, 0, 1, 0],
			[0, 1, 1, 0],
			[0, 1, 0, 0],
			[0, 0, 0, 0]
		],[
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 0, 1, 1],
			[0, 0, 0, 0]
		],[
			[0, 0, 1, 0],
			[0, 1, 1, 0],
			[0, 1, 0, 0],
			[0, 0, 0, 0]
		],[
			[0, 0, 0, 0],
			[0, 1, 1, 0],
			[0, 0, 1, 1],
			[0, 0, 0, 0]
		]
	], [
		[
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		],[
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0]
		],[
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		],[
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0]
		]
	]
];

const nextPiece = () => {
	return {
		position: { x: 2, y: 2 },
		rotation: 0,
		type: rnd() % len(pieceTypes)
	};
};

// TODO: not functional enough
const matrix = (n, m) => {
	var row = new Array (n);
	return map(row, x => x = new Array (m));
};

const initState = () => {
	return {
		score: 0,
		board: matrix(game.rows, game.columns),
		currentPiece: nextPiece()
	};
};

// View
const score  = document.getElementById('score');
const canvas = document.getElementById('board');
const ctx    = canvas.getContext('2d');

const updateScore = () => score.textContent = (state.score + 'pt');

const newPos = (i, j) => [5 + 40*j, 5 + 40*i, 35, 35];

const inLimits = (i, j) => (i >= 0 && j >= 0 && i < game.rows && j < game.columns);

const fill = (a, fn, n, max) => {
	if (n >= 0) {
		const i = n % max;
		const j = div(n, max);

		if (fn(a[n])) {
			ctx.fillRect(...newPos(i, j));
		}

		fill(a, fn, n-1, max);
	}
};

const drawFrame = () => {
	const board = flatten(state.board);

	// clean board
	ctx.fillStyle = "rgb(51, 51, 51)";
	fill(board, x => true, game.size, game.rows);

	// draw the dead pieces
	ctx.fillStyle = "rgb(255, 255, 255)";
	fill(board, x => x, game.size, game.rows);

	// draw current pieces
	var i = state.currentPiece.position.x;
	var j = state.currentPiece.position.y;
	ctx.fillStyle = "rgb(127, 255, 127)";
	ctx.fillRect(...newPos(i, j));
};

// Controller
const nextState = (action) => {
	console.log(state.currentPiece.position);
	if (action == TURN) {
		state.currentPiece.rotation = (state.currentPiece.rotation + 1) % len(pieceTypes);
	} else {
		var x = state.currentPiece.position.x + action.x;
		var y = state.currentPiece.position.y + action.y;
		
		if (inLimits(x, y)) {
			state.currentPiece.position = { x: x, y: y };
		}
	}
};

const changeState = (event) => {
	switch (event.key) {
		case 'a': case 'A': case 'ArrowLeft':
			nextState(LEFT);
			break;

		case 's': case 'S': case 'ArrowDown':
			nextState(DOWN);
			break;

		case 'd': case 'D': case 'ArrowRight':
			nextState(RIGHT);
			break;

		case 'w': case 'W': case 'ArrowUp':
			nextState(TURN);
			break;
	}
}

const listenKeys = (fn) => window.addEventListener('keydown', fn);

const refresh = () => {
	// invert y axis of canvas
	// ctx.transform(1, 0, 0, -1, 0, canvas.height)

	// print the score of the game
	updateScore();

	// draw the init game
	drawFrame();
};

const gravity = () => nextState(DOWN);

const tetris = () => {
	// init the state of the game
	state = initState();

	// Start listening for keystrokes
	window.addEventListener('keydown', changeState);

	// Start refreshing the canvas every 100ms
	const refreshId = window.setInterval(refresh, 100);

	// Current Piece goes down every 1s
	const gravityId = window.setInterval(gravity, 1000);
}

tetris();