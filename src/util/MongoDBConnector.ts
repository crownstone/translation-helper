const MongoClient = require('mongodb').MongoClient;

export let mongoConfig = {
  name:"heroku_9q3jv8v5",
  url: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/heroku_9q3jv8v5"
}

export class MongoDbConnector {

  database = null;
  mongoClient = null;

  connect() {
    return new Promise((resolve, reject) => {

      let url = mongoConfig.url;

      // Use connect method to connect to the server
      MongoClient.connect(url, (err, client) => {
        if ( err ) { return reject(err); }

        console.log(new Date().valueOf() + " Connector: Connected successfully to mongo server");

        this.database = client.db(mongoConfig.name);
        this.mongoClient = client;

        resolve();
      });
    })
  }

  close() {
    return this.mongoClient.close()
      .then(() => {
        console.log(new Date().valueOf() + " Connector: Connection to mongo server closed.");
      })
  }
}

