const express = require('express');
const router = express.Router();
const core = require('../../core/core');
const validation = require('../../model/validation');
const passport = require('passport');
const Account = require('../../model/schemas').accountModel;
const Entry = require('../../model/schemas').accountEntryModel;
const List = require('../../model/schemas').listEntryModel;

router.delete('/account/uuid/:userInput', async (req, res) => {
 let paramsVar = req.params.userInput;
 try {
  //Check if accountUUID exists
  const removeAccountResult = await Account.deleteOne({accountUUID: paramsVar},{_id:0,__v:0});
  if (removeAccountResult.deletedCount == 0) return res.status(200).send({"status":"failure","message":"No Matching Account(s) Exist","timeStamp":Date.now(),"payload":[]});
  res.status(200).send({"status":"success","message":"Account Removed","timeStamp":Date.now(),"payload":[removeAccountResult]});
 } catch (err) {
  res.status(400).send({"status":"failure","message":"failure","timeStamp":Date.now(),"payload":[err]});
 }
});

router.delete('/entry/uuid/:userInput', async (req, res) => {
 let paramsVar = req.params.userInput;
 try {
  //Check if entryUUID exists
  const removeEntryResult = await Entry.deleteOne({entryUUID: paramsVar},{_id:0,__v:0});
  if (removeEntryResult.deletedCount == 0) return res.status(200).send({"status":"failure","message":"No Matching Entry(s) Exist","timeStamp":Date.now(),"payload":[]});
  res.status(200).send({"status":"success","message":"Entry Removed","timeStamp":Date.now(),"payload":[removeEntryResult]});
 } catch (err) {
  res.status(400).send({"status":"failure","message":"failure","timeStamp":Date.now(),"payload":[err]});
 }
});

router.delete('/list/name/:userInput', async (req, res) => {
 let paramsVar = req.params.userInput;
 try {
  //Check if listName exists
  const removeListResult = await List.deleteOne({listName: paramsVar},{_id:0,__v:0});
  if (removeListResult.deletedCount == 0) return res.status(200).send({"status":"failure","message":"No Matching List(s) Exist","timeStamp":Date.now(),"payload":[]});
  res.status(200).send({"status":"success","message":"List Removed","timeStamp":Date.now(),"payload":[removeListResult]});
 } catch (err) {
  res.status(400).send({"status":"failure","message":"failure","timeStamp":Date.now(),"payload":[err]});
 }
});

module.exports = router;
