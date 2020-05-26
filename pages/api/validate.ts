import {getData} from "../../src/util/FetchUtil";

export default (req, res) => {
  return validateCrownstoneToken(req)
    .then((result) => {
      if (result) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true }));
      }
      else {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false }));
      }
    })
}

export const validateCrownstoneToken = function(req) {
  let token = req.body.token;
  if (token) {
    return getData("http://cloud.crownstone.rocks/api/users/userId", {}, token)
      .then((x) => {
        if (x.indexOf("error") === -1) {
          return true
        }
        else {
          return false;
        }
      })
      .catch((err) => { return false; })
  }
  else { return Promise.resolve(false) }

}