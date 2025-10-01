const cvs = document.getElementById("cvs");
const ctx = cvs.getContext("2d");
cvs.width = window.innerWidth;
cvs.height = window.innerHeight;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, duration) {
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
	array = [];
	size = cSize;
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
	highest = size;
	keepInMind = [];
	requestAnimationFrame(update);
}

var checking = 0;

var highest = size;

start();

function doTheCool(i) {
	playTone(10 * array[i] * 300 / size, 2);
	ctx.fillStyle = 'rgb(0, 255, 0)';
	ctx.fillRect(i * cvs.width / size, cvs.height - array[i] / size * cvs.height, cvs.width / size, array[i] / size * cvs.height)
	setTimeout(() => {
		if (i < size - 1) {
			doTheCool(i + 1)
		} else {
			setTimeout(() => { start() }, 250);
		}
	}, 10)
}

var keepInMind = [];

var tries = 0;

const times = 4

function update() {
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
	if (checking == 0) {
		if (array[0] > array[1]) {
			let temp = array[0];
			array[0] = array[1];
			array[1] = temp;
		}
	} else if (checking == size - 1) {
		if (array[size - 1] < array[size - 2]) {
			let temp = array[size - 1];
			array[size - 1] = array[size - 2];
			array[size - 2] = temp;
		} else {
			highest--;
		}
	} else {
		if (array[checking] > array[checking + 1]) {
			let temp = array[checking];
			array[checking] = array[checking + 1];
			array[checking + 1] = temp;
		} else if (array[checking] < array[checking - 1]) {
			let temp = array[checking];
			array[checking] = array[checking - 1];
			array[checking - 1] = temp;
		} else if (checking == highest - 1) {
			highest--;
		} else {
			if (!keepInMind.includes(checking)) {
				keepInMind.push(checking);
			}
		}
	}
	playTone(10 * array[checking] * 300 / size, 2);
	checking++;
	if (checking >= highest) {
		if (keepInMind.length == 0) {
			checking = 0;
		} else {
			checking = keepInMind[keepInMind.length - 1];
		}
		keepInMind.pop();
	}
	if (highest <= 1) {
		let tempArray = [...array];
		tempArray.sort((a, b) => a - b);
		if (areArraysEqual(array, tempArray)) {
			doTheCool(0);
			console.log("done", tries);
		} else {
			if (tries % times == 0) {
				setTimeout(update, 1);
			} else {
				update();
			}
		}
	} else {
		if (tries % times == 0) {
			setTimeout(update, 1);
		} else {
			update();
		}
	}
}