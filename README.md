# pokemon auto calculator
- automatically calculate every matchup between two pokemon pastes
- print out results as text

## stack
- bun
- smogon/damage-calc
- elysia
- javascript
- typescript
- css
- html
- docker


## ideas
- team length limits for calculation speed requirements
- generation picker or just 9?
- allow more than 4 moves
- singles vs doubles
- default vs standard meta
- pikalytics api?
- pokepaste automatic integration
- ev optimization stats
- meta pokemon database
- pokemon customizer
- click button for paste to clipboard
- upload to hastebin/pastebin
- currently gen 9 only

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


## webapp architecture

- Frontend
	- user input
	- send request to backend server to make calculations
	- display results
	- avoid load on user pc and having to package smogon calc
- Backend
	- parse pokemon objects
	- execute calculations
	- return html of results
	

Database

## testing
team1 pokepaste
https://pokepast.es/2c7b8e8730f3c772

team2 pokepaste
https://pokepast.es/2022cd4afb1928d9

https://pokepast.es/65b41d45f97335ff


## todo

### backend
- figure out no damage moves
- is there any way to multithread the calculation?
- tera defense

### frontend
- how to use
- seperate XHKO
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
- content size
- geographic distribution




