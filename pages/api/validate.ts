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

export const whitelistedIds = [
  '58dcd2d7df42e8c330b5fd64', // alex
  '585aba8fff32bb130088e6b9', // public anne
  '58dab68f18150214000bcd5a', // gmail anne
];

export const validateCrownstoneToken = function(req) {
  let token = req.body.token || req.query.token;
  if (token) {
    return getData("https://cloud.crownstone.rocks/api/users/userId", {access_token: token} )
      .then((userId) => {
        if (userId.indexOf("error") === -1) {
          let cleanedId = String(userId).replace(/"/g,'')
          if (whitelistedIds.indexOf(cleanedId) !== -1) {
            return true;
          }
          return false;
        }
        else {
          return false;
        }
      })
      .catch((err) => {
        return false;
      })
  }
  else { return Promise.resolve(false) }

}
