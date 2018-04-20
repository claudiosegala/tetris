// Functional Stuff
const adjust    = n => f => xs => mapi(x => i => i == n ? f(x) : x)(xs)
const dropFirst = xs => xs.slice(1)
const dropLast  = xs => xs.slice(0, xs.length - 1)
const id        = x => x
const k         = x => y => x
const map       = f => xs => xs.map(f)
const mapi      = f => xs => xs.map((x, i) => f(x)(i))
const merge     = o1 => o2 => Object.assign({}, o1, o2)
const mod       = x => y => ((y % x) + x) % x // http://bit.ly/2oF4mQ7
const objOf     = k => v => { var o = {}; o[k] = v; return o }
const pipe      = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)
const prop      = k => o => o[k]
const range     = n => m => Array.apply(null, Array(m - n)).map((_, i) => n + i)
const rep       = c => n => map(k(c))(range(0)(n))
const rnd       = min => max => Math.floor(Math.random() * max) + min
const spec      = o => x => Object.keys(o)
  .map(k => objOf(k)(o[k](x)))
  .reduce((acc, o) => Object.assign(acc, o))

// Current State of the game
let state = {
	score: 0,
	board: initBoard()
};

// Const
const LEFT  = { x: -1, y:  0 };
const DOWN  = { x:  0, y: -1 };
const RIGHT = { x:  1, y:  0 };
const TURN  = {};

const game  = {
	rows:    16,
	columns: 32,
}; 

// html
const score  = document.getElementById('score');
const canvas = document.getElementById('board');
const cntxt  = canvas.getContext('2d');

function initBoard () {
	var matrix = new Array (9);
	fp.
	matrix.
	return {
		score: 0,
		board: {
			rows_n:    16,
			columns_n: 32,
			rows: [],
		}
	};
}

function changeState (event) {
	switch (event.key) {
		case 'a': case 'A': case 'ArrowLeft':
			nextState(LEFT) 
			break;

		case 's': case 'S': case 'ArrowDown':
			nextState(DOWN) 
			break;

		case 'd': case 'D': case 'ArrowRight':
			nextState(RIGHT) 
			break;

		case 'w': case 'W': case 'ArrowUp':
			nextState(TURN) 
			break;
	}
}

function tetris () {

	// Start listening for keystrokes
	window.addEventListener('keydown', changeState);

	//
}

tetris();