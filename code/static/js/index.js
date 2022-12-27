const img1 = document.getElementById("img1");
const img1_url = "../static/uploads/1.png"
const img2 = document.getElementById("img2");
const img2_url = "../static/uploads/2.png"
const output_img = document.getElementById("output");
const output_img_url = "../static/uploads/output.png"



var file = document.querySelector("#file1")
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
var select1_val;
var select2_val;
document.getElementById("select1").onchange = function () {
    select1_val = document.getElementById("select1").value;
    $.ajax({
        url: 'http://127.0.0.1:5000/selected-items',
        type: 'POST',
        data: {
            'select1': select1_val //  to the GET parameters
        },
        dataType: 'json',

        success: function (response) {
            img1.setAttribute("src", `${img1_url}?r=${new Date().getTime()}`);
            output_img.setAttribute("src", `${output_img_url}?r=${new Date().getTime()}`);


        }
    })

};

document.getElementById("select2").onchange = function () {
    select2_val = document.getElementById("select2").value;
    $.ajax({
        url: 'http://127.0.0.1:5000/selected-items',
        type: 'POST',
        data: {
            'select2': select2_val //  to the GET parameters
        },
        dataType: 'json',

        success: function (response) {
            img2.setAttribute("src", `${img2_url}?r=${new Date().getTime()}`);
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
            console.log("suii")
        }
    });
};


