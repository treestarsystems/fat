const crypto = require('crypto');
const axios = require('axios');
const core = require('../../core/core.js');

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
  let response = await axios.get(`${core.coreVars.cbApiUrl}/exchange-rates?currency=${coinSymbol}`, {
   headers: {
   'CB-ACCESS-KEY': core.coreVars.keys.coinbaseApiKey,
   'CB-ACCESS-SIGN': sign.cbAccessSign,
   'CB-ACCESS-TIMESTAMP': sign.timeStamp,
   'CB-VERSION': core.coreVars.cbApiVersion
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
//  console.log('getExchangeRates:',err);
  return err;
 }
}

async function getAccountsRaw () {
 let sign = generateCBAccessSign('GET','/v2/accounts','');
 try {
  let response = await axios.get(`${core.coreVars.cbApiUrl}/accounts`, {
   headers: {
   'CB-ACCESS-KEY': core.coreVars.keys.coinbaseApiKey,
   'CB-ACCESS-SIGN': sign.cbAccessSign,
   'CB-ACCESS-TIMESTAMP': sign.timeStamp,
   'CB-VERSION': core.coreVars.cbApiVersion
   }
  })
   .then((response) => {
    let data = response.data;
    return data;
   });
  return response;
 } catch (err) {
//  console.log('getAccountsRaw:',err);
  return err;
 }
}

//Only shows accounts that have a positive balance.
async function getAccountsFiltered () {
 let sign = generateCBAccessSign('GET','/v2/accounts','');
 try {
  let response = await axios.get(`${core.coreVars.cbApiUrl}/accounts`, {
   headers: {
   'CB-ACCESS-KEY': core.coreVars.keys.coinbaseApiKey,
   'CB-ACCESS-SIGN': sign.cbAccessSign,
   'CB-ACCESS-TIMESTAMP': sign.timeStamp,
   'CB-VERSION': core.coreVars.cbApiVersion
   }
  })
   .then((response) => {
    let data = response.data.data;
    let filteredData = data.filter(d => d.balance.amount > 0);
    return filteredData;
   });
  return response;
 } catch (err) {
//  console.log('getAccountsFiltered:',err);
  return err;
 }
}

function getAccountsPreProcessor (accountsArray) {
 for (let a = 0; a < accountsArray.length; a++) {
  delete accountsArray[a].id;
  delete accountsArray[a].currency.asset_id;
  delete accountsArray[a].resource_path;
  delete accountsArray[a].allow_deposits;
  delete accountsArray[a].allow_witdrawls;
  if (a == accountsArray.length-1) return accountsArray;
 }
}

function getAccountsErrorProcessor (errorObj) {
 delete errorObj.config.headers['CB-ACCESS-KEY'];
 delete errorObj.config.headers['CB-ACCESS-SIGN'];
 return errorObj;
}

module.exports = {
 generateCBAccessSign,
 getExchangeRates,
 getAccountsRaw,
 getAccountsFiltered,
 getAccountsPreProcessor,
 getAccountsErrorProcessor
}
