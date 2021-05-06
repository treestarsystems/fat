const coinbaseCore = require('./coinbaseCore.js');

//coinbaseCore.getAccounts().then((response) => console.log(response));
//coinbaseCore.getExchangeRates('XLM','USD').then((response) => console.log(response));
coinbaseCore.getAccounts()
 .then(async (response) => {
  let finalResponse = [];
  let modifiedResponse = response.map(async (a,i) => {
   let price = await coinbaseCore.getExchangeRates(a.currency.code,'USD').then((response));
   a.balance['totalValue'] = price * a.balance.amount;
   console.log(a);
  });
 })
