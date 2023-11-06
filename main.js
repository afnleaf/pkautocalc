import { PokemonData } from './pokemonData.js';
import { parseText } from './parser.js';
import {calculate, Generations, Pokemon, Move} from '@smogon/calc';

// starts the calculations
async function main() {
    console.log("main()");
    // use txt file as replacement for
    const filePath = "test.txt";
    const textFile = Bun.file(filePath);

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


