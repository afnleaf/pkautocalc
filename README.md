# pokemon auto calculator
automatically calculate every matchup between two pokemon pastes
print out results as text
click button for paste to clipboard
upload to hastebin/pastebin
currently gen 9 only

## stack
bun?
smogon/damage-calc
js
css
html

## ideas
team length limits for calculation speed requirements
generation picker or just 9?
allow more than 4 moves
singles vs doubles
default vs standard meta
pikalytics api?
pokepaste automatic integration

## frontend ui design
idkman
chill with normalize for now?
center submit button
put paste boxes side by side
flexbox stack on eachother
both pastes should fit side by side
drag?
scroll
alt-scroll?

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

Frontend
	parse pokemon objects
	send request to backend server to make calculations
	avoid load on user pc and having to package smogon calc
Backend
	execute calculations
	

Database

## must do
catch error for 0 damage
