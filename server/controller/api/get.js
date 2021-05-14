const express = require('express');
const router = express.Router();
const core = require('../../core/core');
const validation = require('../../model/validation');
const passport = require('passport');
const Account = require('../../model/schemas').accountModel;
const Entry = require('../../model/schemas').accountEntryModel;
const coinbaseCustom = require('../coinbase/coinbaseCustom.js');

router.get('/account/all', async (req, res) => {
 try {
  //Check if username or email exists
  const getAccountResult = await Account.find({},{_id:0,__v:0});
  if (!getAccountResult) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","payload":[]});
  if (getAccountResult.length == 0) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","payload":[]});
  res.status(200).send({
   "status":"success",
   "message":"See Payload",
   "timeStamp":Date.now(),
   "balance":0,
   "payload":getAccountResult
  });
 } catch (err) {
  console.log(err)
  res.status(400).send({"status":"failure","message":err,"payload":[]});
 }
});

router.get('/account/:accountUUID', async (req, res) => {
 try {
  let accountUUID = req.params.accountUUID;
  //Check if username or email exists
  const getAccountResult = await Account.find({accountUUID: accountUUID},{_id:0,__v:0});
  if (!getAccountResult) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","payload":[]});
  if (getAccountResult.length == 0) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","payload":[]});
  res.status(200).send({"status":"success","message":"See Payload","payload":getAccountResult});
 } catch (err) {
  console.log(err)
  res.status(400).send({"status":"failure","message":err,"payload":[]});
 }
});

router.get('/coinbase/all', (req, res) => {
 coinbaseCustom.getAccountsCustom(res);
});

router.get('/entry/all', async (req, res) => {
 try {
  //Check if username or email exists
  const getEntryResult = await Entry.find({},{_id:0,__v:0});
  if (!getEntryResult) return res.status(400).send({"status":"failure","message":"No Matching Entry(s) Exist","payload":[]});
  if (getEntryResult.length == 0) return res.status(400).send({"status":"failure","message":"No Matching Entry(s) Exist","payload":[]});
  res.status(200).send({
   "status":"success",
   "message":"See Payload",
   "timeStamp":Date.now(),
   "balance":0,
   "payload":getEntryResult
  });
 } catch (err) {
  console.log(err)
  res.status(400).send({"status":"failure","message":err,"payload":[]});
 }
});

router.get('/entry/:entryUUID', async (req, res) => {
 try {
  let entryUUID = req.params.entryUUID;
  //Check if username or email exists
  const getEntryResult = await Entry.find({entryUUID: entryUUID},{_id:0,__v:0});
  if (!getEntryResult) return res.status(400).send({"status":"failure","message":"No Matching Entry(s) Exist","payload":[]});
  if (getEntryResult.length == 0) return res.status(400).send({"status":"failure","message":"No Matching Entry(s) Exist","payload":[]});
  res.status(200).send({"status":"success","message":"See Payload","payload":getEntryResult});
 } catch (err) {
  console.log(err)
  res.status(400).send({"status":"failure","message":err,"payload":[]});
 }
});

module.exports = router;
