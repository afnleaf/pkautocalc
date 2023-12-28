/**
* Posts json to server
* @param {url} http endpoint url 
* @param {data} json object
* @return response from the server
*/
async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return response;
}

/**
* Collect user input and post to server. 
* Expects response with results from server.
* Displays results.
*/
async function requestResults() {
    // loading screen spinner
    let htmlLoading = `<h1>Calculating...</h1>`;
    htmlLoading += `<img src="Hitmontop.gif">`
    // inform user that calculations are taking place
    document.getElementById('results').innerHTML = htmlLoading;

    var target = document.getElementById("results");
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // parse field
    const field = getField();

    // message to be passed
    const data = {
        // get pastes from textbox
        "team1" : document.getElementById("textBoxLeft").value,
        "team2" : document.getElementById("textBoxRight").value,
        // field
        "field": field
    }
    //const url = 'http://localhost:8080/calculation';
    //const url = "https://localhost:3000/results";
    // how to amke this dynamic
    //const url = "http://192.168.2.104:8080/calculation";
    //const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/calculation`;
    //const url = `${window.location.protocol}//${window.location.hostname}/results`;
    const url = "/results";
    
    try {
        const result = await postData(url, data);
        //console.log(result);
        const htmlResult = await result.text();
        document.getElementById("results").innerHTML = htmlResult;
    } catch (error) {
        console.error('Error during POST request:', error);
    }

    // Scroll the browser to the target element
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// parse field
function getField() {
    const field = {};
    // game type doubles or singles
    // must be capital to be parsed
    if(document.getElementById("singles").style.borderStyle == "inset") {
        field.gameType = "Singles";
    } else if(document.getElementById("doubles").style.borderStyle == "inset") {
        field.gameType = "Doubles";
    }
    // level
    if(document.getElementById("hundred").style.borderStyle == "inset") {
        field.level = 100;
    } else if(document.getElementById("fifty").style.borderStyle == "inset") {
        field.level = 50;
    } else if(document.getElementById("five").style.borderStyle == "inset") {
        field.level = 5;
    // condition to turn off autolevel
    } else {
        field.level = 0;
    }
    return field;
}


// Field control buttons
function singlesButtonPressed() {
    const buttonSingles = document.getElementById("singles");
    const buttonDoubles = document.getElementById("doubles");
    // if not pressed, press in
    if(buttonSingles.style.borderStyle == "outset") {
    	buttonSingles.style.borderStyle = "inset";
        // if doubles is pressed currently, unpress it
        if(buttonDoubles.style.borderStyle == "inset") {
            buttonDoubles.style.borderStyle = "outset";
        }
    } 
}

function doublesButtonPressed() {
    const buttonSingles = document.getElementById("singles");
    const buttonDoubles = document.getElementById("doubles");
    // if not pressed, press in
    if(buttonDoubles.style.borderStyle == "outset") {
    	buttonDoubles.style.borderStyle = "inset";
        // if doubles is pressed currently, unpress it
        if(buttonSingles.style.borderStyle == "inset") {
            buttonSingles.style.borderStyle = "outset";
        }
    } 
}

function level100ButtonPressed() {
    const buttonHundred = document.getElementById("hundred");
    const buttonFifty = document.getElementById("fifty");
    const buttonFive = document.getElementById("five");
    //const buttonAuto = document.getElementById("autolevel");
    // if not pressed, press in
    if(buttonHundred.style.borderStyle == "outset") {
    	buttonHundred.style.borderStyle = "inset";
        // if fifty is pressed currently, unpress it
        if(buttonFifty.style.borderStyle == "inset") {
            buttonFifty.style.borderStyle = "outset";
        }
        // if five is pressed currently, unpress it
        if(buttonFive.style.borderStyle == "inset") {
            buttonFive.style.borderStyle = "outset";
        }
        /*
        if(buttonAuto.style.borderStyle == "inset") {
            buttonAuto.style.borderStyle == "outset";
        }
        */
    } else if(buttonHundred.style.borderStyle = "inset") {
        buttonHundred.style.borderStyle = "outset";
    }
}

function level50ButtonPressed() {
    const buttonHundred = document.getElementById("hundred");
    const buttonFifty = document.getElementById("fifty");
    const buttonFive = document.getElementById("five");
    const buttonAuto = document.getElementById("autolevel");
    // if not pressed, press in
    if(buttonFifty.style.borderStyle == "outset") {
        buttonFifty.style.borderStyle = "inset";
        // if hundred is pressed currently, unpress it
        if(buttonHundred.style.borderStyle == "inset") {
            buttonHundred.style.borderStyle = "outset";
        }
        // if five is pressed currently, unpress it
        if(buttonFive.style.borderStyle == "inset") {
            buttonFive.style.borderStyle = "outset";
        }
        /*
        if(buttonAuto.style.borderStyle == "inset") {
            buttonAuto.style.borderStyle == "outset";
        }
        */
    } else if(buttonFifty.style.borderStyle = "inset") {
        buttonFifty.style.borderStyle = "outset";
    }
}

function level5ButtonPressed() {
    const buttonHundred = document.getElementById("hundred");
    const buttonFifty = document.getElementById("fifty");
    const buttonFive = document.getElementById("five");
    //const buttonAuto = document.getElementById("autolevel");
    // if not pressed, press in
    if(buttonFive.style.borderStyle == "outset") {
    	buttonFive.style.borderStyle = "inset";
        // if hundred is pressed currently, unpress it
        if(buttonHundred.style.borderStyle == "inset") {
            buttonHundred.style.borderStyle = "outset";
        }
        // if fifty is pressed currently, unpress it
        if(buttonFifty.style.borderStyle == "inset") {
            buttonFifty.style.borderStyle = "outset";
        }
        /*
        if(buttonAuto.style.borderStyle == "inset") {
            buttonAuto.style.borderStyle == "outset";
        }
        */
    } else if(buttonFive.style.borderStyle = "inset") {
        buttonFive.style.borderStyle = "outset";
    }
}
