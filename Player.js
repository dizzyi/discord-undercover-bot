class Player{
    constructor(user, level){
        this.user = user;
        this.level = level;
        this.state = "alive";
        this.voteTo = -1;
        this.voteNum = 0;
        this.role = 'normal';
        this.isdead = 0;
    }
}

module.exports = Player;