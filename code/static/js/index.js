// Canvas
// Initalize 

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
canvas.height = 290;
canvas.width = 290;
const rect = canvas.getBoundingClientRect();

let snapshot;
var draw_phase = false;
var radioBtns1 = document.getElementsByName("shape");


let canvas2 = document.getElementById("canvas2");
let context2 = canvas2.getContext("2d");
canvas2.height = 290;
canvas2.width = 290;
const rect2 = canvas2.getBoundingClientRect();

let snapshot2;
var draw_phase2 = false;
var radioBtns2 = document.getElementsByName("shape2");


var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;




function drawRect (context) {
    let rectWidth = endX - startX;
    let rectHeight = endY - startY;
    context.fillStyle = "rgb(239, 239, 239, 0.4)";
    context.strokeRect(startX, startY, rectWidth, rectHeight);
    context.fillRect(startX, startY, rectWidth, rectHeight);
};

function drawEllipse (context) {
    context.beginPath();
    context.fillStyle = "rgb(239, 239, 239, 0.4)";
    context.ellipse(startX, startY, Math.abs(endX - startX), Math.abs(endY - startY), 0, Math.PI * 2, false);
    context.stroke();
    context.fill();
    context.closePath();
};

canvas.onmousedown = (event) => {
    draw_phase = true;
    startX = parseInt(event.clientX - rect.left);
    startY = parseInt(event.clientY - rect.top);
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
};

canvas.onmousemove = (event) => {
    if (draw_phase) {
        context.putImageData(snapshot,0,0);
        endX = parseInt(event.clientX - rect.left);
        endY = parseInt(event.clientY - rect.top);
        if (radioBtns1[0].checked){
            drawRect(context);
        }
        else {
            drawEllipse(context);
        }


    }
};

canvas.onmouseup = () => {
    draw_phase = false;
};


canvas2.onmousedown = (event) => {
    draw_phase2 = true;
    startX = parseInt(event.clientX - rect2.left);
    startY = parseInt(event.clientY - rect2.top);
    // snapshot2 = canvas2.getImageData(0, 0, canvas2.width, canvas2.height);
};

canvas2.onmousemove = (event) => {
    if (draw_phase2) {
        context2.clearRect(0, 0, canvas2.width, canvas2.height);
        // context2.putImageData(snapshot2, 0, 0);
        endX = parseInt(event.clientX - rect2.left);
        endY = parseInt(event.clientY - rect2.top);
        if (radioBtns2[0].checked) {
            drawRect(context2);
        } else {
            drawEllipse(context2);
        }
    }
};

canvas2.onmouseup = () => {
    draw_phase2 = false;
};



// Uploading 

var file = document.querySelector("#file1")
file.addEventListener("change", function () {
    const reader = new FileReader()
    reader.addEventListener("load", () => {
        document.querySelector("#display1").src = reader.result
    })
    reader.readAsDataURL(this.files[0]);
});
var file = document.querySelector("#file2")
file.addEventListener("change", function () {
    const reader = new FileReader()
    reader.addEventListener("load", () => {
        document.querySelector("#display2").src = reader.result
    })
    reader.readAsDataURL(this.files[0]);
});


document.getElementById("file1").onchange = function () {
    // document.getElementById("upload-file").submit();
    var form_data = new FormData($('#upload-file')[0]);

    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/image",
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        async: true,
        success: function (data) {
            console.log("suii")
        }
    });
};


document.getElementById("file2").onchange = function () {
    // document.getElementById("upload-file").submit();


    var form_data = new FormData($('#upload-file2')[0]);

    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:5000/image2",
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        async: true,
        success: function (data) {
            console.log("suii")
        }
    });
};
