// from src
import { PokemonData } from './pokemonData';
import { parseText } from './parser';
import { buildHTML } from './render';
// from packages
import { calculate, Generations, Pokemon, Move, Field, Side } from '@smogon/calc';
import { parse } from 'node-html-parser';
import { getMoveEffectiveness } from '@smogon/calc/src/mechanics/util';
import { AbilityName, NatureName, TypeName } from '@smogon/calc/src/data/interface';
import { ItemName } from '@smogon/calc/dist/data/interface';
//import { getKOChance } from '@smogon/calc/dist/desc';

/**
* frontend server depends upon this
* @param {string} text1 - string containing team1 data
* @param {string} text2 - string containing team2 data
* @param {any} field - json object containing field data used for calculations
* @return a json response containing the html/text to fill results
*/
export async function runCalculations(text1: string, text2: string, field: any): Promise<string> {
    // html response
    let html = `<h1>Error</h1>`;
    let errorflag: boolean = false;

    // data
    let team1Text: string = "";
    let team1Data: PokemonData[] = [];
    let team2Text: string = "";
    let team2Data: PokemonData[] = [];

    // condition for meta paste to be used
    if(text1.trim() === "") {
        text1 = field.metapaste;
    }

    if(text2.trim() === "") {
        text2 = field.metapaste;
    }

    // validate textbox1
    try {
        // get text from pokepaste dom
        team1Text = await getText(text1);
        // parse the text into pokemon object data, see 'parser.ts'
        team1Data = parseText(team1Text);
    } catch(error) {
        errorflag = true;
        html += `
        <p>There is something wrong with the input for textbox1: ${error}</p>
        `;
    }

    // validate textbox2
    try {
        // get text from pokepaste dom
        team2Text = await getText(text2);
        // parse the text into pokemon object data, see 'parser.ts'
        team2Data = parseText(team2Text);
    } catch(error) {
        errorflag = true;
        html += `
        <p>There is something wrong with the input for textbox2: ${error}</p>
        `;
    }

    if(!errorflag) {
        html = ``;
        // get field conditions
        const fieldAttacker = parseField(field, true);
        const fieldDefender = parseField(field, false);
        const level = field.level;
        // calculate the results
        const resultsAttack = await calculateResults(team1Data, team2Data, fieldAttacker, level);
        const resultsDefend = await calculateResults(team2Data, team1Data, fieldDefender, level);
        html += buildHTML(resultsAttack, resultsDefend);
    }

    return html;
}


/**
* function to get the pokepaste text from the txt file or pokepast.es link
* @param {string} paste - string from the textbox
* @returns pokemon paste text in raw form or returns same string if its not a pokepaste link.
*/
async function getText(paste: string): Promise<string> {
    if (paste.includes("https://pokepast.es/" )) {    
        // have to do a fetch GET request on the pokepaste link
        // get the html text from the response and parse it
        try {
            const response = await fetch(paste);
            const html = await response.text();
            // using node-html-parser for this
            const doc = parse(html);
            const articles = doc.querySelectorAll("article");
            // the pokemon paste string that will be returned
            let pokepaste = "";
            // loop through each article (pokemon)
            articles.forEach(article => {
                // get all of the lines in an article
                const lines = article.innerText.trim().split("\n");
                // some braindead span tags need to be replaced
                lines.forEach(line => {
                    line = line.replace(/<\/?span[^>]*>/g,"");
                    pokepaste += line + "\n";
                });
                pokepaste += "\n";
            });
            return pokepaste;
        } catch(error) {
            console.log("error in getText(). Failed to fetch from https://pokepast.es/");
            throw new Error(error);
            //return '';
        }
    } else {
        return paste;
    }
}

/**
* Field conditions that are one-sided
* @param {any} side - field data to transfer
* @returns a side typed object
*/
function parseSide(side: any): Side {
    let sideField = new Side();
    // hazards
    sideField.spikes = side.spikes;
    sideField.isSR = side.isSR;
    // dmg red
    sideField.isReflect = side.isReflect;
    sideField.isLightScreen = side.isLightScreen;
    sideField.isAuroraVeil = side.isAuroraVeil;
    sideField.isFriendGuard = side.isFriendGuard;
    // dmg amp
    sideField.isHelpingHand = side.isHelpingHand;
    sideField.isBattery= side.isBattery;
    sideField.isPowerSpot = side.isPowerSpot;
    // misc
    sideField.isFlowerGift = side.isFlowerGift;
    sideField.isSeeded = side.isSeeded;
    sideField.isSwitching = side.isSwitching;

    return sideField;
}

