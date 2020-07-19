const Tenor = require("tenorjs").client({
    "Key": "CMZXLUO455Q3", // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});

const searchGif = function(message, keyword){
    Tenor.Search.Query(keyword, "5").then(Results => {
        Results.forEach(Post => {
            console.log(`Item #${Post.id} (${Post.created}) @ ${Post.url}`);
        });
        let temp = Math.floor(Math.random() * 5);
        message.channel.send( Results[temp].url );
    }).catch(console.error);
}



module.exports = { searchGif };