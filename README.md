# Pokemon Auto Calculator
- Automatically calculate every matchup between two pokemon pastes.
- Deliver results of the calculation to the client.
- Hosted at: (https://pkautocalc.duckdns.org/)

## Tech Stack
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

## How Self Host (DOCKER REQUIRED)
This web application is completely containerzied and can be run locally using docker on Linux or docker desktop on Windows/macOS. The docker compose file makes things quite easy. 
- Clone this repository.
- `docker compose build --no-cache`
- `docker compose up` (`-d` if you want to run in detatched mode)
- Go to `localhost:3000` in your web browser of choice.
- Use the app like normal.

## Ideas
- [x] allow more than 4 moves
- [x] singles vs doubles
- [x] default vs standard meta (metapastes)
- [x] pokepaste automatic integration
- [x] outspeed in result (tailwind field condition?)
- [ ] click button for paste to clipboard
- [ ] upload to hastebin/pastebin
- [x] boosts +1 Atk, +2 Speed etc
- [ ] move type colour code result
- [ ] ev optimization rules (1/16, sub, sitrus, etc)
- [ ] pikalytics api? -> doesn't exist, but smogon usage stats do (meta pokemon db)
- [ ] team length limits for calculation speed requirements
- [ ] generation picker or just 9?
- [ ] pokemon customizer (no?)

## Pokemon Object Data
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
Boosts:
	HP:
	Atk:
	Def:
	SpD:
	SpA:
	Spe:
Nature:
Moveset:
```

## Webapp Architecture

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

## ToDo

### Backend
- metapaste database
- colour gradient for xhko that factors in %chance, ex 2% chance to 2hko is worse than 99% (UI 2.0)
- sort results by xhko chance (UI 2.0)
- environemnt file that propagates through frontend and backend with metapastes (just do db)
- lower/uppercase parsing

### Frontend
- make everything look nicer **IMPORTANT**

### Production
- [x] hosting provider? -> kubernetes (no, too complex), why not host it myself (yes) -> home server 
- domain name pkautocalc.duckdns.org -> change to:
	- `pokeautocalc.duckdns.org`
	- `psyduckcalc.duckdns.org`
	- `golduckcalc.duckdns.org`
	- `ludicalco.duckdns.org`
	- `ducklettcalc.duckns.org`
	- `farfetchdcalc.duckdns.org`
	- `quaxulator.duckdns.org`
	- `porygonz.duckdns.org`
- buy domain
	- `pokeautocalc .io .xyz .uno .trade .site .space .store .fun`
	- `calc.pokemon.online`
- [x] https
- CI/CD pipeline
	- testing
	- automated deployment to prod
- user traffic (monitoring in backend)
	- portainer? track my containers
- content size
- how long does it take to calculate?
- how is it best to serve this calculator idea? (FFAAS, running on user pc? vs server vs wasm?, idk)
- geographic distribution (where are people connecting from, how bad is ping?)

### Production Server Stack
- nginx proxy manager
- portainer
- kuma uptime or w/e its called
- watchtower? uploading build to public image?
- automatic docker compose build and stop and up when github main repo is updated



