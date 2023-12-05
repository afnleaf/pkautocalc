// pokemon object
export class PokemonData {
    /*
    constructor(name, item, ability, level, tera, evs, ivs, nature, moveset) {
        this._Name = name;
        this._Item = item;
        this._Ability = ability;
        this._Level = level;
        this._Tera = tera;
        this._EVs = evs;
        this._IVs = ivs;
        this._Nature = nature;
        this._Moveset = moveset;
    }
    */
    
    constructor() {
        this._Name = "";
        this._Item = "";
        this._Ability = "";
        this._Level = "";
        this._Tera = "";
        this._EVs = {};
        this._IVs = {};
        this._Nature = "";
        this._Moveset = [];
    }

    setName(value) {
        this._Name = value;
    }

    setItem(value) {
        this._Item = value;
    }
    setAbility(value) {
        this._Ability = value;
    }

    setLevel(value) {
        this._Level = value;
    }

    setTera(value) {
        this._Tera = value;
    }

    setEVs(value) {
        this._EVs = value;
    }

    setIVs(value) {
        this._IVs = value;
    }

    setNature(value) {
        this._Nature = value;
    }

    setMoveset(value) {
        this._Moveset = value;
    }

    printPokemon() {
        console.log(`Pokemon:`)
        console.log(`Name: ${this._Name}`);
        console.log(`Item: ${this._Item}`);
        console.log(`Ability: ${this._Ability}`);
        console.log(`Level: ${this._Level}`);
        console.log(`Tera: ${this._Tera}`);
        this.printEVs();
        this.printIVs();
        console.log(`Nature: ${this._Nature}`);
        this.printMoveset();
        //console.log(`Moveset: ${this._Moveset}`);
        console.log("");
    }

    printEVs() {
        console.log(`EVs:`);
        console.log(`\tHP: ${this._EVs.Hp}`);
        console.log(`\tAtk: ${this._EVs.Atk}`);
        console.log(`\tDef: ${this._EVs.Def}`);
        console.log(`\tSpA: ${this._EVs.SpA}`);
        console.log(`\tSpD: ${this._EVs.SpD}`);
        console.log(`\tSpe: ${this._EVs.Spe}`);
    }

    printIVs() {
        console.log(`IVs:`);
        console.log(`\tHP: ${this._IVs.Hp}`);
        console.log(`\tAtk: ${this._IVs.Atk}`);
        console.log(`\tDef: ${this._IVs.Def}`);
        console.log(`\tSpA: ${this._IVs.SpA}`);
        console.log(`\tSpD: ${this._IVs.SpD}`);
        console.log(`\tSpe: ${this._IVs.Spe}`);
    }

    printMoveset(moveset) {
        console.log(`Moveset:`);
        this._Moveset.forEach(move => {
            console.log(`- ${move}`);
        });
    }
}