// type for evs and iv values
type BaseStats = {
    Hp: number;
    Atk: number;
    Def: number;
    SpA: number;
    SpD: number;
    Spe: number;
};

// Pokemon object
export class PokemonData {
    // types
    public _Name: string;
    public _Item: string;
    public _Ability: string;
    public _Level: number;
    public _Tera: string;
    public _EVs: BaseStats;
    public _IVs: BaseStats;
    public _Boosts: BaseStats;
    public _Nature: string;
    public _Moveset: string[];

    // basestats notset
    public notset: BaseStats = { 
        Hp: -1, 
        Atk: -1, 
        Def: -1, 
        SpA: -1, 
        SpD: -1, 
        Spe: -1 
    };
    // basestat at 0
    public zeroset: BaseStats = { 
        Hp: 0, 
        Atk: 0, 
        Def: 0, 
        SpA: 0, 
        SpD: 0, 
        Spe: 0 
    };

    constructor() {
        this._Name = "";
        this._Item = "";
        this._Ability = "";
        this._Level = 100;
        this._Tera = "";
        this._EVs = this.notset;
        this._IVs = this.notset;
        this._Boosts = this.zeroset;
        this._Nature = "";
        this._Moveset = [];
    }

    setName(value: string): void {
        this._Name = value;
    }

    setItem(value: string): void {
        this._Item = value;
    }

    setAbility(value: string): void {
        this._Ability = value;
    }

    setLevel(value: number): void {
        this._Level = value;
    }

    setTera(value: string): void {
        this._Tera = value;
    }

    setEVs(value: BaseStats): void {
        this._EVs = value;
    }

    setIVs(value: BaseStats): void {
        this._IVs = value;
    }

    setBoosts(value: BaseStats): void {
        this._Boosts = value;
    }

    setNature(value: string): void {
        this._Nature = value;
    }

    setMoveset(value: string[]): void {
        this._Moveset = value;
    }

    printPokemon(): void {
        console.log(`Pokemon:`);
        console.log(`Name: ${this._Name}`);
        console.log(`Item: ${this._Item}`);
        console.log(`Ability: ${this._Ability}`);
        console.log(`Level: ${this._Level}`);
        console.log(`Tera: ${this._Tera}`);
        this.printEVs();
        this.printIVs();
        this.printBoosts();
        console.log(`Nature: ${this._Nature}`);
        this.printMoveset();
        console.log("");
    }

    printEVs(): void {
        console.log(`EVs:`);
        console.log(`\tHP: ${this._EVs.Hp}`);
        console.log(`\tAtk: ${this._EVs.Atk}`);
        console.log(`\tDef: ${this._EVs.Def}`);
        console.log(`\tSpA: ${this._EVs.SpA}`);
        console.log(`\tSpD: ${this._EVs.SpD}`);
        console.log(`\tSpe: ${this._EVs.Spe}`);
    }

    printIVs(): void {
        console.log(`IVs:`);
        console.log(`\tHP: ${this._IVs.Hp}`);
        console.log(`\tAtk: ${this._IVs.Atk}`);
        console.log(`\tDef: ${this._IVs.Def}`);
        console.log(`\tSpA: ${this._IVs.SpA}`);
        console.log(`\tSpD: ${this._IVs.SpD}`);
        console.log(`\tSpe: ${this._IVs.Spe}`);
    }

    printBoosts(): void {
        console.log(`Boosts:`);
        console.log(`\tHP: ${this._Boosts.Hp}`);
        console.log(`\tAtk: ${this._Boosts.Atk}`);
        console.log(`\tDef: ${this._Boosts.Def}`);
        console.log(`\tSpA: ${this._Boosts.SpA}`);
        console.log(`\tSpD: ${this._Boosts.SpD}`);
        console.log(`\tSpe: ${this._Boosts.Spe}`);
    }

    printMoveset(): void {
        console.log(`Moveset:`);
        this._Moveset.forEach(move => {
            console.log(`- ${move}`);
        });
    }
}