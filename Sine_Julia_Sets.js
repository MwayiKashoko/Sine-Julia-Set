const canvas = document.getElementById("canvas");
const graphics = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const num = document.getElementById("num");
const real = document.getElementById("real");
const complex = document.getElementById("complex");
const click = document.getElementById("click");
const pi = Math.PI

let translatedX = 0;
let translatedY = 0;

let mouseX = 0;
let mouseY = 0;

let scale = 1;
const scalingFactor = width/(6*pi);

let imageData = graphics.createImageData(width, height);

const getMousePos = (evt) => {
	const rect = canvas.getBoundingClientRect();

	return {
		x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
		y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
	};
}

canvas.addEventListener("click", function(mouse) {
	let m = getMousePos(mouse);
	let mouseX = m.x;
	let mouseY = m.y;

	if (click.checked) {
		translatedX = 0;
		translatedY = 0;
		scale = 1;

		real.value = (mouseX-width/2)/(scalingFactor);
		complex.value = (mouseY-height/2)/(scalingFactor);

		juliaSetDraw((mouseX-width/2)/(scalingFactor), (mouseY-height/2)/(scalingFactor), num.value);
	} else {
		mouseX = (mouseX-width/2)/(scalingFactor);
		mouseY = (mouseY-height/2)/(scalingFactor);

		translatedX += mouseX/scale;
		translatedY += mouseY/scale;

		scale *= 2;

		juliaSetDraw(parseFloat(real.value), parseFloat(complex.value), parseInt(num.value));
	}
});

function hslToRgb(h, s, l) {
  	let r, g, b;

  	if (s === 0) {
    	r = g = b = l;
  	} else {
    	let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    	let p = 2 * l - q;

    	r = Math.round(255 * (q < 1 ? q * q * 6 : (q - 1) * (q - 1) * 6 + 1));
    	g = Math.round(255 * (p < 1 ? p * p * 6 : (p - 1) * (p - 1) * 6 + 1));
    	b = Math.round(255 * (q < 1 ? (1 - q) * q * 6 : (1 - q) * (1 - q) * 6 + 1));
  	}

  	return [r, g, b];
}

function juliaSetDraw(real, imaginary, iterations) {
	graphics.clearRect(0, 0, width, height);

	//multiply by 4 in order to get the scaling right
	for (let i = 0; i <= width; i++) {
		for (let j = 0; j <= height; j++) {
			let x = ((i-width/2)/scalingFactor)/scale + translatedX;
			let y = ((j-height/2)/scalingFactor)/ scale + translatedY;

			let k = 0;

			const re = real;
			const im = imaginary;

			while (Math.abs(y) < 50 && k < iterations) {
				let x_new = re*Math.sin(x)*Math.cosh(y) - im*Math.sinh(y)*Math.cos(x);
				y = re*Math.sinh(y)*Math.cos(x) + im*Math.sin(x)*Math.cosh(y);

				x = x_new;

				k++;
			}

			if (k < iterations) {
				let index = (i + j * imageData.width) * 4;

				let rgb = hslToRgb((k/iterations*360)**1.5%360, 50, k/iterations*100);
				
				imageData.data[index] = rgb[2];
				imageData.data[index+1] = rgb[0];
				imageData.data[index+2] = rgb[1];
				imageData.data[index+3] = k*2;
			} else {
				let index = (i + j * imageData.width) * 4;
				
				imageData.data[index] = 255;
				imageData.data[index+1] = 255;
				imageData.data[index+2] = 255;
				imageData.data[index+3] = 255;
			}
		}
	}

	graphics.putImageData(imageData, 0, 0);
}

//1 + .3i
juliaSetDraw(parseFloat(real.value), parseFloat(complex.value), parseInt(num.value));
