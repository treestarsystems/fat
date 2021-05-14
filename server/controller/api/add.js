const express = require('express');
const router = express.Router();
const core = require('../../core/core');
const validation = require('../../model/validation');
const passport = require('passport');
const Account = require('../../model/schemas').accountModel;
const Entry = require('../../model/schemas').accountEntryModel;

router.post('/account', async (req, res) => {
 try {
  let obj = req.body;
  if (!core.validateJSON(obj)) return res.send(400).send({"status":"failure","message":"Invalid JSON Object"});
  //Validate input
  const {error} = validation.accountValidation.validate(obj,{abortEarly:false});
  if (error) {
   let message = "";
   error.details.forEach((e,i) => {
    message += `${e.message}. <br><br>`;
   });
   return res.status(400).send({"status":"failure","message":message});
  }
  //Check if username or email exists
  const accountExists = await Account.findOne({accountName: obj.accountName,accountType: obj.accountType,brokerage: obj.brokerage});
  if (accountExists) return res.status(400).send({"status":"failure","message":"Matching Account Already Exists"});
  //Define object to be saved.
  const accountObj = new Account({
   accountName: obj.accountName,
   accountType: obj.accountType,
   brokerage: obj.brokerage,
   balance: obj.balance
  });
  //Save object
  accountObj.save()
   .then((account) => {
    res.status(200).send({
     "status":"success",
     "message":"Account has been successfully created",
     "accountUUID":account.accountUUID
    });
   })
   .catch((err) => {
    res.status(400).send({"status":"failure","message":err});
   });
 } catch (err) {
  res.status(400).send({"status":"failure","message":err});
 }
});

router.post('/entry', async (req, res) => {
 try {
  let obj = req.body;
  if (!core.validateJSON(obj)) return res.send(400).send({"status":"failure","message":"Invalid JSON Object"});
  //Validate input
  const {error} = validation.accountEntryValidation.validate(obj,{abortEarly:false});
  if (error) {
   let message = "";
   error.details.forEach((e,i) => {
    message += `${e.message}. <br><br>`;
   });
   return res.status(400).send({"status":"failure","message":message});
  }
  //Check if username or email exists
  const accountExists = await Entry.findOne({accountName: obj.accountName,accountType: obj.accountType,brokerage: obj.brokerage});
  if (accountExists) return res.status(400).send({"status":"failure","message":"Matching Entry Already Exists"});
  //Define object to be saved.
  const accountObj = new Entry({
   accountName: obj.accountName,
   accountType: obj.accountType,
   brokerage: obj.brokerage,
   balance: obj.balance
  });
  //Save object
  accountObj.save()
   .then((account) => {
    res.status(200).send({"status":"success","message":"Entry has been successfully created."});
   })
   .catch((err) => {
    res.status(400).send({"status":"failure","message":err});
   });
 } catch (err) {
  res.status(400).send({"status":"failure","message":err});
 }
});

module.exports = router;
