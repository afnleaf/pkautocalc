import { Sprites, Icons } from '@pkmn/img';

const moveColours = {
	normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD',
};

/**
* Start the html rendering process
* @param {any} resultsAttack - list of results for attack
* @param {any} resultsDefense - list of results for defense
* @return an html string representing all the results
*/
export function buildHTML(resultsAttack: any[], resultsDefense: any[]): string {
    let html: string = ``;
    
    // attack
    html += `
    <h1>Results</h1>
    <a href="#Defense">Go to defense</a>
    <h2 id="Attack">Attacking</h2>
    `;
    // get test score for all of attack
    html += `
    <p>${gradeAttack(resultsAttack)}</p>
    `;
    // get individual results
    let prevAttacker = "";
    let prevDefender = "";
    resultsAttack.forEach(result => {
        if(result != undefined) {
            if(result != 0) {
                html += renderResult(result, prevAttacker, prevDefender, true);
                prevAttacker = result.attacker.name;
                prevDefender = result.defender.name;
            } else {
                html += `<p>Error: incorrect pokemon name parsed.</p>`;
            }
        } else {
            if(result != 0) {

            } else {
                prevAttacker = "";
                prevDefender = "";
            }
        }
    });
    
    // defense
    html += `
    <br>
    <a href="#Attack">Go to attack</a>
    <h2 id="Defense">Defending</h2>
    `;
    // get test score for all of defense
    html += `
    <p>${gradeDefense(resultsDefense)}</p>
    `;
    prevAttacker = "";
    prevDefender = "";
    resultsDefense.forEach(result => {
        if(result != undefined) {
            if(result != 0) {
                html += renderResult(result, prevAttacker, prevDefender, false);
                prevAttacker = result.attacker.name;
                prevDefender = result.defender.name;
            } else {
                html += `<p>Error: incorrect pokemon name parsed.</p>`;
            }
        } else {
            if(result != 0) {

            } else {
                prevAttacker = "";
                prevDefender = "";
            }
        }
    });
    html += `<a href="#Attack">Go to attack</a> | <a href="#Defense">Go to defense</a> | <a href="#Top">Go to top</a>`;
    return html;
}

/*
types of sprites
gen1rg
gen1rb
gen1
gen2g
gen2s
gen2
gen3rs
gen3frlg
gen3
gen3-2
gen4dp
gen4dp-2
gen4
gen5
gen5ani
dex
ani
*/

