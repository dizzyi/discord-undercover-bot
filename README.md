# discord-undercover-bot

## Description
This is a bot in discord chat that help you and your friend play the game "Who's undercover" together.

**This gonna be full of bug, because i have no friend to play with, hence no one can help me debug**


## Game rule
There are 3 role in the game: "normal", "undercover" and "blank", game room master can adjust the number of different role for different number of players.
When the game first started, a word is sent to "normal" and "undercover", however the one sent to undercover is different but similar to the sent to "normal" player. And "blank" player will not get any word.

After that players needed to give a statment about the word that sent to them one by one. At each turn, players will vote to kill someone. 


## How different role win
Normal: kill all "non-normal" role

Undercover: survive to the end

Blank: survive untill all "undercover" is killed


## How to use it
Download Node.js, open terminal to install discord api, tenor api and mongodb
```
npm install discord.js
```
```
npm install mongodb
```
```
npm install tenor.js
```

change the token in index.js into your application's token, you can find this in https://discord.com/developers/applications by add new application > bot > token

and activite the bot in terminal
```
node ./
```
