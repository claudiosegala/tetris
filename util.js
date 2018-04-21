// Util
const rnd = (n) => Math.floor(Math.random() * n);

const abs = (x) => x > 0 ? x : -x

// return the signal of the number
const snl = (x) => x > 0 ? 1 : -1

const div = (x, y) => snl(x) * snl(y) * Math.floor(abs(x)/abs(y))

const sumVector = ([x, ...xs], [y, ...ys]) => def(x) && def(y)
	? [x + y, ...sumVector(xs, ys)]
	: [];