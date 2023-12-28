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
    
    // all buttons
    // gametype
    const buttonSingles = document.getElementById("singles");
    const buttonDoubles = document.getElementById("doubles");
    // level
    const buttonHundred = document.getElementById("hundred");
    const buttonFifty = document.getElementById("fifty");
    const buttonFive = document.getElementById("five");
    // terrain
    const buttonElectric = document.getElementById("electric");
    const buttonGrassy = document.getElementById("grassy");
    const buttonPsychic = document.getElementById("psychic");
    const buttonMisty = document.getElementById("misty");
    // weather
    const buttonSun = document.getElementById("sun");
    const buttonRain = document.getElementById("rain");
    const buttonSand = document.getElementById("sand");
    const buttonSnow = document.getElementById("snow");

    // parse state
    // gametype
    if(buttonSingles.classList.contains("on")) {
        field.gameType = "Singles";
    } else if(buttonDoubles.classList.contains("on")) {
        field.gameType = "Doubles";
    } else {
        // default doubles
        field.gameType = "Doubles";
    }

    // level
    if(buttonHundred.classList.contains("on")) {
        field.level = 100;
    } else if(buttonFifty.classList.contains("on")) {
        field.level = 50;
    } else if(buttonFive.classList.contains("on")) {
        field.level = 5;
    } else {
        // 0 is off because minimum level is 1
        field.level = 0;
    }

    // terrain
    if(buttonElectric.classList.contains("on")) {
        field.terrain = "Electric";
    } else if(buttonGrassy.classList.contains("on")) {
        field.terrain = "Grassy";
    } else if(buttonPsychic.classList.contains("on")) {
        field.terrain = "Psychic";
    } else if(buttonMisty.classList.contains("on")) {
        field.terrain = "Misty";
    } else {
        field.terrain = undefined;
    }

    // weather
    if(buttonSun.classList.contains("on")) {
        field.weather = "Sun";
    } else if(buttonRain.classList.contains("on")) {
        field.weather = "Rain";
    } else if(buttonSand.classList.contains("on")) {
        field.weather = "Sand";
    } else if(buttonSnow.classList.contains("on")) {
        field.weather = "Snow";
    } else {
        field.weather = undefined;
    }

    return field;
}


// Field control buttons --------------------------------------------
// so long but idk what else to do

// button util
function toggleButtonState(button) {
    if(button.classList.contains("on")) {
        buttonOff(button)
    } else {
        buttonOn(button);
    }
}

function buttonOn(button) {
    button.classList.remove("off");
    button.classList.add("on");
}

function buttonOff(button) {
    button.classList.remove("on");
    button.classList.add("off");
}


// gametype
function singlesButtonPressed() {
    const buttonSingles = document.getElementById("singles");
    const buttonDoubles = document.getElementById("doubles");
    // if doubles is currently off, singles shouldn't be able to be turned off
    if(buttonDoubles.classList.contains("on")) {
        toggleButtonState(buttonSingles);
    } 
    // if pressed on, turn all the others off
    if(buttonSingles.classList.contains("on")) {
        buttonOff(buttonDoubles);
    }    
}

function doublesButtonPressed() {
    const buttonSingles = document.getElementById("singles");
    const buttonDoubles = document.getElementById("doubles");
    if(buttonSingles.classList.contains("on")) {
        toggleButtonState(buttonDoubles);
    }
    // if pressed on, turn all the others off
    if(buttonDoubles.classList.contains("on")) {
        buttonOff(buttonSingles);
    }
}


// levels
function level100ButtonPressed() {
    const buttonHundred = document.getElementById("hundred");
    const buttonFifty = document.getElementById("fifty");
    const buttonFive = document.getElementById("five");
    toggleButtonState(buttonHundred);
    // if pressed on, turn all the others off
    if(buttonHundred.classList.contains("on")) {
        buttonOff(buttonFifty);
        buttonOff(buttonFive);
    }
}

function level50ButtonPressed() {
    const buttonHundred = document.getElementById("hundred");
    const buttonFifty = document.getElementById("fifty");
    const buttonFive = document.getElementById("five");
    toggleButtonState(buttonFifty);
    // if pressed on, turn all the others off
    if(buttonFifty.classList.contains("on")) {
        buttonOff(buttonHundred);
        buttonOff(buttonFive);
    }
}

