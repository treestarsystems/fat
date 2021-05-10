const coinbaseCore = require('./coinbaseCore.js');

//coinbaseCore.getAccounts().then((response) => console.log(response));
//coinbaseCore.getExchangeRates('XLM','USD').then((response) => console.log(response));

/*
function resCallBack(v) {
 let resObj = {
  "status":"",
  "message":"",
  "payload":"",
 }
 if (v.length == 0) {
  resObj.status = "failure";
  resObj.message = "Empty Array Returned";
  res.send(resObj).status(204);
 } else {
  resObj.status = "success";
  resObj.message = "There's Your Sign!";
  resObj.payload = v;
  res.send(resObj).status(200);
 }
}


coinbaseCore.getAccounts()
 .then(async (response) => {
  let finalResponse = [];
  response.forEach(async (a,i) => {
   let price = await coinbaseCore.getExchangeRates(a.currency.code,'USD').then((response));
   a.balance['exchangPrice'] = price;
   a.balance['totalValue'] = price * a.balance.amount;
   finalResponse.push(a);
   if (response.length-1 == i) return calledCallback(finalResponse);
  });
 });
*/
//Pass Object with Options
/*
 {
  "payload":"",
  "portfolioBalance":"",
  "callback":"",
 }
*/
function resCallBack(obj) {
 let resObj = {
  "status":"",
  "message":"",
  "payload":"",
  "portfolioBalance":""
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
