import { PokemonData } from './pokemonData';


/**
* Parses pokemon data out of a block
* @param {string} paste - string containing the entire pokemon paste
* @return {PokemonData} - the object
*/
export function parseText(paste: string): PokemonData[] {
    // split by line and double space = new pokemon
    // check if on windows with carriage return \r

    var text: string = paste.trim();
    //console.log(paste);
    //console.log(text);
    var pokemonBlocks: string[] = [];
    // do I even need to consider carriage return in browser?
    if (text.includes("\r")) {
        //console.log("rn");
        pokemonBlocks = text.split("\r\n\r\n");
    } else {
        //console.log("nn");
        pokemonBlocks = text.split("\n\n");
    }
    // remove bad blocks
    pokemonBlocks = pokemonBlocks.filter(block => block.trim() !== "");
    // remove whitespace around each block
    pokemonBlocks = pokemonBlocks.map(block => block.trim());
    
    /*
    // remove last undefined item
    let newPokemonBlocks;
    if(pokemonBlocks[pokemonBlocks.length] === "") {
        newPokemonBlocks = pokemonBlocks.slice(0, pokemonBlocks.length - 1);
    } else {
        newPokemonBlocks = pokemonBlocks;
    }
    //const newPokemonBlocks = pokemonBlocks.slice(0, pokemonBlocks.length - 1);
    console.log(newPokemonBlocks);

    //console.log(pokemonBlocks);
    // each block has the parsePokemon() function applied to it
    return newPokemonBlocks.map(parsePokemon);
    */
    // each block has the parsePokemon() function applied to it
    return pokemonBlocks.map(parsePokemon);
}


/**
* Parses pokemon data out of a block
* @param {string} block - string containing only one pokemon from the paste
* @return {PokemonData} - the object
*/
function parsePokemon(block: string): PokemonData {
    // init pokemon object
    let pokemonObject = new PokemonData();
    // 
    const moveset: string[] = [];
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
        } else if(line.includes("@")){
            const [name, item] = line.split(" @");
            pokemonObject.setName(nameTrim(name.trim()));
            if(name && item) {
                pokemonObject.setItem(item.trim());
            }
        } else {
            throw new Error(`Unknown attribute: <${line}>`);
        }
        // catch condition for no item
    });
    // catch condition for EVs not set
    if(pokemonObject._EVs === pokemonObject.notset) {
        const _EVs = {
            Hp: 0,
            Atk: 0,
            Def: 0,
            SpD: 0,
            SpA: 0,
            Spe: 0
        }
        pokemonObject.setEVs(_EVs);
    }
    // catch condition for IVs not set
    if(pokemonObject._IVs === pokemonObject.notset) {
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


/*
* To extract the real pokemon name if a pokemon has a nickname
* @param {} asdasd
*/
function nameTrim(name: string): string {
    let trimmedName: string = name;
    // slice out the name between the last parentheses of the string
    if(name.includes("(") && name.includes(")")) {
        trimmedName = name.slice(name.lastIndexOf("(") + 1, name.lastIndexOf(")"));
    }
    // check if name is F or M
    if(trimmedName === "F" || trimmedName === "M") {
        const splitName = name.split("(");
        trimmedName = splitName[0].trim();
    }
    return trimmedName;
}


/**
* Parses Element separated by :
* @param {PokemonData} pokemonObject - object to store the pokemon data
* @param {string} key - pokemon element
* @param {string} value - the value associated with the key
*/
function parseElement(pokemonObject: PokemonData, key: string, value: string): void {
    //console.log("parseElement()");
    //console.log(key);
    //console.log(value);
    switch (key) {
        /*
        case "Name":
            pokemonObject.setName(value.trim());
            break;
        case "Item":
            pokemonObject.setItem(value.trim());
            break;
        */
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
        /*
        case "Nature":
            pokemonObject.setNature(value.trim());
            break;
        */
        default:
            console.log(`Unknown attribute: <${key}>`);
            throw new Error(`Unknown attribute: <${key}>`);
    }
    //return pokemonObject;
}


/**
* Parses EVs out of EV string
* @param {string} evs - string containing EV numbers 
* @return EVs data
*/
function parseEVs(evs: string): { Hp: number, Atk: number, Def: number, SpA: number, SpD: number, Spe: number } {
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
                //throw error
                throw new Error(`Unknown EV stat: <${key}>`);
        }
    });
    return _EVs;
}


/**
* Parses IVs out of IV string
* @param {string} ivs - string containing IV numbers 
* @return IVs data
*/
function parseIVs(ivs: string): { Hp: number, Atk: number, Def: number, SpA: number, SpD: number, Spe: number } {
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
                //throw error
                throw new Error(`Unknown IV stat: <${key}>`);
        }
    });
    return _IVs;
}