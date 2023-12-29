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
        isMagicRoom: false,
        isWonderRoom: false,
        isGravity: false,
        attackerSide: {},
        defenderSide: {},
    };

    const gameTypeArr = [undefined, "Singles", "Doubles"];
    const levelArr = [0, 100, 50, 5];
    const terrainArr = [undefined, "Electric", "Grassy", "Psychic", "Misty"];
    const weatherArr = [undefined, "Sun", "Rain", "Sand", "Snow"];

    // universal
    field.gameType = gameTypeArr[getChecked("gametype")];
    field.level = levelArr[getChecked("level")];
    field.terrain = terrainArr[getChecked("terrain")];
    field.weather = weatherArr[getChecked("weather")];
    field.isMagicRoom = document.getElementById("magicroom").checked;
    field.isWonderRoom = document.getElementById("wonderroom").checked;
    field.isGravity = document.getElementById("gravity").checked;

    // attacker side
    // hazards
    field.attackerSide.spikes = getChecked("spikesA")-1;
    field.attackerSide.isSR = document.getElementById("rocksA").checked;
    // dmg red
    field.attackerSide.isReflect = document.getElementById("reflectA").checked;
    field.attackerSide.isLightScreen = document.getElementById("lightScreenA").checked;
    field.attackerSide.isAuroraVeil = document.getElementById("aveilA").checked;
    field.attackerSide.isFriendGuard = document.getElementById("fguardA").checked;
    // dmg amp
    field.attackerSide.isHelpingHand = document.getElementById("hhandA").checked;


    // defender side
    // hazards
    field.defenderSide.spikes = getChecked("spikesD")-1;
    field.defenderSide.isSR = document.getElementById("rocksD").checked;
    // dmg red
    field.defenderSide.isReflect = document.getElementById("reflectD").checked;
    field.defenderSide.isLightScreen = document.getElementById("lightScreenD").checked;
    field.defenderSide.isAuroraVeil = document.getElementById("aveilD").checked;
    field.defenderSide.isFriendGuard = document.getElementById("fguardD").checked;
    // dmg amp
    field.defenderSide.isHelpingHand = document.getElementById("hhandD").checked;

    return field;
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
