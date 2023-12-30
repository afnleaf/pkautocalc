# pokemon auto calculator
- automatically calculate every matchup between two pokemon pastes
- print out results as text

## stack
- bun
- javascript
- typescript
- elysia
- css
- html
- docker
- smogon/damage-calc
- pkmn/img
- node-html-parser


## ideas

- [x] allow more than 4 moves
- [x] singles vs doubles
- [x] default vs standard meta (metapastes)
- [x] pokepaste automatic integration
- [ ] click button for paste to clipboard
- [ ] upload to hastebin/pastebin
- [ ] meta pokemon database
- [ ] pikalytics api? -> doesn't exist, but smogon usage stats do
- [ ] ev optimization stats (?? what ??)
- [ ] team length limits for calculation speed requirements
- [ ] generation picker or just 9?
- [ ] pokemon customizer (no?)


## frontend ui design
- idkman
- chill with normalize for now?
- center submit button
- put paste boxes side by side
- flexbox stack on eachother
- both pastes should fit side by side
- drag?
- scroll
- alt-scroll?

## pokemon object data
```
Name:
Item:
Ability:
Level:
Tera:
EVs: 
	HP:
	Atk:
	Def:
	SpD:
	SpA:
	Spe:
IVs:
	HP:
	Atk:
	Def:
	SpD:
	SpA:
	Spe:
Nature:
Moveset:
```

## webapp architecture

- Frontend
	- user input
	- send request to backend server to make calculations
	- display results
	- avoid load on user pc and having to package smogon calc
- Backend
	- parse pokemon objects from user input text
	- execute calculations
	- render and return html of results
- Database (not implemented)
	- store data of meta sets parsed from smogon usage stats
	- backend: parse smogon stats and store in db
	- backend: access database to create a superset of mons to calculate vs
	

## testing
team1 pokepaste
https://pokepast.es/2c7b8e8730f3c772

team2 pokepaste
https://pokepast.es/2022cd4afb1928d9

https://pokepast.es/65b41d45f97335ff


## todo

### backend
- is there any way to multithread the calculation?
- update @smogon/calc using github repo, npm is not updated
- remove rendunt tera defensive type
- tera defensive needs to be looked at again, like when a move will do more damage than base
- fix female vs male versions
- boosts
- test score results (could be improved)
- control error for undefined pokemon


### frontend
- links to me
- how to use (kinda done)
- field conditions
	- passed through frontend
- make everything look nicer

### production
- how? 
- kubernetes (no)
- hosting provider (home server)
- domain name pkautocalc.duckdns.org
- why not host it myself (yes)
- user traffic (monitoring in backend)
	- portainer
- content size
- geographic distribution


## tera stuff
filter out status moves
tera blast as tera type and normal

check if tera attacker pokemons tera type is same type as move (TERA STAB) 

check if type of move is neutral vs tera type defender


## UI components
- user input textboxes
	- left textbox
	- right textbox
- field options
	- level: 100, 50, 5
	- singles vs doubles
	- generation
	- weather
	- other field conditions
- calculate button
- preset feature
	- VGC F
	- Smogon Doubles
	- Smogon Singles
	- LC
- link to howto page
- credits
	- github
	- me
- other links
	- twitter
	- youtube
	- pokepastefix
