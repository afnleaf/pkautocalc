export { };

const path = "file.txt";

// get request
// https://www.smogon.com/stats/2024-01/chaos/gen9vgc2024regfbo3-1760.json
let data: any;
try {
    const response = await fetch("https://www.smogon.com/stats/2024-02/chaos/gen9vgc2024regfbo3-1760.json");
    data = await response.json();
    console.log(response);
} catch (error) {
    console.log(error);
}

// parse object
//console.log(data.data.length);

// loop through each and add name to 

//const dataArray = Object.values(data.data);
//console.log(dataArray);
let list: any = [];

const pokemon = data.data;
for(const key in pokemon) {
    if(Object.prototype.hasOwnProperty.call(pokemon, key)) {
        const value = pokemon[key];
        //console.log(key);
        //console.log(value);

        value.name = key;
        list.push(value);
    }
}

list.sort((a: any, b: any) => b.usage - a.usage);
//console.log(list.slice(0,24));
let text = ``;
for(let i = 0; i < 64; i++) {
    const poke = list[i];

    // name
    const name = poke.name;
    //console.log(name);
    // item
    const itemsArr = Object.entries(poke.Items);
    itemsArr.sort((a: any, b: any) => b[1] -  a[1]);
    const item = itemsArr[0][0];
    //console.log(item);
    // ability
    const abilitiesArr = Object.entries(poke.Abilities);
    abilitiesArr.sort((a: any, b: any) => b[1] -  a[1]);
    const ability = abilitiesArr[0][0];
    //console.log(ability);
    // EVs + Nature
    const spreadsArr = Object.entries(poke.Spreads);
    spreadsArr.sort((a: any, b: any) => b[1] -  a[1]);
    const spread = spreadsArr[0][0];
    //console.log(spread);
    const parsed = spread.split(":");
    const nature = parsed[0];
    const evs = parsed[1].split("/");
    //console.log(nature);
    //console.log(evs);
    
    // moves
    const movesArr = Object.entries(poke.Moves);
    movesArr.sort((a: any, b: any) => b[1] -  a[1]);

    /*
    console.log(`${name} @ ${item}`)
    console.log(`Ability: ${ability}`);
    console.log(`Level: 50`);
    console.log(`Tera Type: ?`);
    process.stdout.write("EVs: ");
    process.stdout.write(`${evs[0]} HP / `);
    process.stdout.write(`${evs[1]} Atk / `);
    process.stdout.write(`${evs[2]} Def / `);
    process.stdout.write(`${evs[3]} SpA / `);
    process.stdout.write(`${evs[4]} SpD / `);
    process.stdout.write(`${evs[5]} Spe\n`);
    console.log(`${nature} Nature`);
    for(let i = 0; i < 10; i++) {
        console.log(`- ${movesArr[i][0]}`);
    }
    console.log();
    */
    //IVs
    //tera type

    
    text += `${name} @ ${item}\nAbility: ${ability}\n`;
    text += `Level: 50\n`;
    text += `Tera Type: ?\n`;
    text += `EVs: ${evs[0]} HP / ${evs[1]} Atk / ${evs[2]} Def / ${evs[3]} SpA / ${evs[4]} SpD / ${evs[5]} Spe\n`;
    text += `${nature} Nature\n`;
    for(let i = 0; i < 10; i++) {
        text += `- ${movesArr[i][0]}\n`;
    }
    text += `\n`;
}
console.log(text);
await Bun.write(path, text);

/*
Flutter Mane @ Choice Specs  
Ability: Protosynthesis  
Level: 50  
Tera Type: Fairy  
EVs: 228 HP / 156 Def / 36 SpA / 20 SpD / 68 Spe  
Modest Nature  
IVs: 0 Atk  
- Moonblast  
- Shadow Ball  
- Dazzling Gleam  
- Thunderbolt  
*/
