import { PokemonData } from './pokemonData.js';
import { parseText } from './parser.js';

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
    
}

main();