function level5ButtonPressed() {
    const buttonHundred = document.getElementById("hundred");
    const buttonFifty = document.getElementById("fifty");
    const buttonFive = document.getElementById("five");
    toggleButtonState(buttonFive);
    // if pressed on, turn all the others off
    if(buttonFive.classList.contains("on")) {
        buttonOff(buttonHundred);
        buttonOff(buttonFifty);
    }
}


// terrain
function electricButtonPressed() {
    const buttonElectric = document.getElementById("electric");
    const buttonGrassy = document.getElementById("grassy");
    const buttonPsychic = document.getElementById("psychic");
    const buttonMisty = document.getElementById("misty");
    toggleButtonState(buttonElectric);
    // if pressed on, turn all the others off
    if(buttonElectric.classList.contains("on")) {
        buttonOff(buttonGrassy);
        buttonOff(buttonPsychic);
        buttonOff(buttonMisty);
    }
}

function grassyButtonPressed() {
    const buttonElectric = document.getElementById("electric");
    const buttonGrassy = document.getElementById("grassy");
    const buttonPsychic = document.getElementById("psychic");
    const buttonMisty = document.getElementById("misty");
    toggleButtonState(buttonGrassy);
    // if pressed on, turn all the others off
    if(buttonGrassy.classList.contains("on")) {
        buttonOff(buttonElectric);
        buttonOff(buttonPsychic);
        buttonOff(buttonMisty);
    }
}

function psychicButtonPressed() {
    const buttonElectric = document.getElementById("electric");
    const buttonGrassy = document.getElementById("grassy");
    const buttonPsychic = document.getElementById("psychic");
    const buttonMisty = document.getElementById("misty");
    toggleButtonState(buttonPsychic);
    // if pressed on, turn all the others off
    if(buttonPsychic.classList.contains("on")) {
        buttonOff(buttonElectric);
        buttonOff(buttonGrassy);
        buttonOff(buttonMisty);
    }
}

function mistyButtonPressed() {
    const buttonElectric = document.getElementById("electric");
    const buttonGrassy = document.getElementById("grassy");
    const buttonPsychic = document.getElementById("psychic");
    const buttonMisty = document.getElementById("misty");
    toggleButtonState(buttonMisty);
    // if pressed on, turn all the others off
    if(buttonMisty.classList.contains("on")) {
        buttonOff(buttonElectric);
        buttonOff(buttonGrassy);
        buttonOff(buttonPsychic);
    }
}


// weather
function sunButtonPressed() {
    const buttonSun = document.getElementById("sun");
    const buttonRain = document.getElementById("rain");
    const buttonSand = document.getElementById("sand");
    const buttonSnow = document.getElementById("snow");
    toggleButtonState(buttonSun);
    // if pressed on, turn all the others off
    if(buttonSun.classList.contains("on")) {
        buttonOff(buttonRain);
        buttonOff(buttonSand);
        buttonOff(buttonSnow);
    }
}

function rainButtonPressed() {
    const buttonSun = document.getElementById("sun");
    const buttonRain = document.getElementById("rain");
    const buttonSand = document.getElementById("sand");
    const buttonSnow = document.getElementById("snow");
    toggleButtonState(buttonRain);
    // if pressed on, turn all the others off
    if(buttonRain.classList.contains("on")) {
        buttonOff(buttonSun);
        buttonOff(buttonSand);
        buttonOff(buttonSnow);
    }
}

function sandButtonPressed() {
    const buttonSun = document.getElementById("sun");
    const buttonRain = document.getElementById("rain");
    const buttonSand = document.getElementById("sand");
    const buttonSnow = document.getElementById("snow");
    toggleButtonState(buttonSand);
    // if pressed on, turn all the others off
    if(buttonSand.classList.contains("on")) {
        buttonOff(buttonSun);
        buttonOff(buttonRain);
        buttonOff(buttonSnow);
    }
}

function snowButtonPressed() {
    const buttonSun = document.getElementById("sun");
    const buttonRain = document.getElementById("rain");
    const buttonSand = document.getElementById("sand");
    const buttonSnow = document.getElementById("snow");
    toggleButtonState(buttonSnow);
    // if pressed on, turn all the others off
    if(buttonSnow.classList.contains("on")) {
        buttonOff(buttonSun);
        buttonOff(buttonRain);
        buttonOff(buttonSand);
    }
}