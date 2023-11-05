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

    const team1 = parseText(text);
    
    team1.forEach(pokemon => {
        pokemon.printPokemon();
        console.log(pokemon);
    });

    const pokemonJSON = JSON.stringify(team1);
    const path = "pokemonData.json";
    await Bun.write(path, pokemonJSON);
    const file = Bun.file(path);
    const contents = await file.json();

    contents.forEach(content => {
        console.log(content);
        //content.printPokemon();
    });

    calc(contents);
}


async function calc(pokemonData) {
    const gen = Generations.get(9);

    const pokemon1 = toPokemon(gen, pokemonData[0]);
    const pokemon2 = toPokemon(gen, pokemonData[1]);
    //console.log(pokemonData[0]._Moveset[1]);

    /*
    const poke1 = new Pokemon(gen, 'Chansey', {
        item: 'Eviolite',
        nature: 'Calm',
        evs: {hp: 252, spd: 252},
    });
    */
    //console.log("pokemon1");
    //console.log(pokemon1);
    //console.log("poke1");
    //console.log(poke1);

    const result = calculate(
        gen,
        pokemon1,
        pokemon2,
        new Move(gen, pokemonData[0]._Moveset[2].toString())
    );
    //console.log(result);
    console.log(result.desc());
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


