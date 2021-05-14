const express = require('express');
const router = express.Router();
const core = require('../../core/core');
const validation = require('../../model/validation');
const passport = require('passport');
const Account = require('../../model/schemas').accountModel;

router.delete('/account/:accountUUID', async (req, res) => {
 try {
  let accountUUID = req.params.accountUUID;
  //Check if username or email exists
  const removeAccountResult = await Account.deleteOne({accountUUID: accountUUID},{_id:0,__v:0});
  if (removeAccountResult.deletedCount == 0) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","payload":[]});
  res.status(200).send({"status":"success","message":"Account Removed","payload":[removeAccountResult]});
 } catch (err) {
  res.status(400).send({"status":"failure","message":err,"payload":[]});
 }
});

module.exports = router;
