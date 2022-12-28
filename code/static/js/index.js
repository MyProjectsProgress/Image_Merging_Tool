const img1 = document.getElementById("img1");
const img1_url = "../static/uploads/1.png"
const img2 = document.getElementById("img2");
const img2_url = "../static/uploads/2.png"
const output_img = document.getElementById("output");
const output_img_url = "../static/uploads/output.png"

var sel1 = document.getElementById("select1");
var sel2 = document.getElementById("select2");

var text1
var text2
var file = document.querySelector("#file1")
Mag2 = document.getElementById("Mag2");
Phase2 = document.getElementById("Phase2");
Uniform2 = document.getElementById("Uni2")
Mag1 = document.getElementById("Mag1");
Phase1 = document.getElementById("Phase1");
Uniform1 = document.getElementById("Uni1")
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
            img1.setAttribute("src", `${img1_url}?r=${new Date().getTime()}`);
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
        }
    });
};


