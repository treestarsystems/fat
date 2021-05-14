const coinbaseCore = require('./coinbaseCore.js');

function resCallBack(obj) {
 let resObj = {
  "status":"",
  "message":"",
  "timeStamp": Date.now(),
  "portfolioBalance":"",
  "payload":""
 }
 if (obj.payload.length == 0) {
  resObj.status = "failure";
  resObj.message = "Empty Array Returned";
  res.send(resObj).status(204);
 } else {
  resObj.status = "success";
  resObj.message = "success";
  resObj.payload = obj.payload;
  resObj.portfolioBalance = obj.portfolioBalance;
  obj.callback.setHeader('Content-Type','application/json; charset=utf-8');
  obj.callback.send(resObj).status(200);
 }
}

function getAccountsCustom (callback) {
 coinbaseCore.getAccounts()
  .then(async (response) => {
   let portfolioBalance = 0;
   let processedArray = coinbaseCore.getAccountsPreProcessor(response);
   for (let p = 0; p < processedArray.length; p++) {
    let price = await coinbaseCore.getExchangeRates(processedArray[p].currency.code,'USD').then((response));
    processedArray[p].balance['exchangPrice'] = price;
    processedArray[p].balance['totalValue'] = price * processedArray[p].balance.amount;
    portfolioBalance += price * processedArray[p].balance.amount;
    if (p == processedArray.length-1) {
     let resCallBackObj = {
      "payload":processedArray,
      "portfolioBalance":portfolioBalance,
      "callback":callback,
     };
     return resCallBack(resCallBackObj);
    }
   }
  });
}

module.exports = {
 resCallBack,
 getAccountsCustom
}
