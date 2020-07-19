const MongoClient = require('mongodb').MongoClient;
const assert      = require('assert');

const url = "mongodb://127.0.0.1:27017/loc8r";

const dbName = 'undercover';

const insertPair = function(string1, string2, name){
    const client = new MongoClient(url, {useNewUrlParser: true/*, useUnifiedTopology: true*/});
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("connected to database");

        const db = client.db(dbName);

        const coll = db.collection('words');
        coll.insertOne({normal:string1,undercover:string2,authorName:name},
            function(err, result){
                assert.equal(err,null);
                console.log("insert sucessful");
            })
        client.close();
    })
}

function getAll(A){
    const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
    client.connect(function (err) {
        assert.equal(null, err);
        console.log("connected to database");

        const db = client.db(dbName);

        const coll = db.collection('words');

        coll.find({}).toArray().then((data) => {
            //console.log(data);
            //A.lenght = 0;
            data.forEach((element)=>{
                A.push(element);
            })
            console.log('fetched words');
            //console.log(array);
        })

    })
}
module.exports = { insertPair, getAll }