class PokemonData {
    /*
    constructor(name, item, ability, level, tera, evs, ivs, nature, moveset) {
        this._Name = name;
        this._Item = item;
        this._Ability = ability;
        this._Level = level;
        this._Tera = tera;
        this._EVs = evs;
        this._IVs = ivs;
        this._Nature = nature;
        this._Moveset = moveset;
    }
    */
    constructor() {
        this._Name = "";
        this._Item = "";
        this._Ability = "";
        this._Level = "";
        this._Tera = "";
        this._EVs = {};
        this._IVs = {};
        this._Nature = "";
        this._Moveset = [];
    }

    setName(value) {
        this._Name = value;
    }

    setItem(value) {
        this._Item = value;
    }
    setAbility(value) {
        this._Ability = value;
    }

    setLevel(value) {
        this._Level = value;
    }

    setTera(value) {
        this._Tera = value;
    }

    setEVs(value) {
        this._EVs = value;
    }

    setIVs(value) {
        this._IVs = value;
    }

    setNature(value) {
        this._Nature = value;
    }

    setMoveset(value) {
        this._Moveset = value;
    }

    printPokemon() {
        console.log(`Pokemon:`)
        console.log(`Name: ${this._Name}`);
        console.log(`Item: ${this._Item}`);
        console.log(`Ability: ${this._Ability}`);
        console.log(`Level: ${this._Level}`);
        console.log(`Tera: ${this._Tera}`);
        this.printEVs();
        this.printIVs();
        console.log(`Nature: ${this._Nature}`);
        this.printMoveset();
        //console.log(`Moveset: ${this._Moveset}`);
        console.log("");
    }

    printEVs() {
        console.log(`EVs:`);
        console.log(`\tHP: ${this._EVs.Hp}`);
        console.log(`\tAtk: ${this._EVs.Atk}`);
        console.log(`\tDef: ${this._EVs.Def}`);
        console.log(`\tSpA: ${this._EVs.SpA}`);
        console.log(`\tSpD: ${this._EVs.SpD}`);
        console.log(`\tSpe: ${this._EVs.Spe}`);
    }

    printIVs() {
        console.log(`IVs:`);
        console.log(`\tHP: ${this._IVs.Hp}`);
        console.log(`\tAtk: ${this._IVs.Atk}`);
        console.log(`\tDef: ${this._IVs.Def}`);
        console.log(`\tSpA: ${this._IVs.SpA}`);
        console.log(`\tSpD: ${this._IVs.SpD}`);
        console.log(`\tSpe: ${this._IVs.Spe}`);
    }

    printMoveset(moveset) {
        console.log(`Moveset:`);
        this._Moveset.forEach(move => {
            console.log(`- ${move}`);
        });
    }
}




// starts the calculations
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
    console.log("print object");
    //console.log(parsedPokemon);
    /*
    for (let pokemon in parsedPokemon) {
        pokemon.printPokemon();
    }
    */

    parsedPokemon.forEach(pokemon => {
        //console.log(color);
        pokemon.printPokemon();
    });



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
    /*
    //const parsedPokemon = [];
    for (let block in pokemonBlocks) {
        console.log("parsing block");
        console.log(block);
        pokemon = parsePokemon(block);
        console.log(pokemon);
        parsedPokemon.push(pokemon);
    }
    return parsedPokemon;
    */
}

function parsePokemon(block) {
    //console.log("parsePokemon");
    // init pokemon object
    //let pokemonObject = Object.create(pokemonTemplate);
    let pokemonObject = new PokemonData();
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
            //pokemonObject = 
            parseElement(pokemonObject, key, value);
        // parse every move
        } else if(line.startsWith("- ")) {
            moveset.push(line.slice(2).trim());
        // get nature
        } else if(line.includes("Nature")) {
            const [nature, empty] = line.split(" Nature");
            pokemonObject.setNature(nature);
        // parse name and item
        } else {
            const [name, item] = line.split(" @");
            if(name && item) {
                pokemonObject.setName(name.trim());
                pokemonObject.setItem(item.trim());
            }
        }
        // catch condition for no item
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
            pokemonObject.setName(value.trim());
            break;
        case "Item":
            pokemonObject.setItem(value.trim());
            break;
        case "Ability":
            pokemonObject.setAbility(value.trim());
            break;
        case "Level":
            pokemonObject.setLevel(value.trim());
            break;
        case "Tera Type":
            pokemonObject.setTera(value.trim());
            break;
        case "EVs":
            pokemonObject.setEVs(parseEVs(value.trim()));
            break;
        case "IVs":
            pokemonObject.setIVs(parseIVs(value.trim()));
            break;
        case "Nature":
            pokemonObject.setNature(value.trim());
            break;
        default:
            //pokemonObject.Move = value;
    }
    //return pokemonObject;
}

function parseEVs(evs) {
    console.log("parseevs");
    console.log(evs);
    const _EVs = {
        Hp: 0,
        Atk: 0,
        Def: 0,
        SpD: 0,
        SpA: 0,
        Spe: 0
    }
    var tokens = [`${evs}`];
    // multiple tokens
    if(evs.includes("/")) {
        tokens = evs.split(" / ");
    }
    console.log(tokens);
    tokens.forEach(token => {
        const [value, key] = token.split(" ")
        switch (key) {
            case "HP":
                _EVs.Hp = parseInt(value);
                break;
            case "Atk":
                _EVs.Atk = parseInt(value);
                break;
            case "Def":
                _EVs.Def = parseInt(value);
                break;
            case "SpA":
                _EVs.SpA = parseInt(value);
                break;
            case "SpD":
                _EVs.SpD = parseInt(value);
                break;
            case "Spe":
                _EVs.Spe = parseInt(value);
                break;
            default:
                //asdjadasd
        }
    });
    return _EVs;
}

function parseIVs(ivs) {
    console.log("parseivs");
    console.log(ivs);
    _IVs = 
    {
        Hp: 31,
        Atk: 31,
        Def: 31,
        SpD: 31,
        SpA: 31,
        Spe: 31,
    }
    var tokens = [`${ivs}`];
    // multiple tokens
    if(ivs.includes("/")) {
        tokens = ivs.split(" / ");
    }
    console.log(tokens);
    tokens.forEach(token => {
        const [value, key] = token.split(" ")
        switch (key) {
            case "HP":
                _IVs.Hp = parseInt(value);
                break;
            case "Atk":
                _IVs.Atk = parseInt(value);
                break;
            case "Def":
                _IVs.Def = parseInt(value);
                break;
            case "SpA":
                _IVs.SpA = parseInt(value);
                break;
            case "SpD":
                _IVs.SpD = parseInt(value);
                break;
            case "Spe":
                _IVs.Spe = parseInt(value);
                break;
            default:
                //asdjadasd
        }
    });
    return _IVs;
}




// pokemon Object template
/*
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
*/