const express = require('express');
const router = express.Router();
const coinbaseCustom = require('../coinbase/coinbaseCustom.js');

router.get('/accounts', (req, res) => {
 coinbaseCustom.getAccountsCustom(res);
});

module.exports = router;
