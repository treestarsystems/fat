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
  if (!core.validateJSON(obj)) return res.send(400).send({"status":"failure","timeStamp": Date.now(),"message":"Invalid JSON Object"});
  //Validate input
  const {error} = validation.accountValidation.validate(obj,{abortEarly:false});
  if (error) {
   let message = "";
   error.details.forEach((e,i) => {
    message += `${e.message}. <br><br>`;
   });
   return res.status(400).send({"status":"failure","timeStamp": Date.now(),"message":message});
  }
  //Check if username or email exists
  const accountExists = await Account.findOne({accountName: obj.accountName,accountType: obj.accountType,brokerage: obj.brokerage});
  if (accountExists) return res.status(400).send({"status":"failure","timeStamp": Date.now(),"message":"Matching Account Already Exists"});
  //Define object to be saved.
  const accountObj = new Account({
   accountName: obj.accountName,
   accountType: obj.accountType,
   brokerage: obj.brokerage
  });
  //Save object
  accountObj.save()
   .then((account) => {
    res.status(200).send({
     "status":"success",
     "timeStamp": Date.now(),
     "message":"Account has been successfully created",
     "uuid":account.accountUUID
    });
   })
   .catch((err) => {
    res.status(400).send({"status":"failure","timeStamp": Date.now(),"message":err});
   });
 } catch (err) {
  res.status(400).send({"status":"failure","timeStamp": Date.now(),"message":err});
 }
});

router.post('/entry', async (req, res) => {
 try {
  let obj = req.body;
  if (!core.validateJSON(obj)) return res.send(400).send({"status":"failure","timeStamp": Date.now(),"message":"Invalid JSON Object"});
  //Validate input
  const {error} = validation.accountEntryValidation.validate(obj,{abortEarly:false});
  if (error) {
   let message = "";
   error.details.forEach((e,i) => {
    message += `${e.message}. <br><br>`;
   });
   return res.status(400).send({"status":"failure","timeStamp": Date.now(),"message":message});
  }
  //Define object to be saved.
  const entryObj = new Entry({
   accountUUID: obj.accountUUID,
   entryDescription: (obj.entryDescription? obj.entryDescription : ''),
   entryType: obj.entryType,
   balance: (obj.balance? obj.balance: 0)
  });
  //Save object
  entryObj.save()
   .then((entry) => {
    res.status(200).send({
     "status":"success",
     "timeStamp": Date.now(),
     "message":"Entry has been successfully created.",
     "accountUUID":obj.accountUUID,
     "uuid":entry.entryUUID
    });
   })
   .catch((err) => {
    res.status(400).send({"status":"failure","timeStamp": Date.now(),"message":err});
   });
 } catch (err) {
  res.status(400).send({"status":"failure","timeStamp": Date.now(),"message":err});
 }
});

module.exports = router;
