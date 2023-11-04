function calculate() {
    // check if teams are valid
    // return notice to user that teams are not valid
    readTextBox1();
    readTextBox2();
}

function readTextBox1() {
    // Get the textarea element by its id
    var textBox1 = document.getElementById("textBoxLeft");
    // Get the value of the textarea
    var paste = textBox1.value;
    console.log(paste)

    // Display the value in a paragraph or perform any further processing
    //document.getElementById("output").textContent = "Textarea content: " + textareaValue;
}

function readTextBox2() {
    // Get the textarea element by its id
    var textBox2 = document.getElementById("textBoxRight");
    // Get the value of the textarea
    var paste = textBox2.value;
    console.log(paste)
}


