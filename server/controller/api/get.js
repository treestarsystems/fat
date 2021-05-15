const express = require('express');
const router = express.Router();
const core = require('../../core/core');
const validation = require('../../model/validation');
const passport = require('passport');
const Account = require('../../model/schemas').accountModel;
const Entry = require('../../model/schemas').accountEntryModel;
const coinbaseCustom = require('../coinbase/coinbaseCustom.js');

/*
 This needs a lot of work if it is supposed to show all accounts.
 I need to finish other endpoints before refining this one.
*/

//Account Endpoints
router.get('/account/all', async (req, res) => {
 try {
  //Check if account exists
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
  console.log('/account/all:',err)
  res.status(400).send({"status":"failure","message":err,"timeStamp":Date.now(),"payload":[]});
 }
});

router.get('/account/type/:accountType', async (req, res) => {
 try {
  let accountType = req.params.accountType;
  //Check if accountType exists
  const getAccountResult = await Account.find({accountType: accountType},{_id:0,__v:0});
  if (!getAccountResult) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","timeStamp":Date.now(),"payload":[]});
  if (getAccountResult.length == 0) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","timeStamp":Date.now(),"payload":[]});
  const getAccountResultCount = await Account.countDocuments({accountType: accountType}, (err, count) => {
   if (err) return err;
   return count;
  });
  res.status(200).send({
   "status":"success",
   "message":"See Payload",
   "timeStamp":Date.now(),
   "totalRecords":getAccountResultCount,
   "payload":getAccountResult
  });
 } catch (err) {
  console.log('/account/type/:accountType:',err)
  res.status(400).send({"status":"failure","message":err,"timeStamp":Date.now(),"payload":[]});
 }
});

router.get('/account/institution/:institution', async (req, res) => {
 try {
  let institution = req.params.institution;
  //Check if institution exists
  const getAccountResult = await Account.find({institution: institution},{_id:0,__v:0});
  if (!getAccountResult) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","timeStamp":Date.now(),"payload":[]});
  if (getAccountResult.length == 0) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","timeStamp":Date.now(),"payload":[]});
  const getAccountResultCount = await Account.countDocuments({institution: institution}, (err, count) => {
   if (err) return err;
   return count;
  });
  res.status(200).send({
   "status":"success",
   "message":"See Payload",
   "timeStamp":Date.now(),
   "totalRecords":getAccountResultCount,
   "payload":getAccountResult,
  });
 } catch (err) {
  console.log('/account/institution/:institution:',err)
  res.status(400).send({"status":"failure","message":err,"timeStamp":Date.now(),"payload":[]});
 }
});

router.get('/account/uuid/:accountUUID', async (req, res) => {
 try {
  let accountUUID = req.params.accountUUID;
  //Check if accountUUID exists
  const getAccountResult = await Account.find({accountUUID: accountUUID},{_id:0,__v:0});
  if (!getAccountResult) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","timeStamp":Date.now(),"payload":[]});
  if (getAccountResult.length == 0) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","timeStamp":Date.now(),"payload":[]});
  const getAccountResultCount = await Account.countDocuments({accountUUID: accountUUID}, (err, count) => {
   if (err) return err;
   return count;
  });
  res.status(200).send({
   "status":"success",
   "message":"See Payload",
   "timeStamp":Date.now(),
   "totalRecords":getAccountResultCount,
   "payload":getAccountResult
  });
 } catch (err) {
  console.log('/account/uuid/:accountUUID:',err)
  res.status(400).send({"status":"failure","message":err,"timeStamp":Date.now(),"payload":[]});
 }
});

router.get('/account/name/:accountName', async (req, res) => {
 try {
  let accountName = req.params.accountName.toUpperCase();
  //Check if accountName exists
  const getAccountResult = await Account.find({accountName: accountName},{_id:0,__v:0});
  if (!getAccountResult) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","timeStamp":Date.now(),"payload":[]});
  if (getAccountResult.length == 0) return res.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","timeStamp":Date.now(),"payload":[]});
  const getAccountResultCount = await Account.countDocuments({accountName: accountName}, (err, count) => {
   if (err) return err;
   return count;
  });
  res.status(200).send({
   "status":"success",
   "message":"See Payload",
   "timeStamp":Date.now(),
   "totalRecords":getAccountResultCount,
   "payload":getAccountResult
  });
 } catch (err) {
  console.log('/account/name/:accountName:',err)
  res.status(400).send({"status":"failure","message":err,"timeStamp":Date.now(),"payload":[]});
 }
});

//Coinbase Endpoints
router.get('/coinbase/raw', (req, res) => {
 try {
  coinbaseCustom.getAccountsCustomLiveRaw(res);
 } catch (err) {
  console.log('/coinbase/raw:',err)
  res.status(400).send({"status":"failure","message":err,"timeStamp":Date.now(),"payload":[]});
 }
});

router.get('/coinbase/filtered', (req, res) => {
 try {
  coinbaseCustom.getAccountsCustomLiveFiltered(res);
 } catch (err) {
  console.log('/coinbase/filtered:',err)
  res.status(400).send({"status":"failure","message":err,"timeStamp":Date.now(),"payload":[]});
 }
});

//Entry Endpoints
router.get('/entry/all', async (req, res) => {
 try {
  //Check if entries exists
  const getEntryResult = await Entry.find({},{_id:0,__v:0});
  if (!getEntryResult) return res.status(400).send({"status":"failure","message":"No Matching Entry(s) Exist","timeStamp":Date.now(),"payload":[]});
  if (getEntryResult.length == 0) return res.status(400).send({"status":"failure","message":"No Matching Entry(s) Exist","timeStamp":Date.now(),"payload":[]});
  const getEntryResultCount = await Entry.countDocuments({}, (err, count) => {
   if (err) return err;
   return count;
  });
  res.status(200).send({
   "status":"success",
   "message":"See Payload",
   "timeStamp":Date.now(),
   "balance":0,
   "payload":getEntryResult
  });
 } catch (err) {
  console.log('/entry/all:', err)
  res.status(400).send({"status":"failure","message":err,"timeStamp":Date.now(),"payload":[]});
 }
});

router.get('/entry/uuid/:entryUUID', async (req, res) => {
 try {
  let entryUUID = req.params.entryUUID;
  //Check if entryUUID exists
  const getEntryResult = await Entry.find({entryUUID: entryUUID},{_id:0,__v:0});
  if (!getEntryResult) return res.status(400).send({"status":"failure","message":"No Matching Entry(s) Exist","timeStamp":Date.now(),"payload":[]});
  if (getEntryResult.length == 0) return res.status(400).send({"status":"failure","message":"No Matching Entry(s) Exist","timeStamp":Date.now(),"payload":[]});
  res.status(200).send({"status":"success","message":"See Payload","timeStamp":Date.now(),"payload":getEntryResult});
 } catch (err) {
  console.log('/entry/uuid/:entryUUID:', err)
  res.status(400).send({"status":"failure","message":err,"timeStamp":Date.now(),"payload":[]});
 }
});

module.exports = router;
