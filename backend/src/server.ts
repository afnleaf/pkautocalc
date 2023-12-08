import { parseText } from './parser.ts';
import { calculate, Generations, Pokemon, Move, Field } from '@smogon/calc';
import { parse } from 'node-html-parser';
import { PokemonData } from './pokemonData.ts';

type BaseStats = {
    Hp: number;
    Atk: number;
    Def: number;
    SpA: number;
    SpD: number;
    Spe: number;
};

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

function buildHTML(resultsAttack: any[], resultsDefense: any[]): string {
    let html = ``;
    html += `
    <h1>Results</h1>
    <h2>Attack</h2>
    `;
    resultsAttack.forEach(result => {
        try {
            html += `<p>${result.desc()}</p>`;
        } catch (error) {
            //console.log(error);
            html += `<p>0</p>`;
            //html += `<p>${result.desc()}</p>`;
        }
    });
    html += `
    <h2>Defense</h2>
    `;
    resultsDefense.forEach(result => {
        //html += `<p>${result.desc()}</p>`;
        try {
            html += `<p>${result.desc()}</p>`;
        } catch (error) {
            //console.log(error);
            html += `<p>0</p>`;
            //html += `<p>${result.desc()}</p>`;
        }
    });
    return html;
}

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


// function to get the pokepaste text from the txt file or pokepast.es link
async function getText(file: string): Promise<string> {
    /*
    // textfile
    if (file.includes(".txt")) {
        return await Bun.file(file).text();
    // pokepaste link
    } else if (file.includes("https://pokepast.es/")) {
    */
    if (file.includes("https://pokepast.es/")) {    
        // have to do a fetch GET request on the pokepaste link
        // get the html text from the response and parse it
        try {
            const response = await fetch(file);
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
            console.log(error);
            throw new Error(error);
            //return '';
        }
    } else {
        console.log("Invalid text file type.");
        throw new Error("Invalid text file type.");
        //return '';
    }
}

/*
function getField(): Field {
    // default settings
    const gameType = "Doubles";
    return new Field(gameType);
}
*/

function getField(): Field {
    // default settings
    const gameType: "Doubles" = "Doubles";
    const fieldSettings: Partial<Field> = {
        gameType: gameType,
        // Add other optional properties if needed
    };
    return new Field(fieldSettings);
}



async function calc(team1: PokemonData[], team2: PokemonData[], field: Field): Promise<any[]> {
    // gen 9 by default
    //let gen: typeof Generations = (Generations as typeof Generations).get(9);
    //const gen = Generations.get(9);
    const gen = 9;
    // store each result in an array
    const results: any[] = [];

    //const pokemon1 = toPokemon(gen, pokemonData[0]);
    //const pokemon2 = toPokemon(gen, pokemonData[1]);

    //console.log(team1);
    //console.log(team2);

    //double for loop to get through each matchup
    team1.forEach(pokemon1 => {
        const attacker = toPokemon(gen, pokemon1);
        team2.forEach(pokemon2 => {
            const defender = toPokemon(gen, pokemon2);
            // loop through each move
            pokemon1._Moveset.forEach(move => {
                // filter out status moves
                const moveData = new Move(gen, move.toString());
                if (moveData.category !== "Status") {
                    const result = calculate(
                        gen,
                        attacker,
                        defender,
                        moveData,
                        field
                    );
                    //console.log(result.desc());
                    //results.push(result.desc());
                    results.push(result);
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

//function toPokemon(gen: typeof Generations, pokemon: PokemonData): Pokemon {
//ability
function toPokemon(gen: any, pokemon: PokemonData): Pokemon {
    const pokemonName = pokemon._Name.toString();
    const item = pokemon._Item.toString();
    const nature = pokemon._Nature.toString();
    const evs = {
        hp: pokemon._EVs.Hp,
        atk: pokemon._EVs.Atk,
        def: pokemon._EVs.Def,
        spa: pokemon._EVs.SpA,
        spd: pokemon._EVs.SpD,
        spe: pokemon._EVs.Spe
    };
    return new Pokemon(
        gen,
        pokemonName,
        {
            item: item,
            nature: nature,
            evs: evs,
        }
    );
}

// Uncomment and fix the types if needed
// const result = runCalculations('text1', 'text2');
// console.log(result);
