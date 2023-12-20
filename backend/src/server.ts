import { calculate, Generations, Pokemon, Move, Field } from '@smogon/calc';
import { parse } from 'node-html-parser';
import { PokemonData } from './pokemonData';
import { parseText } from './parser';
// for move effectiveness
import { getMoveEffectiveness } from '@smogon/calc/src/mechanics/util';
import { TypeName } from '@smogon/calc/src/data/interface';

type BaseStats = {
    Hp: number;
    Atk: number;
    Def: number;
    SpA: number;
    SpD: number;
    Spe: number;
};

// frontend server depends upon this
export async function runCalculations(text1: string, text2: string): Promise<string> {
    // html response
    let html = `<h1>Error</h1>`;
    let errorflag: boolean = false;

    // data
    let team1Text;
    let team1Data;
    let team2Text;
    let team2Data;

    //console.log(process.env.METAPASTE);
    // condition for meta paste
    if(text2.trim() === "") {
        //console.log(`-${text2}-`);
        text2 = "https://pokepast.es/dc1eac2d8740c97b";
        //text2 = process.env.METAPASTE.toString();
    }

    // validate textbox1
    try {
        //
        team1Text = await getText(text1);
        // parse the text into pokemon object data, see 'parser.ts'
        team1Data = parseText(team1Text);
        /*
        team1Data.forEach(pokemon => {
            console.log(pokemon);
            pokemon.printPokemon();
        });
        */
    } catch(error) {
        errorflag = true;
        html += `
        <p>There is something wrong with the input for textbox1.</p>
        `;
    }

    // validate textbox2
    try {
        //
        team2Text = await getText(text2);
        // parse the text into pokemon object data, see 'parser.ts'
        team2Data = parseText(team2Text);
    } catch(error) {
        errorflag = true;
        html += `
        <p>There is something wrong with the input for textbox2.</p>
        `;
    }

    if(!errorflag) {
        html = ``;
        // get field conditions
        const field = getField();
        // calculate the results
        const resultsAttack = await calc(team1Data, team2Data, field);
        const resultsDefend = await calc(team2Data, team1Data, field);
        html += buildHTML(resultsAttack, resultsDefend);
    }

    return html;
}



function buildHTML(resultsAttack: any[], resultsDefense: any[]): string {
    let html = ``;
    html += `
    <h1>Results</h1>
    <h2>Attack</h2>
    `;
    resultsAttack.forEach(result => {
        html += getResult(result);
    });
    html += `
    <h2>Defense</h2>
    `;
    resultsDefense.forEach(result => {

       html += getResult(result);
    });
    return html;
}

// render customized result html
function getResult(result: any): string {
    let html = ``;
    //Attacker-name Move-name vs. Defender-name: 0-0 (0.0-0.0%) -- Immunity
    try {
        html += `<p>${result.desc()}</p>`;
    } catch (error) {
        //console.log(error);
        let teraAtk: string;
        if(result.attacker.teraType) {
            teraAtk = `Tera ${result.attacker.teraType}`;
        } else {
            teraAtk = ``;
        }
        let teraDef: string;
        if(result.defender.teraType) {
            teraDef = `Tera ${result.defender.teraType}`;
        } else {
            teraDef = ``;
        }
        let text = `${teraAtk} ${result.attacker.name} ${result.move.name} vs. ${teraDef} ${result.defender.name}: 0-0 (0.0-0.0%) -- Immunity`;
        html += `<p>${text}</p>`;
        //html += `<p>${result.desc()}</p>`;
    }
    return html;
}


// function to get the pokepaste text from the txt file or pokepast.es link
// returns same string if its not a pokepaste link
async function getText(paste: string): Promise<string> {
    /*
    // textfile
    if (file.includes(".txt")) {
        return await Bun.file(file).text();
    // pokepaste link
    } else if (file.includes("https://pokepast.es/")) {
    */
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
        //console.log("Invalid text file type.");
        //throw new Error("Invalid text file type.");
        //return '';
        //console.log(paste);
        return paste;
    }
}


function getField(): Field {
    // default settings
    const gameType: "Doubles" = "Doubles";
    const fieldSettings: Partial<Field> = {
        gameType: gameType,
        // Add other optional properties if needed
    };
    return new Field(fieldSettings);
}
/*
async function getCalcResult(gen: any, move: Move, attacker: Pokemon, defender: Pokemon, field: Field): Promise<any> {
    let result: any = calculate(
        gen,
        attacker,
        defender,
        move,
        field
    );
    return result;
}
*/

