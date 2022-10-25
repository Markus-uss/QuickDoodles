const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const time_display = document.getElementById('timer')
var time = document.getElementById('timer').innerText.split(" ")[0];
const start_time = time
const frames = document.getElementById('frames').innerText;
const popup_display = document.getElementById('popup-1')
const popup_content = document.getElementById('content')
const fps = time / frames;
const ctx = canvas.getContext('2d');

var image_list = new Array();

function changeTime(text) {
    time_display.innerHTML = text
}

function saveImage() {
    image = canvas.toDataURL("image/png", 1.0);
    image_list.push(image)
}

function togglePopup() {
    popup_display.classList.toggle("active");
}

if (time == -1) {
    changeTime('∞ Seconds');
}

function countdown() {
    setTimeout(function(){
        if (time % fps == 0) {
            saveImage()
        }
        if (time > 0) {
            time--;
            changeTime(time + ' Seconds');
            countdown();
        }
        else {
            if (!popup_display.classList[1] && time != -1) {
                togglePopup()
            }
        }
    }, 1000)
}

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
        image = canvas.toDataURL("QuickDoodle/png", 1.0).replace("QuickDoodle/png", "image/octet-stream");
        var link = document.createElement('a');
        link.download = "QuickDoodle.png";
        link.href = image;
        link.click();   
    }  
    else if (e.target.id === 'finalize') {
        saveImage()
    }
});

popup_content.addEventListener('click', e => {
    if (e.target.id === 'continue') {
        time += parseInt(start_time);
        if (time == start_time) {
            countdown();
        }
        togglePopup();
    }

    if (e.target.id === 'render') {
        console.log('rendering')
    }
})

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

countdown(time)