/**
* Parse the field conditions out of the data passed from frontend
* @param {any} field - the json object containing field conditions
* @param {boolean} side - represents what side the pov is from
* @returns a field object
*/
function parseField(field: any, side: boolean): Field {
    let attackerSide = parseSide(field.attackerSide);
    let defenderSide = parseSide(field.defenderSide);
    const fieldSettings: Partial<Field> = {
        gameType: field.gameType,
        terrain: field.terrain,
        weather: field.weather,
        isMagicRoom: field.isMagicRoom,
        isWonderRoom: field.isWonderRoom,
        isGravity: field.isGravity,
        isBeadsOfRuin: field.isBeadsOfRuin,
        isTabletsOfRuin: field.isTabletsOfRuin,
        isSwordOfRuin: field.isSwordOfRuin,
        isVesselOfRuin: field.isVesselOfRuin,
        // if side is true then left else right
        attackerSide: side ? attackerSide : defenderSide,
        defenderSide: side ? defenderSide: attackerSide
        // add other optional properties if needed
    };
    //console.log("--------");
    //console.log(side);
    //console.log(fieldSettings);
    return new Field(fieldSettings);
}

/**
* Get all the results possible based on one move
* @param {any} gen - generation (9)
* @param {} attacker - attacking pokemon data
* @param {} teraAttacker - attacking pokemon data
* @param {} defender - defending pokemon data
* @param {} teraDefender - defending pokemon data
* @param {} move - move data
* @param {} field - field conditions
* @returns - list of results for the move
*/
function calcResultsOfMove(
    gen: any,
    move: string,
    attacker: Pokemon, 
    teraAttacker: Pokemon, 
    defender: Pokemon,
    teraDefender: Pokemon,
    field: Field
): any[] {
    const results: any[] = [];
    const moveData = new Move(gen, move.toString());

    // skip if move is a status move
    if (moveData.category === "Status") {
        return results;
    }
    let result: any;

    // ogerpon ivy cudgel, fire, water, rock condition
    if(moveData.name.toLowerCase() == "ivy cudgel") {
        if(attacker.name == "Ogerpon-Wellspring") {
            moveData.type = "Water";
        } else if(attacker.name == "Ogerpon-Hearthflame") {
            moveData.type = "Fire";
        } else if(attacker.name == "Ogerpon-Cornerstone") {
            moveData.type = "Rock"
        }
    }

    // get effectiveness vs unchanged defender
    let baseEffectiveness: number = getBaseEffectiveness(
        gen,
        moveData,
        defender.types
    )
    // effectiveness vs terad defender
    let teraEffectiveness: number = getMoveEffectiveness(
        gen,
        moveData,
        teraDefender.teraType as TypeName
    )
    
    //console.log(`move: ${moveData.name}`);
    //console.log(`base: ${baseEffectiveness}`);
    //console.log(`tera: ${teraEffectiveness}`);
    
    // unchanged attacker vs unchanged defender
    result = calculate(
        gen,
        attacker,
        defender,
        moveData,
        field
    );
    results.push(result);

    // tera type activates if tera blast or tera is same type as move or tera type is stellar
    if(move.toString() === "Tera Blast" || 
    teraAttacker.teraType == moveData.type ||
    teraAttacker.teraType?.toLowerCase() == "stellar" as TypeName) {
        // open stellar
        if(teraAttacker.teraType?.toLowerCase() == "stellar" as TypeName) {
            moveData.isStellarFirstUse = true;
        }
        // get results
        result = calculate(
            gen,
            teraAttacker,
            defender,
            moveData,
            field
        );
        results.push(result);
        if(teraEffectiveness != baseEffectiveness && teraDefender.teraType != "" as TypeName) {
            result = calculate(
                gen,
                teraAttacker,
                teraDefender,
                moveData,
                field
            );
            results.push(result);
        }
        // close stellar
        if(teraAttacker.teraType?.toLowerCase() == "stellar" as TypeName) {
            moveData.isStellarFirstUse = false;
        }
    }

    if(teraEffectiveness != baseEffectiveness && teraDefender.teraType != "" as TypeName) {
        result = calculate(
            gen,
            attacker,
            teraDefender,
            moveData,
            field
        );
        results.push(result);
    }

    // acrobatics clause, remove item
    if(moveData.name.toLowerCase() == "acrobatics" && 
    attacker.item != undefined && 
    teraAttacker.item != undefined) {
        // save item
        let item = attacker.item;
        // remove item
        attacker.item = undefined;
        teraAttacker.item = undefined;
        // run calcs
        results.push(...calcResultsOfMove(
            gen,
            move,
            attacker,
            teraAttacker,
            defender,
            teraDefender,
            field
        ));
        // put items back after calc
        attacker.item = item;
        teraAttacker.item = item;
    }
    return results;
}

/**
 * Calculate how effective a move will be versus a set of types
 * @param {any} gen - generation (9)
 * @param {Move} moveData - 
 * @param {TypeName[]} types - 
 * @returns a number corresponding to the move effectiveness
 */
