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
var clear_canvas1 = document.getElementById("clear1");
var select_mode1 = document.getElementsByName("select1");


var draw_phase = false;
var drag_phase = false;
let shapes = [];
let selected_shape = null;
let mode = "Normal"

// variables for 2nd canvas
let canvas2 = document.getElementById("canvas2");
let context2 = canvas2.getContext("2d");
canvas2.height = 290;
canvas2.width = 290;
const rect2 = canvas2.getBoundingClientRect();
var clear_canvas2 = document.getElementById("clear2");
var select_mode2 = document.getElementsByName("select2");


var draw_phase2 = false;
var drag_phase2 = false;
let shapes2 = [];
let selected_shape2 = null;
let mode2 = "Normal"

// Variables for drawing and moving
var startX = 0;
var startY = 0;
var endX = 290;
var endY = 290;
let rectWidth = 0;
let rectHeight = 0;


// check if we should move the shape
function is_mouse_in_shape(shape) {
    let x2 = shape.x + shape.width;
    let y2 = shape.y + shape.height;

    let left = Math.min(shape.x, x2);
    let right = Math.max(shape.x, x2);
    let top = Math.min(shape.y, y2);
    let bottom = Math.max(shape.y, y2);

    if (left < startX && right > startX && top < startY && bottom > startY) {
        return true;
    }
    return false;
}

// Drawing shapes
function drawRect(context) {
    rectWidth = endX - startX;
    rectHeight = endY - startY;
    context.fillStyle = "rgb(239, 239, 239, 0.4)";
    context.strokeRect(startX, startY, rectWidth, rectHeight);
    context.fillRect(startX, startY, rectWidth, rectHeight);
};

function moveRect(context,list_of_shapes) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let shape of list_of_shapes) {
        context.fillStyle = "rgb(239, 239, 239, 0.4)";
        context.strokeRect(shape.x, shape.y, shape.width, shape.height);
        context.fillRect(shape.x, shape.y, shape.width, shape.height);
    }
}

// Mouse actions for 1st canvas
canvas.onmousedown = (event) => {
    startX = parseInt(event.clientX - rect.left);
    startY = parseInt(event.clientY - rect.top);

    let index = 0;
    for (let shape of shapes) {
        if (is_mouse_in_shape(shape)) {
            selected_shape = index;
            drag_phase = true;
        }
        index++;
    }
    if (!drag_phase) {
        draw_phase = true;
    }
};

canvas.onmousemove = (event) => {
    if (draw_phase) {
        endX = parseInt(event.clientX - rect.left);
        endY = parseInt(event.clientY - rect.top);
        context.clearRect(0, 0, 290, 290)
        drawRect(context);
    }
    if (drag_phase) {
        endX = parseInt(event.clientX - rect.left);
        endY = parseInt(event.clientY - rect.top);
        let dx = endX - startX;
        let dy = endY - startY;
        let current_shape = shapes[selected_shape];
        current_shape.x += dx;
        current_shape.y += dy;
        moveRect(context, shapes);
        startX = endX;
        startY = endY;
    }
};

canvas.onmouseup = () => {
    if (draw_phase) {
        draw_phase = false;
        shapes = []
        shapes.push({ x: startX, y: startY, width: rectWidth, height: rectHeight, select_mode: mode });
    }

    else {
        drag_phase = false;
    }

    if (select_mode1[0].checked){
        mode = "Normal";
    }
    else {
        mode = "Inverse";
    }

    sendShapes();
};

canvas.onmouseout = () => {
    if (draw_phase) {
        draw_phase = false;
        shapes = []
        shapes.push({ x: startX, y: startY, width: rectWidth, height: rectHeight, select_mode: mode });
    }

    else {
        drag_phase = false;
    }

    if (select_mode1[0].checked){
        mode = "Normal";
    }
    else {
        mode = "Inverse";
    }

    sendShapes();
};

// for clear button
clear_canvas1.onclick = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    shapes = [];
    sendShapes();
};

select_mode1[0].onchange = () => {
    sendShapes();
}

select_mode1[1].onchange = () => {
    sendShapes();
}

// Mouse actions for 2nd canvas
canvas2.onmousedown = (event) => {
    startX = parseInt(event.clientX - rect2.left);
    startY = parseInt(event.clientY - rect2.top);

    let index = 0;
    for (let shape of shapes2) {
        if (is_mouse_in_shape(shape)) {
            selected_shape2 = index;
            drag_phase2 = true;
        }
        index++;
    }

    if (!drag_phase2) {
        draw_phase2 = true;
    }
};

canvas2.onmousemove = (event) => {
    if (draw_phase2) {
        endX = parseInt(event.clientX - rect2.left);
        endY = parseInt(event.clientY - rect2.top);

        context2.clearRect(0, 0, 290, 290)
        drawRect(context2);

    }

    if (drag_phase2) {
        endX = parseInt(event.clientX - rect2.left);
        endY = parseInt(event.clientY - rect2.top);
        let dx = endX - startX;
        let dy = endY - startY;
        let current_shape = shapes2[selected_shape2];
        current_shape.x += dx;
        current_shape.y += dy;
        moveRect(context2, shapes2);
        startX = endX;
        startY = endY;
    }
};

canvas2.onmouseup = () => {
    if (draw_phase2) {
        draw_phase2 = false;
        shapes2 = []
        shapes2.push({ x: startX, y: startY, width: rectWidth, height: rectHeight, select_mode: mode2 });
    }

    else {
        drag_phase2 = false;
    }

    if (select_mode2[0].checked){
        mode2 = "Normal";
    }
    else {
        mode2 = "Inverse";
    }

    sendShapes();
};

canvas2.onmouseout = () => {
    if (draw_phase2) {
        draw_phase2 = false;
        shapes2 = []
        shapes2.push({ x: startX, y: startY, width: rectWidth, height: rectHeight, select_mode: mode2 });
    }
    else {
        drag_phase2 = false;
    }

    if (select_mode2[0].checked){
        mode2 = "Normal";
    }
    else {
        mode2 = "Inverse";
    }

    sendShapes();
};

// Clear button
clear_canvas2.onclick = function () {
    
    context2.clearRect(0, 0, canvas2.width, canvas2.height);
    shapes2 = [];
    sendShapes();
};

select_mode2[0].onchange = () => {
    sendShapes();
}

select_mode2[1].onchange = () => {
    sendShapes();
}


// Send selected shape to back-end
function sendShapes() {

    $.ajax({
        type: "POST",
        contentType: "application/json;charset=utf-8",
        url: "http://127.0.0.1:5000/Shapes",
        data: JSON.stringify([shapes, shapes2]),
        dataType: 'json',
        success: function (result) {
            output_img.setAttribute("src", `${output_img_url}?r=${new Date().getTime()}`);
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


