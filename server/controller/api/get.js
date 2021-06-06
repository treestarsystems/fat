const express = require('express');
const router = express.Router();
const core = require('../../core/core');
const validation = require('../../model/validation');
const passport = require('passport');
const Account = require('../../model/schemas').accountModel;
const Entry = require('../../model/schemas').accountEntryModel;
const List = require('../../model/schemas').listEntryModel;
const coinbaseCustom = require('../coinbase/coinbaseCustom.js');

//Account Endpoints
async function getAccountsResponse (reqParamsString,reqParamsVariable,callback) {
 let queryObj = {};
 if (reqParamsString != 'all') queryObj[`${reqParamsString}`] = reqParamsVariable;
 try {
  //Check if accountType exists
  const getAccountResult = await Account.find(queryObj,{_id:0,__v:0});
  if (!getAccountResult) return callback.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","timeStamp":Date.now(),"payload":[]});
  if (getAccountResult.length == 0) return callback.status(400).send({"status":"failure","message":"No Matching Account(s) Exist","timeStamp":Date.now(),"payload":[]});
  let getAccountResultCount = 0;
  getAccountResultCount = await Account.countDocuments(queryObj, (err, count) => {
   if (err) return err;
   return count;
  });
  callback.status(200).send({
   "status":"success",
   "message":"success",
   "timeStamp":Date.now(),
   "totalRecords":getAccountResultCount,
   "payload":getAccountResult
  });
 } catch (err) {
  console.log(`get:account:${reqParamsString}:`,err)
  callback.status(400).send({"status":"failure","message":'failure',"timeStamp":Date.now(),"payload":[err]});
 }
}

router.get('/account/:userInput', async (req, res) => {
 /*
  This needs a lot of work if it is supposed to show all accounts.
  I need to finish other endpoints before refining this one.
 */
 let paramsVar = req.params.userInput;
 await getAccountsResponse (paramsVar,'',res);
});

router.get('/account/type/:userInput', async (req, res) => {
 let paramsVar = req.params.userInput;
 await getAccountsResponse ('accountType',paramsVar,res);
});

router.get('/account/institution/:userInput', async (req, res) => {
 let paramsVar = req.params.userInput;
 await getAccountsResponse ('institution',paramsVar,res);
});

router.get('/account/uuid/:userInput', async (req, res) => {
 let paramsVar = req.params.userInput;
 await getAccountsResponse ('accountUUID',paramsVar,res);
});

router.get('/account/name/:userInput', async (req, res) => {
 let paramsVar = req.params.userInput;
 await getAccountsResponse ('accountName',paramsVar,res);
});

//Coinbase Endpoints
router.get('/coinbase/raw', (req, res) => {
 try {
  coinbaseCustom.getAccountsCustomLiveRaw(res);
 } catch (err) {
  console.log('/coinbase/raw:',err)
  res.status(400).send({"status":"failure","message":'failure',"timeStamp":Date.now(),"payload":[err]});
 }
});

router.get('/coinbase/filtered', (req, res) => {
 try {
  coinbaseCustom.getAccountsCustomLiveFiltered(res);
 } catch (err) {
  console.log('/coinbase/filtered:',err)
  res.status(400).send({"status":"failure","message":'failure',"timeStamp":Date.now(),"payload":[err]});
 }
});

//Entry Endpoints
async function getEntriesResponse (reqParamsString,reqParamsVariable,callback) {
 let queryObj = {};
 if (reqParamsString != 'all') queryObj[`${reqParamsString}`] = reqParamsVariable;
 try {
  //Check if entries exists
  const getEntryResult = await Entry.find(queryObj,{_id:0,__v:0});
  if (!getEntryResult) return callback.status(400).send({"status":"failure","message":"No Matching Entry(s) Exist","timeStamp":Date.now(),"payload":[]});
  if (getEntryResult.length == 0) return callback.status(400).send({"status":"failure","message":"No Matching Entry(s) Exist","timeStamp":Date.now(),"payload":[]});
  let getEntryResultCount = 0;
  getEntryResultCount = await Entry.countDocuments(queryObj, (err, count) => {
   if (err) return err;
   return count;
  });
  callback.status(200).send({
   "status":"success",
   "message":"success",
   "timeStamp":Date.now(),
   "totalRecords":getEntryResultCount,
   "balance":0,
   "payload":getEntryResult
  });
 } catch (err) {
  console.log(`get:entry:${reqParamsString}`, err)
  callback.status(400).send({"status":"failure","message":'failure',"timeStamp":Date.now(),"payload":[err]});
 }
}

router.get('/entry/:userInput', async (req, res) => {
 let paramsVar = req.params.userInput;
 await getEntriesResponse (paramsVar,'',res);
});

router.get('/entry/uuid/:userInput', async (req, res) => {
 let paramsVar = req.params.userInput;
 await getEntriesResponse ('entryUUID',paramsVar,res);
});

router.get('/entry/accountuuid/:userInput', async (req, res) => {
 let paramsVar = req.params.userInput;
 await getEntriesResponse ('accountUUID',paramsVar,res);
});

router.get('/entry/type/:userInput', async (req, res) => {
 let paramsVar = req.params.userInput;
 await getEntriesResponse ('entryType',paramsVar,res);
});

//List Endpoints
async function getListResponse (reqParamsString,reqParamsVariable,callback) {
 let queryObj = {};
 if (reqParamsString != 'all') queryObj[`${reqParamsString}`] = reqParamsVariable;
 try {
  //Check if entries exists
  const getListResult = await List.find(queryObj,{_id:0,__v:0});
  if (!getListResult) return callback.status(400).send({"status":"failure","message":"No Matching List(s) Exist","timeStamp":Date.now(),"payload":[]});
  if (getListResult.length == 0) return callback.status(400).send({"status":"failure","message":"No Matching List(s) Exist","timeStamp":Date.now(),"payload":[]});
  let getListResultCount = 0;
  getListResultCount = await List.countDocuments(queryObj, (err, count) => {
   if (err) return err;
   return count;
  });
  callback.status(200).send({
   "status":"success",
   "message":"success",
   "timeStamp":Date.now(),
   "totalRecords":getListResultCount,
   "payload":getListResult
  });
 } catch (err) {
  console.log(`get:entry:${reqParamsString}`, err)
  callback.status(400).send({"status":"failure","message":'failure',"timeStamp":Date.now(),"payload":[err]});
 }
}

router.get('/list/all', async (req, res) => {
 let paramsVar = req.params.userInput;
 await getListResponse ('all',paramsVar,res);
});

router.get('/list/name/:userInput', async (req, res) => {
 let paramsVar = req.params.userInput;
 await getListResponse ('listName',paramsVar,res);
});

module.exports = router;
