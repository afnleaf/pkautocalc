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
    // with defaults
    const field = {
        gameType: "Doubles",
        level: 0,
        terrain: undefined,
        weather: undefined,
        attackerSide: {},
        defenderSide: {},
    };
    
    // all buttons
    // universal
    // gametype
    const isSingles = getButtonStateFromId("singles");
    const isDoubles = getButtonStateFromId("doubles");
    // level
    const isHundred = getButtonStateFromId("hundred");
    const isFifty = getButtonStateFromId("fifty");
    const isFive = getButtonStateFromId("five");
    // terrain
    const isElectric = getButtonStateFromId("electric");
    const isGrassy = getButtonStateFromId("grassy");
    const isPsychic = getButtonStateFromId("psychic");
    const isMisty = getButtonStateFromId("misty");
    // weather
    const isSun = getButtonStateFromId("sun");
    const isRain = getButtonStateFromId("rain");
    const isSand = getButtonStateFromId("sand");
    const isSnow = getButtonStateFromId("snow");
    // side
    // attacker side
    const isARocks = getButtonStateFromId("aRocks");
    const isASpikes0 = getButtonStateFromId("aSpikes0");
    const isASpikes1 = getButtonStateFromId("aSpikes1");
    const isASpikes2 = getButtonStateFromId("aSpikes2");
    const isASpikes3 = getButtonStateFromId("aSpikes3");
    // defender side
    // hazards
    const isDRocks = getButtonStateFromId("dRocks");
    const isDSpikes0 = getButtonStateFromId("dSpikes0");
    const isDSpikes1 = getButtonStateFromId("dSpikes1");
    const isDSpikes2 = getButtonStateFromId("dSpikes2");
    const isDSpikes3 = getButtonStateFromId("dSpikes3");

    // parse state

    // universal

    // gametype
    if(isSingles) {
        field.gameType = "Singles";
    } else if(isDoubles) {
        field.gameType = "Doubles";
    } else {
        // default doubles
        field.gameType = "Doubles";
    }

    // level
    if(isHundred) {
        field.level = 100;
    } else if(isFifty) {
        field.level = 50;
    } else if(isFive) {
        field.level = 5;
    } else {
        // 0 is off because minimum level is 1
        field.level = 0;
    }

    // terrain
    if(isElectric) {
        field.terrain = "Electric";
    } else if(isGrassy) {
        field.terrain = "Grassy";
    } else if(isPsychic) {
        field.terrain = "Psychic";
    } else if(isMisty) {
        field.terrain = "Misty";
    } else {
        field.terrain = undefined;
    }

    // weather
    if(isSun) {
        field.weather = "Sun";
    } else if(isRain) {
        field.weather = "Rain";
    } else if(isSand) {
        field.weather = "Sand";
    } else if(isSnow) {
        field.weather = "Snow";
    } else {
        field.weather = undefined;
    }

    // attacker side
    // hazards
    // rocks
    if(isARocks) {
        field.attackerSide.isSR = true;
    } else {
        field.attackerSide.isSR = false;
    }
    // spikes
    if(isASpikes0) {
        field.attackerSide.spikes = 0;
    } else if(isASpikes1) {
        field.attackerSide.spikes = 1;
    } else if(isASpikes2) {
        field.attackerSide.spikes = 2;
    } else if(isASpikes3) {
        field.attackerSide.spikes = 3;
    }

    // defender side

    // hazards 
    // rocks
    if(isDRocks) {
        field.defenderSide.isSR = true;
    } else {
        field.defenderSide.isSR = false;
    }
    // spikes
    if(isDSpikes0) {
        field.defenderSide.spikes = 0;
    } else if(isDSpikes1) {
        field.defenderSide.spikes = 1;
    } else if(isDSpikes2) {
        field.defenderSide.spikes = 2;
    } else if(isDSpikes3) {
        field.defenderSide.spikes = 3;
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

// true if on, false if off
function getButtonStateFromId(id) {
    return document.getElementById(id).classList.contains("on");
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

// attacker side

// defender side
// hazards
function rocksButtonPressed(side) {
    const buttonRocks = document.getElementById(`${side}Rocks`);
    toggleButtonState(buttonRocks);
}

function spikes0ButtonPressed(side) {
    const buttonSpikes0 = document.getElementById(`${side}Spikes0`);
    const buttonSpikes1 = document.getElementById(`${side}Spikes1`);
    const buttonSpikes2 = document.getElementById(`${side}Spikes2`);
    const buttonSpikes3 = document.getElementById(`${side}Spikes3`);
    toggleButtonState(buttonSpikes0);
    if(buttonSpikes0.classList.contains("on")) {
        buttonOff(buttonSpikes1);
        buttonOff(buttonSpikes2);
        buttonOff(buttonSpikes3);
    }
}

function spikes1ButtonPressed(side) {
    const buttonSpikes0 = document.getElementById(`${side}Spikes0`);
    const buttonSpikes1 = document.getElementById(`${side}Spikes1`);
    const buttonSpikes2 = document.getElementById(`${side}Spikes2`);
    const buttonSpikes3 = document.getElementById(`${side}Spikes3`);
    toggleButtonState(buttonSpikes1);
    if(buttonSpikes1.classList.contains("on")) {
        buttonOff(buttonSpikes0);
        buttonOff(buttonSpikes2);
        buttonOff(buttonSpikes3);
    }
}

function spikes2ButtonPressed(side) {
    const buttonSpikes0 = document.getElementById(`${side}Spikes0`);
    const buttonSpikes1 = document.getElementById(`${side}Spikes1`);
    const buttonSpikes2 = document.getElementById(`${side}Spikes2`);
    const buttonSpikes3 = document.getElementById(`${side}Spikes3`);
    toggleButtonState(buttonSpikes2);
    if(buttonSpikes2.classList.contains("on")) {
        buttonOff(buttonSpikes0);
        buttonOff(buttonSpikes1);
        buttonOff(buttonSpikes3);
    }
}

function spikes3ButtonPressed(side) {
    const buttonSpikes0 = document.getElementById(`${side}Spikes0`);
    const buttonSpikes1 = document.getElementById(`${side}Spikes1`);
    const buttonSpikes2 = document.getElementById(`${side}Spikes2`);
    const buttonSpikes3 = document.getElementById(`${side}Spikes3`);
    toggleButtonState(buttonSpikes3);
    if(buttonSpikes3.classList.contains("on")) {
        buttonOff(buttonSpikes0);
        buttonOff(buttonSpikes1);
        buttonOff(buttonSpikes2);
    }
}