import { Sprites, Icons } from '@pkmn/img';

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
        html += renderResult(result, prevAttacker, prevDefender, true);
        prevAttacker = result.attacker.name;
        prevDefender = result.defender.name;
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
       html += renderResult(result, prevAttacker, prevDefender, false);
       prevAttacker = result.attacker.name;
       prevDefender = result.defender.name;
    });
    html += `<a href="#Attack">Go to attack</a> | <a href="#Defense">Go to defense</a>`;
    return html;
}

//<img src="https://play.pokemonshowdown.com/sprites/itemicons-sheet.png" style="display:inline-block;width:24px;height:24px;image-rendering:pixelated;background:transparent url(https://play.pokemonshowdown.com/sprites/itemicons-sheet.png) no-repeat scroll -144px -96px;">

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

    const attackerSprite = Sprites.getPokemon(result.attacker.name, {gen: spriteStyle});
    const defenderSprite = Sprites.getPokemon(result.defender.name, {gen: spriteStyle});
    const {url: urlA, w: wA, h: hA} = attackerSprite;
    const {url: urlD, w: wD, h: hD} = defenderSprite;
    
    let attackerItemSprite: any;
    
    if(result.attacker.item) 
        attackerItemSprite = Icons.getItem(result.attacker.item);
    
    
    
    let html: string = ``;
    // create a visual break between new attacking pokemon
    if(result.attacker.name != prevAttacker) {
        html += `<br>`;
        // pokemon sprite
        html += `<img src="${urlA}" width="${wA}" height="${hA}">`;
        // pokemon item
        if(result.attacker.item) {
            //console.log(attackerItemSprite);
            //const {url: urlAI, w: wAI, h: hAI, pixelated: pAI} = attackerItemSprite;
            //html += `<img src="${urlAI}" width="${wAI}" height="${hAI}" style="${attackerItemSprite.style} image-rendering: pixelated;">`;
            //html += `<img style="${attackerItemSprite.style}">`;
            //html += `<img style="width:24px;height:24px;image-rendering:pixelated;background: url(${attackerItemSprite.url}) no-repeat scroll ${attackerItemSprite.left}px ${attackerItemSprite.top}px; border: none; border-radius: 50px;">`;
            html += `<img style="width:24px;height:24px;image-rendering:pixelated;background: #d0d0d0 url(${attackerItemSprite.url}) no-repeat scroll ${attackerItemSprite.left}px ${attackerItemSprite.top}px; border: none; border-radius: 25px; margin: 0px 0px 0px -25px; overflow: hidden;">`;
            
        }
        // title
        html += `<h3>${result.attacker.name}</h3>`
        //const icon = document.createElement('span');
        //icon.style = Icons.getItem('Choice Band').style;
        prevDefender = "";
    }
    // create a visual break between new defending pokemon
    if(result.defender.name != prevDefender) {
        
        html += `<img src="${urlA}" width="${wA*0.4}" height="${hA*0.4}"> vs. <strong>${result.defender.name}</strong> <img src="${urlD}" width="${wD*0.4}" height="${hD*0.4}">`;
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

/**
* Get the colour to use in result render for attack
* @param {number} n - nHKO chance
* @returns hex code string
*/
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

/**
* Get the colour to use in result render for defense
* @param {number} n - nHKO chance
* @returns hex code string
*/
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
