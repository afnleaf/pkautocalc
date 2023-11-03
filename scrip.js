// pokemon Object template
let pokemonTemplate = {
    _Name: "",
    _Item: "",
    _Ability: "",
    _Level: "",
    _Tera: "",
    _EVs: {
        HP: 0,
        Atk: 0,
        Def: 0,
        SpD: 0,
        SpA: 0,
        Spe: 0,
    },  
    _IVs: {
        HP: 31,
        Atk: 31,
        Def: 31,
        SpD: 31,
        SpA: 31,
        Spe: 31,
    },
    _Nature: "",
    _Moveset: [],
    set _Name(value) {
        this.Name = value;
    },
    set _Item(value) {
        this.Item = value;
    },
    set _Ability(value) {
        this.Ability = value;
    },
    set _Level(value) {
        this.Level = value;
    },
    set _Tera(value) {
        this.Tera = value;
    },
    set _EVs(value) {
        this.EVs = value;
    },
    set _IVs(value) {
        this.IVs = value;
    },
    set _Nature(value) {
        this.Nature = value;
    },
    set _Moveset(value) {
        this.Moveset = value;
    },
};


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
    var text = textBox1.value;
    const parsedPokemon = parseText(text);

    //console.log(parsedPokemon);
    for (let pokemon in parsedPokemon) {
        printPokemon(pokemon);
    }

    // Display the value in a paragraph or perform any further processing
    //document.getElementById("output").textContent = "Textarea content: " + textareaValue;
}

function readTextBox2() {
    // Get the textarea element by its id
    var textBox2 = document.getElementById("textBoxRight");
    // Get the value of the textarea
    var text = textBox2.value;
    //console.log(paste)
}

function parseText(text) {
    // split by line and double space = new pokemon
    const pokemonBlocks = text.split('\n\n');
    // each block has the parsePokemon() function applied to it
    return pokemonBlocks.map(parsePokemon);
}

function parsePokemon(block) {
    // init pokemon object
    let pokemonObject = Object.create(pokemonTemplate);
    const moveset = [];
    // split text into lines
    const lines = block.split("\n");
    //console.log(lines);

    lines.forEach(line => {
        console.log(line);
        // split each line into key and value pairs
        const [key, value] = line.split(": ");
        if (key && value) {
            //console.log(key + " " + value);
            pokemonObject = parseElement(pokemonObject, key, value);
        // parse every move
        } else if(line.startsWith("- ")) {
            moveset.push(line.slice(2));
         // parse name and item
        } else {
            const [name, item] = line.split(" @");
            if(name && item) {
                pokemonObject.Name = name.trim();
                pokemonObject.Item = item.trim();
            }
        }
    });
    //console.log("");
    pokemonObject._Moveset = moveset;
    return pokemonObject;
}

function parseElement(pokemonObject, key, value) {
    console.log(key);
    console.log(value);
    switch (key) {
        case "Name":
            pokemonObject.Name = value.trim();
            break;
        case "Item":
            pokemonObject.Item = value.trim();
            break;
        case "Ability":
            pokemonObject.Ability = value.trim();
            break;
        case "Level":
            pokemonObject.Level = value.trim();
            break;
        case "Tera Type":
            pokemonObject.Tera = value.trim();
            break;
        case "EVs":
            //pokemonObject.EVs = value;
            pokemonObject.EVs = parseEVs(pokemonObject, value);
            break;
        case "IVs":
            pokemonObject.IVs = parseIVs(pokemonObject, value);
            break;
        case "Nature":
            pokemonObject.Nature = value.trim();
            break;
        default:
            //pokemonObject.Move = value;
    }
}

function parseEVs(pokemonObject, evs) {

}

function parseIVs(ivs) {

}

function printPokemon(pokemonObject) {
    console.log("Pokemon:")
    console.log("Name: " + pokemonObject.Name);
    console.log("Item: " + pokemonObject.Item);
    console.log("Ability: " + pokemonObject.Ability);
    console.log("Level: " + pokemonObject.Level);
    console.log("Tera: " + pokemonObject.Tera);
    console.log("EVs: " + pokemonObject.EVs);
    console.log("IVs: " + pokemonObject.IVs);
    console.log("Nature:" + pokemonObject.Nature);
    console.log("Moveset:" + pokemonObject.Moveset);
    console.log("");
}