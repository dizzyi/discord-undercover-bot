const Discord = require('discord.js');

let RANGE = 100000;
let MIN   = 10000;
let COLOR = 0x0040ff;

class Game{
        constructor(state, channel, words){
        this.state = state;
        this.channel = channel;
        this.players = [];
        this.numberOfBlank = 0;
        this.numberOfUndercover = 1;
        this.survialPlayer = 0;

        let temp = Math.floor(Math.random() * words.length);

        this.normalText     = words[temp].normal;
        this.undercoverText = words[temp].undercover;
        this.author         = words[temp].authorName;

        temp = Math.random() * 10;
        if(temp > 5){
            let tempText = this.normalText;
            this.normalText = this.undercoverText;
            this.undercoverText = tempText;
        }
        console.log('normal' + this.normalText);
    }

    Board(message){
        const embed = new Discord.MessageEmbed().setTitle("UnderCover Game")
        .setColor(COLOR)

        .addField("Number of Undercover", this.numberOfUndercover, true)
        .addField("Number of Blank", this.numberOfBlank, true);

        this.players.forEach((item, index)=>{
            let line = '';
            if(this.state=="open"){
                if(item.level == "Member") line += ":green_circle: ";
                else line += ":crown: ";
            }
            else{
                if(!item.isdead){
                    line += ":slight_smile: ";
                }
                else {
                    switch(item.role){
                        case "normal":
                            line += ":dizzy_face: ";
                            break;
                        case "blank":
                            line += ":white_medium_square: ";
                            break;
                        case "undercover":
                            line += ":detective: ";
                     }
                }
            }

            line += item.user.username;

            let desc = `Player number: ${index+1} `;
            if(this.state != "open"){
                desc += `\nNumber of vote: ${item.voteNum}\nVoted to: ${item.voteTo + 1}`;
            }

            embed.addField(`**${line}**`, desc);

        })
        /*embed.addField('normal', this.normalText);
        embed.addField('undercover', this.undercoverText);
        embed.addField('author', this.author);*/
        message.channel.send(embed);
    }

    init(message){      
        const playerNum = this.players.lenght;

        //assign blank
        for(let i = 0 ; i < this.numberOfBlank ; i++){
            let blankIndex;
            do {
                blankIndex = this.skewRandom(playerNum);

                blankIndex = blankIndex ? blankIndex : 0;

            } while (this.players[blankIndex].role != "normal");

            this.players[blankIndex].role = "blank";
        }

        //assign undercover
        for(let i = 0 ; i < this.numberOfUndercover ; i++){
            let undercoverIndex;
            do {
                undercoverIndex = this.evenRandom(playerNum);

                undercoverIndex = undercoverIndex ? undercoverIndex : 0;

            } while (this.players[undercoverIndex].role != "normal");

            this.players[undercoverIndex].role = "undercover";
        }

        //send player info
        this.players.forEach(element => {
            const embedmsg = new Discord.MessageEmbed().setColor(0x0040ff);
            embedmsg.setTitle("Undercover Game");
            switch(element.role){
                case "normal":
                    embedmsg.addField("**Your Card**", this.normalText);
                    break;
                case "undercover":
                    embedmsg.addField("**Your Card**", this.undercoverText);
                    break;
                case "blank":
                    embedmsg.addField("**Your Card**", "`blank`");
                    break;
            }
            element.user.send(embedmsg);
        });
        this.survialPlayer = this.players.length;
    }

    evenRandom(num){
        let temp = Math.floor((Math.random() * RANGE) + MIN);
        temp = temp % num;
        return num - 1 - temp ;
    }

    skewRandom(num){
        let temp = Math.floor((Math.random() * RANGE) + MIN);
        temp = temp % ( num * 3 );
        if(temp > 2) return temp / 3 ;
        return temp % 3 ;
    }

    updateVote(){
        this.players.forEach(element => {
            element.voteNum = 0;
        });

        this.players.forEach(element => {
            if(element.voteTo != -1){
                this.players[element.voteTo].voteNum += 1;
            }
        });

        if( this.players.find(element => element.voteTo == -1) ) return 0;
        return 1;

    }

    endTurn(message){
        let maxVoteNum = this.players.reduce( (max, b) =>  Math.max(max , b.voteNum) , this.players[0].voteNum );

        if(maxVoteNum <= this.survialPlayer / 2){
            message.channel.send("No one got vote more than half of the survial player number");
            message.channel.send("Therefore, no one is killed, next turn!");
            return;
        }  
        let killing = this.players[ this.players.findIndex( element => element.voteNum == maxVoteNum ) ];

        killing.isdead = 1 ; 

        message.channel.send(`${killing.user} (got ${maxVoteNum} votes) is killed`);

        this.survialPlayer -= 1;

        this.Board(message);

        //check if anyone win

        //if only 2 person left
        if(this.survialPlayer == 2){
            if(this.players.find(element => element.role == "undercover" && !element.isdead)) return 2;
            
            if(this.players.find(element => element.role == "blank"      && !element.isdead)) return 3;
            
            return 1;
        }

        if(!this.players.find(element => element.role == "undercover" && !element.isdead) ){
            if(this.players.find(element => element.role == "blank"  && !element.isdead)) return 3;
            return 1;
        }

        if(this.players.find(element => element.role == "normal" && !element.isdead)) return 0;

        return 2
    }
}

module.exports = Game;