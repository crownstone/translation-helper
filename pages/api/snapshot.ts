import {validateCrownstoneToken} from "./validate";
import {MongoDbConnector} from "../../src/util/MongoDBConnector";

export default (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  return validateCrownstoneToken(req)
    .then((result) => {
      // if (!result) { throw "Unauthorized" }
      if (req.method === 'POST') {
        // Process a POST request
        // UPDATE
        let mongo = new MongoDbConnector();
        let languageCollection = null;
        mongo.connect()
          .then(() => {
            languageCollection = mongo.translation.collection("translations");
            return languageCollection.find({language: req.body.language}).toArray();
          })
          .then((data) => {
            if (data.length > 0) {
              return languageCollection.updateOne(
                {_id: data[0]._id},
                {$set: {
                  language: req.body.language,
                  data: req.body.data,
                }
              })
            }
            else {
              return languageCollection.insert({
                language: req.body.language,
                data: req.body.data,
              });
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
      else if (req.method === "GET") {
        // Handle any other HTTP method
        // GET
        let mongo = new MongoDbConnector();
        mongo.connect()
          .then(() => {
            let languageCollection = mongo.translation.collection("translations");
            return languageCollection.find({language: req.query.language}).toArray();
          })
          .then((result) => {
            mongo.close()

            res.statusCode = 200;
            res.end(JSON.stringify(result));
          })
      }
      else {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.end(JSON.stringify([]));
      }

    })
    .catch((err) => {
      console.log("err", err)
    })
}