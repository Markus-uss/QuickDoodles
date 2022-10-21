const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');
var image_list = new Array();

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
const toolbarOffsetY = toolbar.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX - 4;
canvas.height = window.innerHeight - toolbarOffsetY + 80;

if (window.innerHeight <= 146) {
    console.log("too small")
    ctx.font = "20px Arial";
    ctx.fillText("Too Small!!! Please expand your browser and reload", 10, 50);
} 

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    else if (e.target.id === 'save') {
        image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
        var link = document.createElement('a');
        link.download = "my-image.png";
        link.href = image;
        link.click();   
    }  
    else if (e.target.id === 'finalize') {
        console.log('done')
        image = canvas.toDataURL("image/png", 1.0);
        image_list.push(image)
        console.log(image_list)
    }
});

toolbar.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if(e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
    
});

const draw = (e) => {
    if(!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);
