const crypto = require('crypto');
const axios = require('axios');
const core = require('../../core/core.js');
const cbApiVersion = '2019-11-15';

function generateCBAccessSign (method,endpoint,body) {
 let timeStamp = Math.floor(Date.now() / 1000);
 const message = timeStamp + method + endpoint + body;
 const sha256Hasher = crypto.createHmac("sha256", core.coreVars.keys.coinbaseApiSecret);
 const cbAccessSign = sha256Hasher.update(message).digest("hex");;
 return {'timeStamp': timeStamp, 'cbAccessSign': cbAccessSign};
}

async function getExchangeRates (coinSymbol,fiatCurrency) {
 let sign = generateCBAccessSign('GET','/v2/exchange-rates','');
 try {
  let response = await axios.get(`https://api.coinbase.com/v2/exchange-rates?currency=${coinSymbol}`, {
   headers: {
   'CB-ACCESS-KEY': core.coreVars.keys.coinbaseApiKey,
   'CB-ACCESS-SIGN': sign.cbAccessSign,
   'CB-ACCESS-TIMESTAMP': sign.timeStamp,
   'CB-VERSION': cbApiVersion
   }
  })
   .then((response) => {
    let data = response.data.data;
    if (fiatCurrency) {
     if (data.rates[`${fiatCurrency.toUpperCase()}`]) {
      return data.rates[`${fiatCurrency.toUpperCase()}`];
     } else {
      return '0';
     }
    } else {
     return data.rates;
    }
   });
  return response;
 } catch (err) {
  return err;
 }
}

//Only shows accounts that have a positive balance.
async function getAccounts () {
 let sign = generateCBAccessSign('GET','/v2/accounts','');
 try {
  let response = await axios.get('https://api.coinbase.com/v2/accounts', {
   headers: {
   'CB-ACCESS-KEY': core.coreVars.keys.coinbaseApiKey,
   'CB-ACCESS-SIGN': sign.cbAccessSign,
   'CB-ACCESS-TIMESTAMP': sign.timeStamp,
   'CB-VERSION': cbApiVersion
   }
  })
   .then((response) => {
    let data = response.data.data;
    let filteredData = data.filter(d => d.balance.amount > 0);
    return filteredData;
   });
  return response;
 } catch (err) {
  return err;
 }
}

module.exports = {
 generateCBAccessSign,
 getExchangeRates,
 getAccounts
}
