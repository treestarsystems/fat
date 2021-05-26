//Take an array of image file names and the id of the img element
function randomPicture(pa,id) {
 let randomPicture = pa[Math.floor(Math.random() * pa.length)];
 document.getElementById(id).src = `../public/images/${randomPicture}`;
}

loginPictureArray = [
 'piggy_bank_good.svg',
 'money_withdraw_income.svg',
 'money_bag_wealth.svg',
 'money_growing.svg',
 'money_cash_wallet_finance_cards_pay_payment.svg',
 'safe_gold_bank_deposit_wealth_money_finance_offshore.svg',
 'money_cash_wealth_income_offshore_finance_payout.svg',
 'safe_gold_money_wealth_finance_bank_deposit.svg',
 'money_cash_gold_wealth_income_safe_finance.svg',
 'treasure_chest_gold_wealth_jewel_money.svg',
 'money_safe_jewel_gold_wealth_phone_deposit.svg',
 'money_cash_wallet_finance_pay_payment_cards.svg',
 'treasure_chest_gold_wealth_money_jewel.svg',
 'bank_commercial_finance_money_transaction_building_courthouse.svg',
 'card_money_pay_payment_finance_shopping_check.svg',
 'money_cash_gold_wealth_income_deposit_finance.svg',
 'money_plant_grow_growth_business_finance_wealth.svg'
];

if (window.location.pathname == "/login" || window.location.pathname == "/register") {
 randomPicture(loginPictureArray,'login-image');
}
