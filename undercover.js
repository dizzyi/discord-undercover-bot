const Player  = require('./Player.js');
const Game    = require('./Game.js');
const db      = require('./db.js');
const help    = require('./help.js');
const tenor   = require('./tenor-gif');

//whenever there are message
function maingame(message, PREFIX, Games, Words){

    let args = message.content.substring(PREFIX.length).split(" ");

    if(!message.content.includes(PREFIX)) return;

    let gameToCommand = Games.find(element => element.channel === message.channel);
    let commander;
    if(gameToCommand)
        commander = gameToCommand.players.find(element => element.user.id === message.author.id);

    switch(args[0]){
        case 'reply':
            message.channel.send(`${message.author} hello bro`);
            break;

        case 'ping':
            message.channel.send("pong!");
            console.log(Words);
            break;

        case 'rickroll':
            message.channel.send("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            break;

        //opening the game room
        case 'open':
            /// find if game already on Games(list)
            if(gameToCommand){
                message.channel.send(`I'm sorry the game room for ${message.channel} in "${message.channel.guild}" already been opened`);
                message.channel.send('Please enter "UC!join" to join the room');
                break;
            }
            /// if not open yet, make new game and push the opener to master
            gameToCommand = new Game("open", message.channel, Words);
            commander = new Player(message.author, "Master");

            gameToCommand.players.push(commander);
            Games.push(openedGame);

            message.channel.send(`the game room for ${message.channel} in "${message.channel.guild}" is opened`);
            
            gameToCommand.Board(message);
            
            break;


        //joining in the game room
        case 'join':
            //if can't find game -> not open room yet
            if(!gameToCommand){
                message.channel.send(`I'm sorry the game room for ${message.channel} in "${message.channel.guild}" is not yet opened`);
                message.channel.send('Please enter "UC!open" to open the game room');
                break;
            }


            //if the player already join the game
            if(commander){
                message.reply("You are already in the game room!");
                break;
            }

            //if state is not open -> can't join
            if(gameToCommand.state!="open"){
                message.channel.send(`The Game room is not in open state, so you can't join the game`);
                message.channel.send("Please wait for the next game! >.<");
                break;
            }

            commander = new Player(message.author, "Member");
            
            gameToCommand.players.push(commander);

            message.reply("you've joined the game sucessfully!");

            gameToCommand.Board(message);

            break;


        //kick start the game
        case 'start':
            // if not exist 
            if(!gameToCommand){
                message.channel.send(`I'm sorry the game room for ${message.channel} in "${message.channel.guild}" is not yet opened`);
                message.channel.send('Please enter "UC!open" to open the game room');
                break;
            }

            //if the game is on already
            if(gameToCommand.state != "open"){
                message.channel.send("The game have started already!");
                console.log('here 1');
                break;
            }

            //if the author is not on the game 
            if(!commander){
                message.reply("You did not join the game yet!");
                message.channel.send('Please enter "UC!join" to join the game');
                break;
            }

            //if the author are not the master of the room
            if(commander.level != "Master"){
                message.reply("You are not the Master of the game room, so you can't start the game");
                break
            }

            //console.log(gameToCommand.players.length);
            if(gameToCommand.players.length < gameToCommand.numberOfBlank + gameToCommand.numberOfUndercover + 2){
                message.channel.send("There not enough player to start the game");
                message.channel.send("You need aleast two player to play the role 'Normal' ");
                break;
            }
            console.log('ready to start the game');

            message.channel.send("Starting the Game!!");

            gameToCommand.state = "started";

            gameToCommand.Board(message);

            gameToCommand.init(message);

            break;

        //kick start the game
        case 'restart':
            //fetch the game from the list
            let gameToCommand = Games.find(element => element.channel === message.channel);
            // if not exist 
            if(!gameToCommand){
                message.channel.send(`I'm sorry the game room for ${message.channel} in "${message.channel.guild}" is not yet opened`);
                message.channel.send('Please enter "UC!open" to open the game room');
                break;
            }

            //if the game is on already
            if(gameToCommand.state != "started"){
                message.channel.send("The game have not started!");
                break;
            }

            //if the author is not on the game 
            if(!commander){
                message.reply("You did not join the game yet!");
                message.channel.send('Please enter "UC!join" to join the game');
                break;
            }

            //if the author are not the master of the room
            if(commander.level != "Master"){
                message.reply("You are not the Master of the game room, so you can't start the game");
                break
            }

            if(gameToCommand.state != 'started'){
                message.send('The game is not started yet');
            }

            console.log(gameToCommand.players.length);

            console.log('ready to restart the game');

            message.channel.send("Restarting the Game!!");

            gameToCommand.init(message);

            gameToCommand.Board(message);

            break;

        case "vote":
            //verify the game to vote
            if(!gameToCommand){
                message.channel.send(`I'm sorry the game room for ${message.channel} in "${message.channel.guild}" is not yet opened`);
                message.channel.send('Please enter "UC!open" to open the game room');
                break;
            }

            ///verify the state
            if(gameToCommand.state != "started"){
                message.channel.send("The game hasn't started yet");
                message.channel.send("Please ask the Room Master to start the game");
                break;
            }

            
            //verify the voter
            if(!commander){
                message.channel.send("You are not in the game");
                message.channel.send("please wait for the next game");
                break;
            }

            if(commander.isdead){
                message.channel.send("You are already dead!");
                message.channel.send("Please wait for the next game!");
                break;
            }

            commanderIndex = gameToCommand.players.findIndex(element => element.user.id === message.author.id);

            //------------------------------------------------------------------------------------------------------------------------
            //verify votoward 
            //let voteToward = message.mentions.users.array();
/*
            if(voteToward.length){
                if( !gameToVote.players.find(element => element.user.id === voteToward[0].id) ){
                    message.channel.send("Mentioned player isn't in the game");
                    message.channel.send("Please try again");
                    break;
                }
                voteToward = gameToVote.players.findIndex(element => element.user.id === voteToward[0].id)
            }
            else{*/
            voteToward = args[1];
            if(!voteToward){
                message.channel.send("Please specify who you want to vote for");
                message.channel.send("you can mention them or specify the player number as stated in the game board");
                break;
            }

            if(voteToward < 0 || voteToward > gameToVote.players.length || 
                typeof parseInt(voteToward) != "number" || Math.floor(voteToward) != voteToward){
                    message.channel.send("Input is not vaild");
                    message.channel.send("Please try again");                        
                break;  
            }
            

            ///vote
            voteToward -= 1;
            gameToCommand.players[commanderIndex].voteTo = voteToward;

            if(gameToCommand.updateVote(message)){
                let result = gameToCommand.endTurn(message);
                gameToCommand.players.forEach(element => {
                    element.voteTo = -1;
                });
                switch (result) {
                    case 0:
                        break;
                
                    case 1:
                        message.channel.send(`noraml wins!:partying_face: `);
                    case 2:
                        message.channel.send(`Undercover wins!:partying_face: `);
                    case 3:
                        message.channel.send(`Blank wins!:partying_face: `);
                    default:
                        break;
                }
                if(result) message.channel.send(`The author of the question is ${gameToVote.author}`);
            }
            gameToVote.Board(message);
            break;
            ///------------------------------------------------------------------------------

        case "set":
            // if not exist 
            if(!gameToCommand){
                message.channel.send(`I'm sorry the game room for ${message.channel} in "${message.channel.guild}" is not yet opened`);
                message.channel.send('Please enter "UC!open" to open the game room');
                break;
            }

            //if the game is on already
            if(gameToCommand.state != "open"){
                message.channel.send("The game have started already!");
                console.log("here 2");
                break;
            }

            //if the author is not on the game 
            if(!commander){
                message.reply("You did not join the game yet!");
                message.channel.send(`Please enter "${PREFIX}join" to join the game`);
                break;
            }
             //if the author are not the master of the room
            if(commander.level != "Master"){
                message.reply("You are not the Master of the game room, so you can't start the game");
                break;
            }
            
            if(args[1] == 'undercover'){
                if(args[2] && typeof( parseInt( args[2] ) ) == 'number') {
                    gameToCommand.numberOfUndercover = parseInt( args[2] );
                    message.channel.send(`sucessfully change the number of undercover to ${gameToCommand.numberOfUndercover}`)
                    break;
                }
            }
            else if(args[1] == 'blank'){
                if(args[2] && typeof( parseInt( args[2] ) ) == 'number'){
                    gameToCommand.numberOfBlank = parseInt( args[2] );
                    message.channel.send(`sucessfully change the number of blank to ${gameToCommand.numberOfBlank}`)
                    break;
                }
            }

            message.channel.send("invaild input, please try again");

            break;

        case "help":
            if(!args[1]) help.help(message);
            
            message.channel.send("this feature is not fully supported yet");
            break;
           
        case "add":
            if( !args[1] || !args[2] ){
                message.channel.send("invaild input, please try again");
                break;
            }
            
            Words.splice(0,Words.length);
            db.insertPair(args[1], args[2], message.author.username);
            db.getAll(Words);
            console.log(Words);
            
            message.reply(`${args[1]} and ${args[2]} has been inserted to database sucessfully`);
            
            break;
        case "board":
            gameToCommand = Games.find(element => element.channel === message.channel)
            // if not exist 
            if(!gameToCommand){
                message.channel.send(`I'm sorry the game room for ${message.channel} in "${message.channel.guild}" is not yet opened`);
                message.channel.send('Please enter "UC!open" to open the game room');
                break;
            }

            gameToCommand.Board(message);
            break;
        case 'cls':
            message.channel.bulkDelete(100);
            break;

        case 'gif':
            args.shift();
            if(args[1]) tenor.searchGif(message, args.join("+"));

            break;
        default:
            //message.channel.send("Error!");
    }
}

module.exports = maingame;

