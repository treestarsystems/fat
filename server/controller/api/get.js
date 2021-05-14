const express = require('express');
const router = express.Router();
const core = require('../../core/core');
const validation = require('../../model/validation');
const passport = require('passport');
const Account = require('../../model/schemas').accountModel;

router.get('/account/all', async (req, res) => {
 try {
  let obj = req.body;
  //Check if username or email exists
  const getAccountResult = await Account.find({},{_id:0,__v:0});
  if (!getAccountResult) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","payload":[]});
  res.status(200).send({"status":"success","message":"See Payload","payload":getAccountResult});
 } catch (err) {
  console.log(err)
  res.status(400).send({"status":"failure","message":err,"payload":[]});
 }
});

module.exports = router;