// gonna have to ignore abilities for now
function getBaseEffectiveness(gen: any, moveData: Move, types: TypeName[]): number {
    // get effectiveness
    let base1: number;
    let base2: number;

    base1 = getMoveEffectiveness(
        gen,
        moveData,
        types[0]
    );
    // two types
    if(types.length == 2) {
        base2 = getMoveEffectiveness(
            gen,
            moveData,
            types[1]
        );
        // make sure there is no immunity
        if(base1 == 0 || base2 == 0) {
            return 0;
        } else {
            return base1 * base2;
        }
    } else {
        return base1;
    }
}

/**
* Runs all the calculations between team1 and team2
* @param {PokemonData[]} team1 - List of all the pokemon in team1
* @param {PokemonData[]} team2 - List of all the pokemon in team2
* @param {Field} field - field conditions
* @param {number} level - level that all pokemon will automatically get turned into
* @returns a list of results
*/
async function calculateResults(team1: PokemonData[], team2: PokemonData[], field: Field, level: number): Promise<any[]> {
    // gen 9 by default
    //let gen: typeof Generations = (Generations as typeof Generations).get(9);
    const gen = Generations.get(9);
    //const gen = 9;
    // store each result in an array
    const results: any[] = [];
    //double for loop to get through each matchup
    team1.forEach(pokemon1 => {
        // check auto level flag for attacker
        if(level > 0) {
            pokemon1.setLevel(level);
        }
        let attacker: any = undefined;
        let teraAttacker: any = undefined;
        try {
            attacker = toPokemon(gen, pokemon1, false);
            teraAttacker = toPokemon(gen, pokemon1, true);
        } catch (error) {
            console.log(`Attacker ${pokemon1._Name} missing.`);
            results.push(0);
        }
        // making sure attacker exists
        if(attacker != undefined && teraAttacker != undefined) {
            //console.log(attacker);
            team2.forEach(pokemon2 => {
                // check auto level flag for attacker
                if(level > 0) {
                    pokemon2.setLevel(level);
                }
                let defender: any = undefined;
                let teraDefender: any = undefined;
                try {
                    defender = toPokemon(gen, pokemon2, false);
                    teraDefender = toPokemon(gen, pokemon2, true);
                } catch (error) {
                    console.log(`Defender ${pokemon2._Name} missing.`);
                    results.push(0);
                }
                if(defender != undefined && teraDefender != undefined) {
                    // loop through each move
                    pokemon1._Moveset.forEach(move => {
                        results.push(...calcResultsOfMove(
                            gen,
                            move,
                            attacker,
                            teraAttacker,
                            defender,
                            teraDefender,
                            field
                        ));
                    }); 
                }
                // add a skip to know there is a new defender mon
                //results.push(undefined);
                results.push(2);
            });
        }
        // add a skip to know there is a new attacker mon
        //results.push(undefined);
        results.push(1);
    });
    return results;
}


/**
* Turns PokemonData into a Pokemon object used by the calculator
* @param {any} gen -
* @param {PokemonData} pokemon - 
* @param {boolean} teraflag - whether to turn tera on or off
* @returns 
*/
function toPokemon(gen: any, pokemon: PokemonData, teraflag: boolean): Pokemon {
    const pokemonName = pokemon._Name.toString();
    const item = pokemon._Item.toString() as ItemName;
    const nature = pokemon._Nature.toString() as NatureName;
    const ability = pokemon._Ability.toString() as AbilityName; 
    const level = pokemon._Level;
    //let tera: any = pokemon._Tera.toString(); 
    let tera: TypeName = pokemon._Tera.toString() as TypeName; 
    const evs = {
        hp: pokemon._EVs.Hp,
        atk: pokemon._EVs.Atk,
        def: pokemon._EVs.Def,
        spa: pokemon._EVs.SpA,
        spd: pokemon._EVs.SpD,
        spe: pokemon._EVs.Spe
    };
    const ivs = {
        hp: pokemon._IVs.Hp,
        atk: pokemon._IVs.Atk,
        def: pokemon._IVs.Def,
        spa: pokemon._IVs.SpA,
        spd: pokemon._IVs.SpD,
        spe: pokemon._IVs.Spe
    };
    const boosts = {
        hp: pokemon._Boosts.Hp,
        atk: pokemon._Boosts.Atk,
        def: pokemon._Boosts.Def,
        spa: pokemon._Boosts.SpA,
        spd: pokemon._Boosts.SpD,
        spe: pokemon._Boosts.Spe
    }

    let newPokemon: any;
    try {
        // create new pokemon object
        newPokemon = new Pokemon(gen, pokemonName);
        // add the attributes
        newPokemon.item = item;
        newPokemon.nature = nature
        newPokemon.ability = ability;
        newPokemon.level = level;
        newPokemon.evs = evs;
        newPokemon.ivs = ivs;
        newPokemon.boosts = boosts;
        if(teraflag) {
            newPokemon.teraType = tera;
        }
        // booster energy
        if(item.toLowerCase() == "booster energy") {
            newPokemon.boostedStat = "auto";
        }
    } catch (error) {
        // cause of pokemonName not existing in calc yet
        throw new Error(error);
    }
    return newPokemon;
}
