const extensible = document.getElementById('extensible');
const fileButton = document.getElementById('fileUpload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let currentImg = null;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

document.getElementById('UploadButton').addEventListener('click', () => {
    fileClick();
});

function fileClick(){
    document.getElementById('fileUpload').click();
}

fileButton.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () =>  {
        currentImg = img;
        zoom =1;
        offsetX= 0;
        offsetY = 0;
        drawCanvasImgae();
        extensible.classList.remove('not-visible');
    };
    img.src = URL.createObjectURL(file);
});


function drawCanvasImgae(){
    if (!currentImg) return;
    const escala = Math.min(
        canvas.width / currentImg.width,
        canvas.height / currentImg.height
    );

    let escalaFinal = escala * zoom;

    const anchoFinal = currentImg.width * escalaFinal;
    const altoFinal = currentImg.height * escalaFinal;

    const x = (canvas.width - anchoFinal) / 2 + offsetX;
    const y = (canvas.height - altoFinal) / 2 + offsetY;
    

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentImg, x, y, anchoFinal, altoFinal);
}

canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    const zoomStep = 0.05;
    if (event.deltaY < 0){
        zoom += zoomStep;
    } else {
    zoom -= zoomStep;
    }

    zoom = Math.max(0.1, zoom);

    drawCanvasImgae();
});

canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
});

canvas.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;

    offsetX += deltaX;
    offsetY += deltaY;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    drawCanvasImgae();
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});