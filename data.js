class PokemonData {
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

    printPokemon() {
        console.log("Pokemon:")
        console.log("Name: " + this._Name);
        console.log("Item: " + this._Item);
        console.log("Ability: " + this._Ability);
        console.log("Level: " + this._Level);
        console.log("Tera: " + this._Tera);
        console.log("EVs: " + this.E_Vs);
        console.log("IVs: " + this._IVs);
        console.log("Nature:" + this._Nature);
        console.log("Moveset:" + this._Moveset);
        console.log("");
    }
}