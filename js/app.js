let img = new Image();
let frameImg = new Image();
frameImg.src = 'twibbon.png'; // Update with your frame image path
let displayCanvas, displayCtx, canvas, ctx;
let isDragging = false;
let startX, startY;
let imgX = 0, imgY = 0;
let imgScale = 1;
let initialDistance = 0;

function generateTwibbon() {
const output = document.getElementById('output');
const fileInput = document.getElementById('fileInput');
canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
displayCanvas = document.getElementById('displayCanvas');
displayCtx = displayCanvas.getContext('2d');

const file = fileInput.files[0];
if (file) {
const reader = new FileReader();
reader.onload = function(e) {
img.onload = function() {
drawImage();
};
img.src = e.target.result;
};
reader.readAsDataURL(file);

// Add event listeners for repositioning the image
displayCanvas.addEventListener('mousedown', startDragging);
displayCanvas.addEventListener('mousemove', dragImage);
displayCanvas.addEventListener('mouseup', stopDragging);
displayCanvas.addEventListener('mouseout', stopDragging);
displayCanvas.addEventListener('wheel', resizeImage);

// Add touch event listeners for mobile devices
displayCanvas.addEventListener('touchstart', startDragging);
displayCanvas.addEventListener('touchmove', dragImage);
displayCanvas.addEventListener('touchend', stopDragging);
displayCanvas.addEventListener('touchmove', handlePinch);
} else {
// alert('Please upload an image file.');
  output.innerHTML += "Silahkan unggah file gambar!";
}
}

function drawImage() {
// Calculate scale ratio between display and actual canvas
const scale = displayCanvas.width / canvas.width;

// Draw on the actual canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(img, imgX, imgY, img.width * imgScale, img.height * imgScale);
ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

// Draw on the display canvas
displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
displayCtx.drawImage(canvas, 0, 0, canvas.width * scale, canvas.height * scale);
}

function getOffset(event) {
if (event.touches) {
const touch = event.touches[0];
return {
x: touch.clientX - displayCanvas.getBoundingClientRect().left,
y: touch.clientY - displayCanvas.getBoundingClientRect().top
};
}
return {
x: event.offsetX,
y: event.offsetY
};
}

function startDragging(event) {
const scale = canvas.width / displayCanvas.width;
const offset = getOffset(event);
isDragging = true;
startX = offset.x * scale - imgX;
startY = offset.y * scale - imgY;
if (event.touches && event.touches.length === 2) {
initialDistance = getDistance(event.touches);
}
event.preventDefault(); // Prevent scrolling on touch devices
}

function dragImage(event) {
if (isDragging) {
const scale = canvas.width / displayCanvas.width;
const offset = getOffset(event);
imgX = offset.x * scale - startX;
imgY = offset.y * scale - startY;
drawImage();
event.preventDefault(); // Prevent scrolling on touch devices
}
}

function stopDragging(event) {
isDragging = false;
}

function resizeImage(event) {
if (event.deltaY < 0) {
imgScale *= 1.1;
} else {
imgScale /= 1.1;
}
drawImage();
event.preventDefault(); // Prevent zooming on touch devices
}

function handlePinch(event) {
if (event.touches.length === 2) {
const currentDistance = getDistance(event.touches);
if (initialDistance > 0) {
const scaleChange = currentDistance / initialDistance;
imgScale *= scaleChange;
initialDistance = currentDistance;
drawImage();
}
event.preventDefault(); // Prevent scrolling on touch devices
}
}

function getDistance(touches) {
const dx = touches[0].clientX - touches[1].clientX;
const dy = touches[0].clientY - touches[1].clientY;
return Math.sqrt(dx * dx + dy * dy);
}

function downloadImage() {
const link = document.createElement('a');
link.download = 'twibbon.png';
link.href = canvas.toDataURL('image/png');
link.click();
}
