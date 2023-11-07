import { PokemonData } from './pokemonData.js';
import { parseText } from './parser.js';
import {calculate, Generations, Pokemon, Move} from '@smogon/calc';

import { parse } from 'node-html-parser';


// run with CLI arguments for pokepastes
async function main() {
    if(checkArguments()) {
        const team1Text = await getText(Bun.argv[2]);
        const team2Text = await getText(Bun.argv[3]);

        console.log(team1Text);
        console.log(team2Text);
    }
}

function checkArguments() {
    // error check for command line args

    if(Bun.argv.length === 4) {
        // get teams
        const arg1 = Bun.argv[2];
        const arg2 = Bun.argv[3];

        // check arg1
        if(!arg1.includes(".txt") && !arg1.includes("https://pokepast.es/")) {
            console.log("Argument 1 must be a pokepaste link or a txt file.");
            return false;
        // check arg2
        } else if(!arg2.includes(".txt") && !arg2.includes("https://pokepast.es/")) {
            console.log("Argument 2 must be a pokepaste link or a txt file.");
            return false;
        // both args good
        } else {
            return true;
        }
    } else {
        console.log("Run with two command line arguments.");
        console.log("bun run main.js <team1paste.txt> <team2paste.txt>");
        return false;
    }
}

async function getText(file) {
    // check if textfile
    if(file.includes(".txt")) {
        return await Bun.file(file).text(); 
    // check if pokepaste link
    } else if(file.includes("https://pokepast.es/")) {
        try {
            const response = await fetch(file);
            const html = await response.text();
            // using node-html-parser for this
            const doc = parse(html);
            const articles = doc.querySelectorAll("article");
            // the pokemon paste string that will be returned
            var pokepaste = "";
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
        }
    } else {
        console.log("Invalid text file type.");
        return 0;
    }
}



// starts the calculations
async function main1() {
    // use txt file as replacement for
    //const filePath = "test.txt";
    //const textFile = Bun.file(filePath);

    const arg1 = Bun.argv[2];
    const arg2 = Bun.argv[3];

    console.log(arg1);
    console.log(arg2);

    // contents as a string
    const text = await textFile.text(); 
    console.log(text);
    // contents as ReadableStream
    //const text2 = await textFile.stream();
    //console.log(text2); 
    // contents as ArrayBuffer
    //await foo.arrayBuffer(); 

    const teamText1 = parseText(text);
    
    teamText1.forEach(pokemon => {
        pokemon.printPokemon();
        console.log(pokemon);
    });

    const pokemonJSON = JSON.stringify(teamText1);
    const path = "pokemonData.json";
    await Bun.write(path, pokemonJSON);
    const file = Bun.file(path);
    const team1 = await file.json();
    const team2 = team1;

    const resultsAttackerSide = calc(team1, team2);
    const resultsDefenderSide = calc(team2, team1);
    //console.log(resultsAttackerSide);
}


async function calc(team1, team2) {
    // gen by default
    const gen = Generations.get(9);

    //const pokemon1 = toPokemon(gen, pokemonData[0]);
    //const pokemon2 = toPokemon(gen, pokemonData[1]);

    //double for loop to get through each matchup
    team1.forEach(pokemon1 => {
        const attacker = toPokemon(gen, pokemon1);
        team2.forEach(pokemon2 => {
            const defender = toPokemon(gen, pokemon2);
            // loop through each move
            pokemon1._Moveset.forEach(move => {
                const result = calculate(
                    gen,
                    attacker,
                    defender,
                    new Move(gen, move.toString())
                );
                console.log(result.desc());
            }); 
        });
    });

}

function toPokemon(gen, pokemon) {
    return new Pokemon(
        gen,
        pokemon._Name.toString(),
        {
            item: pokemon._Item.toString(),
            nature: pokemon._Nature.toString(),
            evs: {
                hp: pokemon._EVs.Hp,
                atk: pokemon._EVs.Atk,
                def: pokemon._EVs.Def,
                spa: pokemon._EVs.SpA,
                spd: pokemon._EVs.SpD,
                spe: pokemon._EVs.Spe
            },
        }
    );
}

main();


