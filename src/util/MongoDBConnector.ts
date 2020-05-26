const MongoClient = require('mongodb').MongoClient;

export class MongoDbConnector {

  translation = null;
  mongoClient = null;

  connect(config) {
    return new Promise((resolve, reject) => {
      let url = config.mongoDs.url;

      // Use connect method to connect to the server
      MongoClient.connect(url, (err, client) => {
        if ( err ) { return reject(err); }

        console.log(new Date().valueOf() + " Connector: Connected successfully to mongo server");

        this.translation = client.db(config.mongoDs.name);
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