async function calc(team1: PokemonData[], team2: PokemonData[], field: Field): Promise<any[]> {
    // gen 9 by default
    //let gen: typeof Generations = (Generations as typeof Generations).get(9);
    const gen = Generations.get(9);
    //const gen = 9;
    // store each result in an array
    const results: any[] = [];

    //double for loop to get through each matchup
    team1.forEach(pokemon1 => {
        const attacker = toPokemon(gen, pokemon1, false);
        const teraAttacker = toPokemon(gen, pokemon1, true);
        //console.log(attacker);
        team2.forEach(pokemon2 => {
            const defender = toPokemon(gen, pokemon2, false);
            const teraDefender = toPokemon(gen, pokemon2, true);
            // loop through each move
            pokemon1._Moveset.forEach(move => {
                const moveData = new Move(gen, move.toString());
                //console.log("================================");
                //console.log(moveData);
                let result: any;
                // filter out status moves
                if (moveData.category !== "Status") {
                    // get effectiveness for conditions
                    let effectiveness: any = getMoveEffectiveness(
                        gen,
                        moveData,
                        teraDefender.teraType as TypeName
                    );
                    //console.log(effectiveness);
                    
                    // regular
                    result = calculate(
                        gen,
                        attacker,
                        defender,
                        moveData,
                        field
                    );
                    results.push(result);

                    // get tera blast with tera type activated
                    if(move.toString() === "Tera Blast") {
                        result = calculate(
                            gen,
                            teraAttacker,
                            defender,
                            moveData,
                            field
                        );
                        results.push(result);
                        // condition for tera'd terablast
                        const teraMoveData = new Move(gen, move.toString());
                        teraMoveData.type = teraAttacker.teraType as TypeName;
                        let teraEffectiveness: any = getMoveEffectiveness(
                            gen,
                            teraMoveData,
                            teraDefender.teraType as TypeName
                        );
                        if(teraEffectiveness != 1) {
                            result = calculate(
                                gen,
                                teraAttacker,
                                teraDefender,
                                teraMoveData,
                                field
                            );
                            results.push(result); 
                        }

                    }

                    //check if type of move is neutral vs tera type defender
                    if(effectiveness != 1) {
                        result = calculate(
                            gen,
                            attacker,
                            teraDefender,
                            moveData,
                            field
                        );
                        results.push(result); 
                    }

                    // check if tera attacker pokemons tera type is same type as move
                    if(teraAttacker.teraType == moveData.type) {
                        result = calculate(
                            gen,
                            teraAttacker,
                            defender,
                            moveData,
                            field
                        );
                        results.push(result); 
                        

                        // tera attacker and defender
                        if(effectiveness != 1) {
                            result = calculate(
                                gen,
                                teraAttacker,
                                teraDefender,
                                moveData,
                                field
                            );
                            results.push(result); 
                        }
                    }
                }
            }); 
        });
    });

    /*
    If you want json String
    var JsonString = JSON.stringify(JsArray);
    If you want json Object
    var JsonObject = JSON.parse(JSON.stringify(JsArray));
    */
    //return JSON.stringify(results);
    //return JSON.parse(JSON.stringify(results));
    return results;
}

//if(moveData.type teraDefender.teraType)
/*
export function getMoveEffectiveness(
gen: Generation,
move: Move,
type: TypeName,
isGhostRevealed?: boolean,
isGravity?: boolean,
isRingTarget?: boolean,
)
*/
//teraDefender.
//const gen2 = Generations.get(9);


function toPokemon(gen: any, pokemon: PokemonData, teraflag: boolean): Pokemon {
    const pokemonName = pokemon._Name.toString();
    const item = pokemon._Item.toString();
    const nature = pokemon._Nature.toString();
    const ability = pokemon._Ability.toString();
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

    // if I knew how to access the object under pokemonName and what is called, I could remove this code
    // tera on
    if(teraflag) {
        return new Pokemon(
            gen,
            pokemonName,
            {
                ability: ability,
                item: item,
                nature: nature,
                evs: evs,
                teraType: tera
            }
        );
    // tera off
    } else {
        return new Pokemon(
            gen,
            pokemonName,
            {
                ability: ability,
                item: item,
                nature: nature,
                evs: evs,
            }
        );
    }
}

// Uncomment and fix the types if needed
// const result = runCalculations('text1', 'text2');
// console.log(result);

/*
function getField(): Field {
    // default settings
    const gameType = "Doubles";
    return new Field(gameType);
}
*/

/*
export async function runCalculations(text1: string, text2: string): Promise<string> {
    // html response
    let html = ``;
    // validate string input
    if(validateText(text1)) {
        if(validateText(text2)) {
            console.log()
            const team1Text = await getText(text1);
            const team2Text = await getText(text2);
            // parse the text into pokemon object data, see 'parser.ts'
            const team1Data = parseText(team1Text);
            const team2Data = parseText(team2Text);
            // get field conditions
            const field = getField();
            // calculate the results
            const resultsAttack = await calc(team1Data, team2Data, field);
            const resultsDefend = await calc(team2Data, team1Data, field);
            html += buildHTML(resultsAttack, resultsDefend);
        } else {
            html += `
            <h1>Error</h1>
            <p>There is something wrong with the input for textbox2.</p>
            `;
        }
    } else {
        html += `
        <h1>Error</h1>
        <p>There is something wrong with the input for textbox1.</p>
        `;
    }
    return html;
}
*/

/*
function validateText(text: string): boolean {
    const urlPattern = /^https:\/\/pokepast\.es\/[0-9a-fA-F]{16}$/;
    const movesetPattern = /^[A-Za-z0-9\s@#$%^&*!()-=_+{}\[\]:;<>,./?\\|]+/;
    if(urlPattern.test(text)) {
        return true;
    } else if (movesetPattern.test(text)) {
        return true;
    }
    //otherwise fails
    return false;
}


*/

/*
//html += `<p>${result.desc()}</p>`;
try {
    html += `<p>${result.desc()}</p>`;
} catch (error) {
    //console.log(error);
    html += `<p>0</p>`;
    //html += `<p>${result.desc()}</p>`;
}
*/

//const pokemon1 = toPokemon(gen, pokemonData[0]);
//const pokemon2 = toPokemon(gen, pokemonData[1]);
//console.log(team1);
//console.log(team2);