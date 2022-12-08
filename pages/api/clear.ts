import {MongoDbConnector} from "../../src/util/MongoDBConnector";

export default (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'POST') {
    // Process a POST request
    // UPDATE
    let mongo = new MongoDbConnector();
    let languageCollection = null;
    mongo.connect()
      .then(() => {
        languageCollection = mongo.database.collection("translations");
        return languageCollection.find({language: req.body.language}).toArray();
      })
      .then((data) => {
        if (data.length > 0) {
          return languageCollection.deleteOne({_id: data[0]._id})
        }
      })
      .then((result) => {
        mongo.close()
        res.statusCode = 204;
        res.end();
      })
      .catch((err) => {
        console.log("ERR", err)
      })
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 400;
    res.end();
  }

}
