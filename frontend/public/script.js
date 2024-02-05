// need to finish still*
/*
const metapastes = {
    vgcRegF: process.env.vgcRegF,
    smogSinglesOU: process.env.smogSinglesOU,
    smogDoublesOU: "",
    smogLC: "",
}
*/

const metapastes = {
    vgcRegF: "https://pokepast.es/be764b189495b269",
    smogSinglesOU: "https://pokepast.es/1f3efe0715e3c21e",
    smogDoublesOU: "",
    smogLC: "",
}


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
    htmlLoading += `<img src="Hitmontop.gif">`;
    htmlLoading += `<p id="target">work it.</p>`;
    // inform user that calculations are taking place
    document.getElementById("results").innerHTML = htmlLoading;
    // scroll results into view while loading
    var target = document.getElementById("target");
    target.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

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
    target.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
}


// parse field
function getField() {
    // with defaults
    const field = {
        metapaste: "",
        gameType: "Doubles",
        level: 0,
        terrain: undefined,
        weather: undefined,
        isMagicRoom: false,
        isWonderRoom: false,
        isGravity: false,
        isBeadsOfRuin: false,
        isTabletsOfRuin: false,
        isSwordOfRuin: false,
        isVesselOfRuin: false,
    };

    const gameTypeArr = [undefined, "Singles", "Doubles"];
    const levelArr = [0, 100, 50, 5];
    const terrainArr = [undefined, "Electric", "Grassy", "Psychic", "Misty"];
    const weatherArr = [undefined, "Sun", "Rain", "Sand", "Snow", "Harsh Sunshine", "Heavy Rain", "Strong Winds"];

    // universal
    field.gameType = gameTypeArr[getChecked("gametype")];
    field.level = levelArr[getChecked("level")];
    field.terrain = terrainArr[getChecked("terrain")];
    field.weather = weatherArr[getChecked("weather")];
    field.isMagicRoom = document.getElementById("magicroom").checked;
    field.isWonderRoom = document.getElementById("wonderroom").checked;
    field.isGravity = document.getElementById("gravity").checked;
    field.isBeadsOfRuin = document.getElementById("beads").checked;
    field.isTabletsOfRuin = document.getElementById("tablets").checked;
    field.isSwordOfRuin = document.getElementById("sword").checked;
    field.isVesselOfRuin = document.getElementById("vessel").checked;


    // attacker side
    field.attackerSide = getSide(true);

    // defender side
    field.defenderSide = getSide(false);

    // get metapaste link
    let selectedPreset = document.getElementById("presets").value;
    field.metapaste = metapastes[selectedPreset];

    return field;
}

function getSide(side) {
    let c = side ? "A" : "D";
    const sideField = {};

    // hazards
    sideField.isSR = document.getElementById(`rocks${c}`).checked;
    sideField.spikes = getChecked(`spikes${c}`)-1;
    // dmg red
    sideField.isReflect = document.getElementById(`reflect${c}`).checked;
    sideField.isLightScreen = document.getElementById(`lightScreen${c}`).checked;
    sideField.isAuroraVeil = document.getElementById(`aveil${c}`).checked;
    sideField.isFriendGuard = document.getElementById(`fguard${c}`).checked;
    // dmg amp
    sideField.isHelpingHand = document.getElementById(`hhand${c}`).checked;
    sideField.isBattery = document.getElementById(`battery${c}`).checked;
    sideField.isPowerSpot = document.getElementById(`pspot${c}`).checked;
    // misc
    sideField.isFlowerGift = document.getElementById(`fgift${c}`).checked;
    sideField.isSeeded = document.getElementById(`leechseed${c}`).checked;
    sideField.isSwitching = document.getElementById(`switchout${c}`).checked;

    return sideField;
}

// find which button is selected in class name
function getChecked(inputClass) {
    const elements = document.getElementsByClassName(inputClass);
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].checked) {
            return i + 1;
        }    
    }
    // default
    return 0;
}


// Handles default button
function handleSwitch(cx) {
    const inputClass = cx.classList[0];
    const selectedId= cx.id;
    const elements = document.getElementsByClassName(inputClass);
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].id != selectedId) {
            elements[i].checked = false;
        }
    }
}

// Handles buttons where one of the must stay turned on
function handleSwitchForced(cx) {
    const inputClass = cx.classList[0];
    const selectedId= cx.id;
    const elements = document.getElementsByClassName(inputClass);
    for (var i = 0; i < elements.length; i++) {
       elements[i].checked = elements[i].id == selectedId;
    }
}

// Handles preset dropwdown menu
function handlePresets() {
    let selectedPreset = document.getElementById("presets").value;
    switch(selectedPreset) {
        case "vgcRegF":
            // doubles
            document.getElementById("singles").checked = false;
            document.getElementById("doubles").checked = true;
            // 50
            document.getElementById("hundred").checked = false;
            document.getElementById("fifty").checked = true;
            document.getElementById("five").checked = false;
            // change meta paste (RegF)
            document.getElementById("metapaste").innerHTML = `<a href="${metapastes[selectedPreset]}">${selectedPreset} target="_blank"</a>`;
            break;
        case "smogSinglesOU":
            // singles
            document.getElementById("singles").checked = true;
            document.getElementById("doubles").checked = false;
            // 100
            document.getElementById("hundred").checked = true;
            document.getElementById("fifty").checked = false;
            document.getElementById("five").checked = false;
            // change meta paste (OU)
            document.getElementById("metapaste").innerHTML 
            = `<a href="${metapastes[selectedPreset]} target="_blank">${selectedPreset}"</a>`;
            break;
        case "smogDoublesOU":
            // doubles
            document.getElementById("singles").checked = false;
            document.getElementById("doubles").checked = true;
            // 100
            document.getElementById("hundred").checked = true;
            document.getElementById("fifty").checked = false;
            document.getElementById("five").checked = false;
            // change meta paste (DOU)
            document.getElementById("metapaste").innerHTML = `${selectedPreset}`;
            break;
        case "smogLC":
            // singles
            document.getElementById("singles").checked = true;
            document.getElementById("doubles").checked = false;
            // 5
            document.getElementById("hundred").checked = false;
            document.getElementById("fifty").checked = false;
            document.getElementById("five").checked = true;
            // change meta paste (LC)
            document.getElementById("metapaste").innerHTML = `${selectedPreset}`;
            break;
        default:
    }
}
