const extensible = document.getElementById('extensible');
const fileButton = document.getElementById('fileUpload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let currentShape = 'square';
let borderThickness = 0;
let borderRadius = 0; 
let borderColor = '#000000';

let shadowX = 0;
let shadowY = 0;
let shadowBlur = 0;
let shadowOpacity = 0.8;
let shadowColorValue = '#000000';

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

function tracePath(x, y, w, h, shape, radius) {
    ctx.beginPath();

    if (shape === 'circle'){
        const r = Math.min(w, h) / 2;
        ctx.arc(x + w / 2, y + h / 2, r, 0, Math.PI * 2);
    } else if (shape === 'rounded'){
        ctx.roundRect(x, y, w, h, radius)
    } else if (shape === 'hexagon'){
        const cx = x + w /2;
        const cy = y + h /2;
        const r = Math.min(w, h) / 2;
        for (let i = 0; i < 6; i++){
            const angle = (Math.PI / 3) * 1 - Math.PI / 2;
            const px = cx + r * Math.cos(angle);
            const py = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.moveTo(px, py)
        } 
    } else {
        ctx.rect(x, y, w, h);
    }
}

function fileClick(){
    document.getElementById('fileUpload').click();
}

function drawCanvasImgae(){
    if (!currentImg) return;
    const escala = Math.min(
        canvas.width / currentImg.width,
        canvas.height / currentImg.height
    );

    let escalaFinal = escala * zoom;

    const borderX = imgX - borderThickness;
    const borderY = imgY - borderThickness;
    const borderW = imgW + 2 * borderThickness;
    const borderH = imgH + 2 * borderThickness;

    const imgW = currentImg.width * escalaFinal;
    const imgH = currentImg.height * escalaFinal;
    const imgX = (canvas.width - imgW) / 2 + offsetX;
    const imgY = (canvas.height - imgH) / 2 + offsetY;

    if (borderThickness > 0){
        ctx.save();

        ctx.shadowColor = hexToRgba(shadowColorValue, shadowOpacity);
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = shadowX;
        ctx.shadowOffsetY = shadowY;

        tracePath(borderX, borderY, borderW, borderH,  currentShape, borderRadius);
        ctx.fillStyle = borderColor;
        ctx.fill();

        ctx.restore();
    }

    ctx.save();
    tracePath(imgX, imgY, imgW, imgH, currentShape, borderRadius);
    ctx.clip();
    ctx.drawImage(currentImg, imgX, imgY, imgW, imgH);
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

function hexToRgba(hex, opacityPercent){
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacityPercent / 100})`;
}