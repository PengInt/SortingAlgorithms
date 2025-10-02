const cvs = document.getElementById("cvs");
const ctx = cvs.getContext("2d");
cvs.width = window.innerWidth;
cvs.height = window.innerHeight;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, duration) {
	if (frequency >= 501) {
		console.warn("WHY THE EVERLIVING FUCK IS THE FREQUENCY", frequency)
	}
	// create Oscillator node
	var oscillator = audioCtx.createOscillator();
	
	oscillator.type = 'square';
	oscillator.frequency.value = frequency; // value in hertz
	oscillator.connect(audioCtx.destination);
	oscillator.start();
	
	setTimeout(
		function() {
			oscillator.stop();
		}, duration);
}

var tries = 0;

var times = 0.5

const areArraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
	return false;
  }
  return arr1.every((element, index) => element === arr2[index]);
};

var array = [];

var cSize = 4;
var size = cSize;

function start() {
	times *= 2;
	if (times > 16) {
		times = 16;
	}
	array = [];
	size = cSize;
	if (size == 0) {
		console.warn("WHAT THE FUCK")
		return;
	}
	for (let i = 1; i <= size; i++) {
		array.push(i);
	}

	let currentIndex = array.length;
	let randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex !== 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
		  array[randomIndex],
		  array[currentIndex],
		];
	}

	cSize *= 2;
	checking = 0
	tries = 0;
	highest = 0;
	keepInMind = [...array].sort((a, b) => a - b);
	requestAnimationFrame(update);
}

var checking = 0;

var highest = size;

var keepInMind = [];

function nextN(n) {
	return keepInMind.sort((a, b) => a - b)[0]
}

start();

function doTheCool(i) {
	playTone(100 + array[i] * 300 / size, 2);
	ctx.fillStyle = 'rgb(0, 255, 0)';
	ctx.fillRect(i * cvs.width / size, cvs.height - array[i] / size * cvs.height, cvs.width / size, array[i] / size * cvs.height)
	if (i % times == 0) {
		setTimeout(() => {
			if (i < size - 1) {
				doTheCool(i + 1);
			} else {
				setTimeout(() => { start() }, 250);
			}
		}, 10);
	} else {
		if (i < size - 1) {
			doTheCool(i + 1);
		} else {
			setTimeout(() => { start() }, 250);
		}
	}
}

function swap(i, j) {
	let temp = array[i];
	array[i] = array[j];
	array[j] = temp;
	return;
}

function remove(n) {
	keepInMind.splice(keepInMind.indexOf(n), 1);
}

function update() {
	let didntDoAnything = true;
	tries++;
	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.fillRect(0, 0, cvs.width, cvs.height);
	for (let i = 0; i < array.length; i++) {
		ctx.fillStyle = 'rgb(255, 255, 255)';
		if (i == checking) {
			ctx.fillStyle = 'rgb(255, 0, 0)';
		}
		ctx.fillRect(i * cvs.width / size, cvs.height - array[i] / size * cvs.height, cvs.width / size, array[i] / size * cvs.height);
	}
	if (array[checking] != checking + 1) {
		playTone(100 + array[checking] * 300 / size, 2);
		remove(array[checking]);
		swap(checking, array[checking] - 1);
		playTone(100 + array[checking] * 300 / size, 2);
		didntDoAnything = false;
	}
	console.warn(didntDoAnything)
	if (didntDoAnything) {
		remove(array[checking]);
	}
	if (size == 0) {
		console.warn("WHAT THE FUCK")
	}
	if (didntDoAnything) {
		checking = nextN(checking + 1) - 1;
	}
	let tempArray = [...array];
	tempArray.sort((a, b) => a - b);
	if (areArraysEqual(array, tempArray)) {
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillRect(0, 0, cvs.width, cvs.height);
		for (let i = 0; i < array.length; i++) {
			ctx.fillStyle = 'rgb(255, 255, 255)';
			if (i == checking) {
				ctx.fillStyle = 'rgb(255, 0, 0)';
			}
			ctx.fillRect(i * cvs.width / size, cvs.height - array[i] / size * cvs.height, cvs.width / size, array[i] / size * cvs.height);
		}
		doTheCool(0);
		console.log("done", tries);
	} else {
		if (tries % times == 0) {
			setTimeout(update, 1);
		} else {
			update();
		}
	}
}