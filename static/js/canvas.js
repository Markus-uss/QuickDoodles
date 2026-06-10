// canvas elements
const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');
const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
const toolbarOffsetY = toolbar.offsetTop;

// timer variables
const time_display = document.getElementById('timer')
const frames = document.getElementById('frames').innerText;
var time = document.getElementById('timer').innerText.split(" ")[0];
const start_time = time
const fps = time / frames;
let countdown_started = false

// popup elements
const popup_display = document.getElementById('popup-1')
const popup_content = document.getElementById('content')

// images and gif holders
var gif_preview = document.getElementById('gif_preview')
var image
var image_list = new Array();
var gif

// update visual timer
function changeTime(text) {
    time_display.innerHTML = text
}

// save current image to compile into gif
function saveImage() {
    image = canvas.toDataURL("QuickDoodle/png", 0.3);
    image_list.push(image)
}

// Creates gif and reveals preview
function togglePopup() {
    gifshot.createGIF({
        'images': image_list,
        'sampleInterval': 1,
        'numWorkers': 2,
        'numFrames': frames,
        'interval': 0.1,
        // 'gifHeight': canvas.height / 2,
        // 'gifWidth': canvas.width / 2
        },function(obj) {
        if(!obj.error) {
            gif = obj.image;
            gif_preview.src = gif;
        }
    });
    popup_display.classList.toggle("active");
}

// Changes time to infinite if there is no timer set.
if (time == -1) {
    changeTime('∞ Seconds');
}

// Timer function that triggers popup when timer is finished
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

// Canvas setup
canvas.width = window.innerWidth - canvasOffsetX - 4;
canvas.height = window.innerHeight - toolbarOffsetY + 80;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let isPainting = false;
let lineWidth = 20;
ctx.lineWidth = 20

// Tracks when user clicks on the ui buttons and executes its function
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
        if (time == 0) {
            togglePopup()
        }
        else {
            time = 1
        }
    }
});

// Tracks actions performed on popup to either add more time or download gif.
popup_content.addEventListener('click', e => {
    if (e.target.id === 'continue') {
        time += parseInt(start_time);
        if (time == start_time) {
            countdown();
        }
        togglePopup();
    }

    if (e.target.id === 'render') {
        var link = document.createElement('a');
        link.download = "QuickDoodle.gif";
        link.href = gif;
        link.click();   
    }
})

// Tracks when the line color or line width is change and updates accordingly.
toolbar.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if(e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
        ctx.lineWidth = lineWidth;
    }
    
});

// Creates stroke paths according to mouse position
const draw = (e) => {
    if(!isPainting) {
        return;
    }

    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.moveTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();
}

// Stops the function above and resets the stroke path.
function stopDrawing() {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
}

// Creates event listeners that help the mouse draw and starts countdown upon drawing
canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    if (!countdown_started) {
        countdown_started = true
        countdown(time)
    }
});

['mouseup', 'mouseleave'].forEach(event =>
    canvas.addEventListener(event, stopDrawing)
);

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});