/**
* Render customized result html
* @param {any} result - the result to be processed
* @param {string} prevAttacker - name of the previously attacking pokemon
* @param {string} prevDefender - name of the previously defending pokemon
* @param {boolean} side - what side is the pov from true = attack, false = defense
* @return an html string representing all the results
*/
function renderResult(result: any, prevAttacker: string, prevDefender: string, side: boolean): string {
    // sprite style
    const spriteStyle = "gen5ani";
    // get sprite from @pkmn/img
    const attackerSprite = Sprites.getPokemon(result.attacker.name, {gen: spriteStyle});
    const defenderSprite = Sprites.getPokemon(result.defender.name, {gen: spriteStyle});
    const {url: urlA, w: wA, h: hA} = attackerSprite;
    const {url: urlD, w: wD, h: hD} = defenderSprite;
    // get item sprite for attacker if an item exists
    let attackerItemSprite: any;    
    if(result.attacker.item) 
        attackerItemSprite = Icons.getItem(result.attacker.item);
    let html: string = ``;
    // create a visual break between new attacking pokemon
    
    if(result.attacker.name.toUpperCase() != prevAttacker.toUpperCase()) {
        //console.log("Attacker separate.")
        //console.log(result.attacker.name);
        //console.log(prevAttacker);
        html += `<br>`;
        // pokemon sprite
        html += `<img title="${result.attacker.name}" src="${urlA}" width="${wA}" height="${hA}">`;
        // pokemon item
        if(result.attacker.item) {
            html += `<span title="${result.attacker.item}"><img style="width:24px;height:24px;image-rendering:pixelated;background: #d0d0d0 url(${attackerItemSprite.url}) no-repeat scroll ${attackerItemSprite.left}px ${attackerItemSprite.top}px; border: none; border-radius: 25px; margin: 0px 0px 0px -25px; overflow: hidden;"></span>`;
        }
        // title
        html += `<h3>${result.attacker.name}</h3>`
        prevDefender = "";
    }
    // create a visual break between new defending pokemon
    if(result.defender.name != prevDefender) {
       html += `<img title="${result.attacker.name}" src="${urlA}" width="${wA*0.4}" height="${hA*0.4}"> vs. <strong>${result.defender.name}</strong> <img title="${result.defender.name}" src="${urlD}" width="${wD*0.4}" height="${hD*0.4}">`;
        // speed tier
        let speed: string;
        if(result.attacker.rawStats.spe > result.defender.rawStats.spe) {
            speed = "faster";
        } else if(result.attacker.rawStats.spe == result.defender.rawStats.spe) {
            speed = "speed-tie";
        } else {
            speed = "slower";
        }
        html += `<p><em>${speed}</em></p>`
    }

    try {
        //console.log("----");
        //console.log(result.kochance());
        //console.log(result.desc());
        // split for ko chance
        const s: string[] = result.desc().split('--');
        let colour: string = "#000000";
        if(side){
            colour = getKOChanceColourAttack(result.kochance().n);
        } else {
            colour = getKOChanceColourDefend(result.kochance().n);
        }
        html += `<p>${s[0]} -- <span style="color:${colour}"><strong>${s[1] || "Light chip"}</strong></span></p>`;
    } catch (error) {
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
    }
    return html;
}

/* Colour gradients
Name: Candy Apple Red
Hex: #FF0D0D
RGB: (255, 13, 13)
CMYK: 0, 0.949, 0.949, 0

ORIOLES ORANGE	
Name: Orioles Orange
Hex: #FF4E11
RGB: (255, 78, 17)
CMYK: 0, 0.694, 0.933, 0

BEER	
Name: Beer
Hex: #FF8E15
RGB: (255, 142, 21)
CMYK: 0, 0.443, 0.917, 0

SAFFRON	
Name: Saffron
Hex: #FAB733
RGB: (250, 183, 51)
CMYK: 0, 0.268, 0.796, 0.019

BRASS	
Name: Brass
Hex: #ACB334
RGB: (172, 179, 52)
CMYK: 0.039, 0, 0.709, 0.298

APPLE	
Name: Apple
Hex: #69B34C
RGB: (105, 179, 76)
CMYK: 0.413, 0, 0.575, 0.298
*/
const gradientA = ["#69B34C", "#ACB334", "#FAB733", "#FF8E15", "#FF4E11", "#FF0D0D"];
const gradientD = ["#FF0D0D", "#FF4E11", "#FF8E15", "#FAB733", "#ACB334", "#69B34C"];

/**
* Get the colour to use in result render for attack
* @param {number} n - nHKO chance
* @returns hex code string
*/
function getKOChanceColourAttack(n: number): string {
    if(n > gradientA.length)
        return gradientA[gradientA.length - 1];
    return gradientA[n-1];
} 

/**
* Get the colour to use in result render for defense
* @param {number} n - nHKO chance
* @returns hex code string
*/
function getKOChanceColourDefend(n: number): string {
    if(n > gradientD.length)
        return gradientD[gradientD.length - 1];
    return gradientD[n-1];
}

/**
* Aggregate the whole score of an attack
* @param {any} resultsAttack - list of results
* @return an html string representing the score
*/
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

/**
* Aggregate the whole score of a defense
* @param {any} resultsDefense - list of results
* @return an html string representing the score
*/
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

/**
* Grades the chance to KO from attackers pov
* @param {number} n - number corresponding to NHKO
* @return a number representing the score
*/
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

/**
* Grades the chance to KO from defenders POV
* @param {number} n - number corresponding to NHKO
* @return a number representing the score
*/
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
