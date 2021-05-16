const coinbaseCore = require('./coinbaseCore.js');

function resCallBack(obj) {
 let resObj = {
  "status":obj.status,
  "message":obj.message,
  "timeStamp": Date.now(),
  "balance":"",
  "payload":""
 }
 if (obj.payload.length == 0) {
  resObj.status = "failure";
  resObj.message = "Error: Empty Array Returned";
  res.send(resObj).status(204);
 } else {
  resObj.payload = obj.payload;
  resObj.balance = obj.balance;
  obj.callback.setHeader('Content-Type','application/json; charset=utf-8');
  obj.callback.send(resObj).status(200);
 }
}

function getAccountsCustomLiveRaw (callback) {
 try {
  coinbaseCore.getAccountsRaw()
   .then(async (response) => {
    try {
     let balance = 0;
     //Check response's validity
     if (!response.pagination) throw response;
     let processedArray = response;
     let resCallBackObj = {
      "status":"success",
      "message":"success",
      "payload":[processedArray],
      "balance":balance,
      "callback":callback,
     };
     return resCallBack(resCallBackObj);
    } catch (err) {
     let processedError = coinbaseCore.getAccountsErrorProcessor(err);
     console.log('getAccountsCustomLiveRaw:coinbaseCore.getAccountsRaw:',processedError);
     let resCallBackObj = {
      "status":"failure",
      "message":"Error: See Payload",
      "payload":[processedError],
      "balance":0,
      "callback":callback,
     };
     return resCallBack(resCallBackObj);
    }
   });
 } catch (err) {
  let processedError = coinbaseCore.getAccountsErrorProcessor(err);
  console.log('getAccountsCustomLiveRaw:',processedError);
  let resCallBackObj = {
   "status":"failure",
   "message":"Error: See Payload",
   "payload":[processedError],
   "balance":0,
   "callback":callback,
  };
  return resCallBack(resCallBackObj);
 }
}

function getAccountsCustomLiveFiltered (callback) {
 try {
  coinbaseCore.getAccountsFiltered()
   .then(async (response) => {
    try {
     let balance = 0;
     //Check response's validity
     if (!Array.isArray(response)) throw response;
     let processedArray = coinbaseCore.getAccountsPreProcessor(response);
     for (let p = 0; p < processedArray.length; p++) {
      let price = await coinbaseCore.getExchangeRates(processedArray[p].currency.code,'USD').then((response));
      processedArray[p].balance['exchangPrice'] = price;
      processedArray[p].balance['totalValue'] = price * processedArray[p].balance.amount;
      balance += price * processedArray[p].balance.amount;
      if (p == processedArray.length-1) {
       let resCallBackObj = {
        "status":"success",
        "message":"success",
        "payload":processedArray,
        "balance":balance,
        "callback":callback,
       };
       return resCallBack(resCallBackObj);
      }
     }
    } catch (err) {
     let processedError = coinbaseCore.getAccountsErrorProcessor(err);
     console.log('getAccountsCustomLiveFiltered:coinbaseCore.getAccountsFiltered:',processedError);
     let resCallBackObj = {
      "status":"failure",
      "message":"Error: See Payload",
      "payload":[processedError],
      "balance":0,
      "callback":callback,
     };
     return resCallBack(resCallBackObj);
    }
   });
 } catch (err) {
  let processedError = coinbaseCore.getAccountsErrorProcessor(err);
  console.log('getAccountsCustomLiveFiltered:',processedError);
  let resCallBackObj = {
   "status":"failure",
   "message":"Error: See Payload",
   "payload":[processedError],
   "balance":0,
   "callback":callback,
  };
  return resCallBack(resCallBackObj);
 }
}

module.exports = {
 resCallBack,
 getAccountsCustomLiveRaw,
 getAccountsCustomLiveFiltered
}
