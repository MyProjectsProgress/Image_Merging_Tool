// Variables for back-end
var sel1 = document.getElementById("select1");
var sel2 = document.getElementById("select2");
var text1
var text2
var file = document.querySelector("#file1")
var select1_val;
var select2_val;

Mag2 = document.getElementById("Mag2");
Phase2 = document.getElementById("Phase2");
Uniform2 = document.getElementById("Uni2")
Mag1 = document.getElementById("Mag1");
Phase1 = document.getElementById("Phase1");
Uniform1 = document.getElementById("Uni1");

// Consts for updating images
const img1_url = "../static/uploads/1.png";
const img2_url = "../static/uploads/2.png";
const output_img = document.getElementById("output");
const output_img_url = "../static/uploads/output.png";


// Canvas
// variables for 2nd canvas
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
canvas.height = 290;
canvas.width = 290;
const rect = canvas.getBoundingClientRect();

let snapshot;
var draw_phase = false;
var radioBtns1 = document.getElementsByName("shape");


// variables for 2nd canvas
let canvas2 = document.getElementById("canvas2");
let context2 = canvas2.getContext("2d");
canvas2.height = 290;
canvas2.width = 290;
const rect2 = canvas2.getBoundingClientRect();

let snapshot2;
var draw_phase2 = false;
var radioBtns2 = document.getElementsByName("shape2");

// Variables for drawing and moving
var startX = 0;
var startY = 0;
var endX = 290;
var endY = 290;

// Drawing shapes
function drawRect(context) {
    let rectWidth = endX - startX;
    let rectHeight = endY - startY;
    context.fillStyle = "rgb(239, 239, 239, 0.4)";
    context.strokeRect(startX, startY, rectWidth, rectHeight);
    context.fillRect(startX, startY, rectWidth, rectHeight);
};

function drawEllipse(context) {
    context.beginPath();
    context.fillStyle = "rgb(239, 239, 239, 0.4)";
    context.ellipse(startX, startY, Math.abs(endX - startX), Math.abs(endY - startY), 0, Math.PI * 2, false);
    context.stroke();
    context.fill();
    context.closePath();
};



// Mouse actions for 1st canvas
canvas.onmousedown = (event) => {
    draw_phase = true;
    startX = parseInt(event.clientX - rect.left);
    startY = parseInt(event.clientY - rect.top);
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
};

canvas.onmousemove = (event) => {
    if (draw_phase) {
        context.putImageData(snapshot, 0, 0);
        endX = parseInt(event.clientX - rect.left);
        endY = parseInt(event.clientY - rect.top);
        if (radioBtns1[0].checked) {
            drawRect(context);
        }
        else if (radioBtns1[1].checked) {
            drawEllipse(context);
        }
    }
};

canvas.onmouseup = () => {
    draw_phase = false;
    if((startX==endX)||(startY==endY)) {
        return;
    }
    sendShapes(1);

};


// Mouse actions for 2nd canvas
canvas2.onmousedown = (event) => {
    draw_phase2 = true;
    startX = parseInt(event.clientX - rect2.left);
    startY = parseInt(event.clientY - rect2.top);
    snapshot2 = context2.getImageData(0, 0, canvas.width, canvas.height);
};

canvas2.onmousemove = (event) => {
    if (draw_phase2) {
        context2.putImageData(snapshot2, 0, 0);
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
    if((startX==endX)||(startY==endY)) {
        return;
    }
    sendShapes(2);
};

function sendShapes(canvas_index) {
    var shape = {};
    if (radioBtns1[0].checked) {
        shape = {
            "x1": Math.min(startX, endX),
            "x2": Math.max(startX, endX),
            "y1": Math.min(startY, endY),
            "y2": Math.max(startY, endY),
            "canvas_index": canvas_index
        };
    }
    else {
        shape = {
            "x1": startX,
            "y1": startY,
            "rx": Math.abs(endX - startX),
            "ry": Math.abs(endY - startY),
            "canvas_index": canvas_index
        };
    }
    $.ajax({
        type: "POST",
        url: AjaxURL,
        data: shape,
        dataType: 'json',
        success: function (result) {
            window.console.log('Successful');
        }
    });


}

// Uploading and selecting
file.addEventListener("change", function () {
    const reader = new FileReader()
    reader.addEventListener("load", () => {
        document.querySelector("#display1").src = reader.result
    })
    reader.readAsDataURL(this.files[0]);
})
var file = document.querySelector("#file2")
file.addEventListener("change", function () {
    const reader = new FileReader()
    reader.addEventListener("load", () => {
        document.querySelector("#display2").src = reader.result
    })
    reader.readAsDataURL(this.files[0]);
})

document.getElementById("select1").onchange = function () {
    select1_val = document.getElementById("select1").value;
    text1 = sel1.options[sel1.selectedIndex].text;
    if (text1 == "Magnitude") {

        Mag2.setAttribute('disabled', '');
        Uni2.text = "Uniform phase"
    }

    if (!(text1 == "Magnitude")) {
        Mag2.removeAttribute("disabled");

    }
    if (text1 == "Phase") {

        Phase2.setAttribute('disabled', '');
        Uni2.text = "Uniform Magnitude"

    }

    if (!(text1 == "Phase")) {
        Phase2.removeAttribute("disabled");

    }
    if ((text1 == "Uniform") || (text1 == "Uniform Magnitude") || (text1 == "Uniform phase")) {

        Uniform2.setAttribute('disabled', '');

    }

    if (!((text1 == "Uniform") || (text1 == "Uniform Magnitude") || (text1 == "Uniform phase"))) {
        Uniform2.removeAttribute("disabled");

    }

    $.ajax({
        url: 'http://127.0.0.1:5000/selected-items',
        type: 'POST',
        data: {
            'select1': select1_val //  to the GET parameters
        },
        dataType: 'json',
        success: function (response) {
            var new_url = img1_url + `?r=${new Date().getTime()}`;
            canvas.style.backgroundImage = "url( " + new_url + " )";
            output_img.setAttribute("src", `${output_img_url}?r=${new Date().getTime()}`);
        }
    })

};

document.getElementById("select2").onchange = function () {
    select2_val = document.getElementById("select2").value;
    text2 = sel2.options[sel2.selectedIndex].text;
    if (text2 == "Magnitude") {
        Mag1.setAttribute('disabled', '');
        Uni1.text = "Uniform phase"
    }
    if (!(text2 == "Magnitude")) {
        Mag1.removeAttribute("disabled");
    }
    if (text2 == "Phase") {
        Phase1.setAttribute('disabled', '');
        Uni1.text = "Uniform Magnitude"
    }
    if (!(text2 == "Phase")) {
        Phase1.removeAttribute("disabled");
    }
    if ((text2 == "Uniform") || (text2 == "Uniform Magnitude") || (text2 == "Uniform phase")) {
        Uniform1.setAttribute('disabled', '');
    }
    if (!((text2 == "Uniform") || (text2 == "Uniform Magnitude") || (text2 == "Uniform phase"))) {
        Uniform1.removeAttribute("disabled");
    }
    $.ajax({
        url: 'http://127.0.0.1:5000/selected-items',
        type: 'POST',
        data: {
            'select2': select2_val //  to the GET parameters
        },
        dataType: 'json',
        success: function (response) {
            var new_url = img2_url + `?r=${new Date().getTime()}`;
            canvas2.style.backgroundImage = "url( " + new_url + " )";
            output_img.setAttribute("src", `${output_img_url}?r=${new Date().getTime()}`);
        }
    })
};

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
        }
    });
};


