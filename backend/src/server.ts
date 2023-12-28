import { calculate, Generations, Pokemon, Move, Field } from '@smogon/calc';
import { Sprites, Icons } from '@pkmn/img';
import { parse } from 'node-html-parser';
import { PokemonData } from './pokemonData';
import { parseText } from './parser';
// for move effectiveness
import { getMoveEffectiveness } from '@smogon/calc/src/mechanics/util';
import { TypeName } from '@smogon/calc/src/data/interface';
//import { getKOChance } from '@smogon/calc/dist/desc';

type BaseStats = {
    Hp: number;
    Atk: number;
    Def: number;
    SpA: number;
    SpD: number;
    Spe: number;
};

// frontend server depends upon this
export async function runCalculations(text1: string, text2: string, field: any): Promise<string> {
    // html response
    let html = `<h1>Error</h1>`;
    let errorflag: boolean = false;

    // data
    let team1Text: string = "";
    let team1Data: PokemonData[] = [];
    let team2Text: string = "";
    let team2Data: PokemonData[] = [];

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
        <p>There is something wrong with the input for textbox1: ${error}</p>
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
        <p>There is something wrong with the input for textbox2: ${error}</p>
        `;
    }

    if(!errorflag) {
        html = ``;
        // get field conditions
        const fieldSettings = parseField(field);
        const level = field.level;
        // calculate the results
        const resultsAttack = await calc(team1Data, team2Data, fieldSettings, level);
        const resultsDefend = await calc(team2Data, team1Data, fieldSettings, level);
        html += buildHTML(resultsAttack, resultsDefend);
    }

    return html;
}

function gradeKOChanceAttack(n: number): number {
    if(n === 1) {
        // green
        return 1;
    } else if(n === 2 || n === 3) {
        // orange
        return 0.5;
    } else {
        // red
        return 0;
    }
} 

function gradeKOChanceDefend(n: number): number {
    if(n === 1) {
        // red
        return 0;
    } else if(n === 2 || n === 3) {
        // orange
        return 0.5;
    } else {
        // green
        return 1;
    }
}

function gradeAttack(resultsAttack: any[]): string {
    let html: string = ``;
    let score: number = 0;
    resultsAttack.forEach(result => {
        try {
            score += gradeKOChanceAttack(result.kochance().n);
        } catch (error) {
            score += 0;
        } 
    });
    html += `${score}/${resultsAttack.length}`;
    return html;
}

function gradeDefense(resultsDefense: any[]): string {
    let html: string = ``;
    let score: number = 0;
    resultsDefense.forEach(result => {
        try {
            score += gradeKOChanceDefend(result.kochance().n);
        } catch (error) {
            score += 0;
        } 
    });
    html += `${score}/${resultsDefense.length}`;
    return html;
}

// start the html rendering process
function buildHTML(resultsAttack: any[], resultsDefense: any[]): string {
    let html: string = ``;
    
    // attack
    html += `
    <h1>Results</h1>
    <h2>Attacking</h2>
    `;
    // get test score for all of attack
    html += `
    <p>${gradeAttack(resultsAttack)}</p>
    `;
    // get individual results
    let prevAttacker = "";
    let prevDefender = "";
    resultsAttack.forEach(result => {
        html += renderResult(result, prevAttacker, prevDefender, true);
        prevAttacker = result.attacker.name;
        prevDefender = result.defender.name;
    });
    
    // defense
    html += `
    <br>
    <h2>Defending</h2>
    `;
    // get test score for all of defense
    html += `
    <p>${gradeDefense(resultsDefense)}</p>
    `;
    prevAttacker = "";
    prevDefender = "";
    resultsDefense.forEach(result => {
       html += renderResult(result, prevAttacker, prevDefender, false);
       prevAttacker = result.attacker.name;
       prevDefender = result.defender.name;
    });
    return html;
}


// render customized result html
function renderResult(result: any, prevAttacker: string, prevDefender: string, side: boolean): string {
    let html: string = ``;
    // create a visual break between new attacking pokemon
    if(result.attacker.name != prevAttacker) {
        html += `<br>`;
        const {url, w, h, pixelated} = Sprites.getPokemon(result.attacker.name);
        html += `<img src="${url}" width="${w}" height="${h}">`;
        html += `<h3>${result.attacker.name}</h3>`
        //if (pixelated) img.style.imageRendering = 'pixelated';
        //const icon = document.createElement('span');
        //icon.style = Icons.getItem('Choice Band').style;
        prevDefender = "";
    }
    // create a visual break between new defending pokemon
    if(result.defender.name != prevDefender) {
        // const {url, w, h, pixelated} = Sprites.getPokemon(result.attacker.name);
        // const {url, w, h, pixelated} = Sprites.getPokemon(result.defender.name);
        const attackerSprite = Sprites.getPokemon(result.attacker.name);
        const defenderSprite = Sprites.getPokemon(result.defender.name);
        const {url: urlA, w: wA, h: hA} = attackerSprite;
        const {url: urlD, w: wD, h: hD} = defenderSprite;
        html += `<img src="${urlA}" width="${wA*0.4}" height="${hA*0.4}"> vs. <strong>${result.defender.name}</strong> <img src="${urlD}" width="${wD*0.4}" height="${hD*0.4}">`;
        //html += `<h5></h5>`
    }

    
    try {
        //console.log("----");
        //console.log(result.kochance());
        //console.log(result.desc());
        const s: string[] = result.desc().split('--');
        let colour: string;
        if(side){
            colour = getKOChanceColourAttack(result.kochance().n);
        } else {
            colour = getKOChanceColourDefend(result.kochance().n);
        }
        html += `<p>${s[0]} -- <span style="color:${colour}"><strong>${s[1] || "Light chip"}</strong></span></p>`;
    } catch (error) {
        // console.log(error);
        // branch required for desc() error, print our own immunity text
        // Attacker-name Move-name vs. Defender-name: 0-0 (0.0-0.0%) -- Immunity
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
        let colour: string;
        if(side) {
            colour = "#d85146";
        } else {
            colour = "#50a95f";
        }
        let end = `<span style="color:${colour};"><strong>Immunity</strong></span>`
        let text = `${teraAtk} ${result.attacker.name} ${result.move.name} vs. ${teraDef} ${result.defender.name}: 0-0 (0.0-0.0%) -- ${end}`;
        html += `<p>${text}</p>`;
        //html += `<p>${result.desc()}</p>`;
    }
    return html;
}


function getKOChanceColourAttack(n: number): string {
    if(n === 1) {
        // green
        return "#50a95f";
    } else if(n === 2 || n === 3) {
        // orange
        return "#f3a02f";
    } else {
        // red
        return "#d85146";
    }
} 

function getKOChanceColourDefend(n: number): string {
    if(n === 1) {
        // red
        return "#d85146";
    } else if(n === 2 || n === 3) {
        // orange
        return "#f3a02f";
    } else {
        // green
        return "#50a95f";
    }
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

/*
function getField(): Field {
    // default settings
    const gameType: "Doubles" = "Doubles";
    const fieldSettings: Partial<Field> = {
        gameType: gameType,
        // Add other optional properties if needed
    };
    return new Field(fieldSettings);
}
*/

function parseField(field: any): Field {
    // default settings
    const fieldSettings: Partial<Field> = {
        gameType: field.gameType,
        terrain: field.terrain,
        // add other optional properties if needed
    }
    return new Field(fieldSettings);
}

async function calc(team1: PokemonData[], team2: PokemonData[], field: Field, level: number): Promise<any[]> {
    // gen 9 by default
    //let gen: typeof Generations = (Generations as typeof Generations).get(9);
    const gen = Generations.get(9);
    //const gen = 9;
    // store each result in an array
    const results: any[] = [];

    //console.log(level);

    //double for loop to get through each matchup
    team1.forEach(pokemon1 => {
        // check auto level flag for attacker
        if(level > 0) {
            pokemon1.setLevel(level);
        }
        const attacker = toPokemon(gen, pokemon1, false);
        const teraAttacker = toPokemon(gen, pokemon1, true);
        //console.log(attacker);
        team2.forEach(pokemon2 => {
            // check auto level flag for attacker
            if(level > 0) {
                pokemon2.setLevel(level);
            }
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


function toPokemon(gen: any, pokemon: PokemonData, teraflag: boolean): Pokemon {
    const pokemonName = pokemon._Name.toString();
    const item = pokemon._Item.toString();
    const nature = pokemon._Nature.toString();
    const ability = pokemon._Ability.toString();
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
                teraType: tera,
                level: level
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
                level: level
            }
        );
    }
}

