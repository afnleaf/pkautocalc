import { PokemonData } from './pokemonData.js';

export function parseTextBox(textBox) {
    // Get the value of the textarea
    var text = textBox.value;
    const parsedPokemon = parseText(text);
    /*
    parsedPokemon.forEach(pokemon => {
        //console.log(color);
        pokemon.printPokemon();
    });
    */
    return parsedPokemon;
}

export function parseText(text) {
    // split by line and double space = new pokemon
    // check if on windows with carriage return \r
    var pokemonBlocks = [];
    if (text.includes("\r")) {
        //console.log("rn");
        pokemonBlocks = text.split("\r\n\r\n");
    } else {
        //console.log("nn");
        pokemonBlocks = text.split("\n\n");
    }
    // remove last undefined item
    const newPokemonBlocks = pokemonBlocks.slice(0, pokemonBlocks.length - 1);

    //console.log(pokemonBlocks);
    // each block has the parsePokemon() function applied to it
    return newPokemonBlocks.map(parsePokemon);
    /*
    //const parsedPokemon = [];
    for (let block in pokemonBlocks) {
        console.log("parsing block");
        console.log(block);
        pokemon = parsePokemon(block);
        console.log(pokemon);
        parsedPokemon.push(pokemon);
    }
    */
    //return parsedPokemon;
    
}

function parsePokemon(block) {
    //console.log("parsePokemon");
    // init pokemon object
    //let pokemonObject = Object.create(pokemonTemplate);
    let pokemonObject = new PokemonData();
    // iv flag
    pokemonObject.setIVs(0);
    // default level is 100
    pokemonObject.setLevel(100);
    const moveset = [];
    // split text into lines
    const lines = block.split("\n");
    //console.log(lines);

    lines.forEach(line => {
        //console.log(line);
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
    // catch condition for IVs not set
    if(pokemonObject._IVs === 0) {
        const _IVs = {
            Hp: 31,
            Atk: 31,
            Def: 31,
            SpD: 31,
            SpA: 31,
            Spe: 31,
        }
        pokemonObject.setIVs(_IVs);
    }
    pokemonObject._Moveset = moveset;
    return pokemonObject;
}

function parseElement(pokemonObject, key, value) {
    //console.log(key);
    //console.log(value);
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
            pokemonObject.setLevel(parseInt(value.trim()));
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
    //console.log("parseevs");
    //console.log(evs);
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
    //console.log(tokens);
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
    //console.log("parseivs");
    //console.log(ivs);
    const _IVs = {
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
    //console.log(tokens);
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
