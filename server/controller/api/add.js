const express = require('express');
const router = express.Router();
const core = require('../../core/core');
const validation = require('../../model/validation');
const passport = require('passport');
const Account = require('../../model/schemas').accountModel;
const Entry = require('../../model/schemas').accountEntryModel;
const List = require('../../model/schemas').listEntryModel;
const mongoose = require('mongoose');

router.post('/account', async (req, res) => {
 try {
  let obj = req.body;
  if (!core.validateJSON(obj)) return res.send(400).send({"status":"failure","message":"Invalid JSON Object","timeStamp": Date.now(),"payload":[]});
  //Validate input
  const {error} = validation.accountValidation.validate(obj,{abortEarly:false});
  if (error) {
   let message = "";
   error.details.forEach((e,i) => {
    message += `${e.message}. <br><br>`;
   });
   return res.status(400).send({"status":"failure","message":message,"timeStamp": Date.now(),"payload":[]});
  }
  //Check if username or email exists
  const accountExists = await Account.findOne({accountName: obj.accountName.toUpperCase(),accountType: obj.accountType,institution: obj.institution});
  if (accountExists) return res.status(400).send({"status":"failure","message":"Matching Account Already Exists","timeStamp": Date.now(),"payload":[]});
  //Define object to be saved.
  const accountObj = new Account({
   accountName: obj.accountName.toUpperCase(),
   accountType: obj.accountType,
   accountDescription: (obj.accountDescription? obj.accountDescription : ''),
   institution: obj.institution
  });
  //Save object
  accountObj.save()
   .then((account) => {
    res.status(200).send({
     "status":"success",
     "message":"Account has been successfully created",
     "timeStamp": Date.now(),
     "uuid":account.accountUUID
    });
   })
   .catch((err) => {
    res.status(400).send({"status":"failure","message":"failure","timeStamp": Date.now(),"payload":[err]});
   });
 } catch (err) {
  res.status(400).send({"status":"failure","message":"failure","timeStamp": Date.now(),"payload":[err]});
 }
});

router.post('/entry', async (req, res) => {
 try {
  let obj = req.body;
  if (!core.validateJSON(obj)) return res.send(400).send({"status":"failure","message":"Invalid JSON Object","timeStamp": Date.now(),"payload":[]});
  //Validate input
  const {error} = validation.accountEntryValidation.validate(obj,{abortEarly:false});
  if (error) {
   let message = "";
   error.details.forEach((e,i) => {
    message += `${e.message}. <br><br>`;
   });
   return res.status(400).send({"status":"failure","message":message,"timeStamp": Date.now(),"payload":[]});
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
     "message":"Entry has been successfully created.",
     "timeStamp": Date.now(),
     "accountUUID":obj.accountUUID,
     "uuid":entry.entryUUID
    });
   })
   .catch((err) => {
    res.status(400).send({"status":"failure","message":"failure","timeStamp": Date.now(),"payload":[err]});
   });
 } catch (err) {
  res.status(400).send({"status":"failure","message":"failure","timeStamp": Date.now(),"payload":[err]});
 }
});

router.post('/list', async (req, res) => {
 try {
  let obj = req.body;
  let query = List.where({listName: obj.listName});
  query.setOptions({upsert: true});
  query.replaceOne(obj)
   .then(async (list) => {
     try {
      const list = await List.findOne({listName: obj.listName},{_id: 0});
      res.status(200).send({
       "status":"success",
       "message":"List has been successfully created/updated.",
       "timeStamp": Date.now(),
       "payload":list
      });
     } catch (err) {
      res.status(400).send({"status":"failure","message":"failure","timeStamp": Date.now(),"payload":[err]});
     }
   });
 } catch (err) {
  res.status(400).send({"status":"failure","message":"failure","timeStamp": Date.now(),"payload":[err]});
 }
});

module.exports = router;
