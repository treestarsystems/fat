const express = require('express');
const router = express.Router();
const core = require('../../core/core');
const validation = require('../../model/validation');
const passport = require('passport');
const Account = require('../../model/schemas').accountModel;
const Entry = require('../../model/schemas').accountEntryModel;
const List = require('../../model/schemas').listEntryModel;
const mongoose = require('mongoose');
const crypto = require("crypto");

router.post('/account', async (req, res) => {
 try {
  let obj = req.body;
  if (!core.validateJSON(obj)) return res.send(200).send({"status":"failure","message":"Invalid JSON Object","timeStamp": Date.now(),"payload":[]});
  //Validate input
  const {error} = validation.accountValidation.validate(obj,{abortEarly:false});
  if (error) {
   let message = "";
   error.details.forEach((e,i) => {
    message += `${e.message}. <br><br>`;
   });
   return res.status(200).send({"status":"failure","message":message,"timeStamp": Date.now(),"payload":[]});
  }
  //Check if username or email exists
  const accountExists = await Account.findOne({accountName: obj.accountName.toUpperCase(),accountType: obj.accountType,institution: obj.institution});
  if (accountExists) return res.status(200).send({"status":"failure","message":"Matching Account Already Exists","timeStamp": Date.now(),"payload":[]});
  //Define object to be saved.
  const accountObj = new Account({
   accountName: obj.accountName.toUpperCase(),
   accountTypePrimary: obj.accountTypePrimary,
   accountTypeSecondary: obj.accountTypeSecondary,
   accountDescription: (obj.accountDescription? obj.accountDescription : ''),
   institution: obj.institution,
   accountUUID: (obj.accountUUID ? obj.accountUUID:undefined)
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
    res.status(200).send({"status":"failure","message":"failure","timeStamp": Date.now(),"payload":[err]});
   });
 } catch (err) {
  res.status(200).send({"status":"failure","message":"failure","timeStamp": Date.now(),"payload":[err]});
 }
});

router.post('/entry', async (req, res) => {
 try {
  let obj = req.body;
  if (!core.validateJSON(obj)) return res.send(200).send({"status":"failure","message":"Invalid JSON Object","timeStamp": Date.now(),"payload":[]});
  //Validate input
  const {error} = validation.accountEntryValidation.validate(obj,{abortEarly:false});
  if (error) {
   let message = "";
   error.details.forEach((e,i) => {
    message += `${e.message}. <br><br>`;
   });
   return res.status(200).send({"status":"failure","message":message,"timeStamp": Date.now(),"payload":[]});
  }
  //Define object to be saved.
  const entryObj = new Entry({
   accountUUID: obj.accountUUID,
   entryDescription: (obj.entryDescription? obj.entryDescription : ''),
   entryType: obj.entryType,
   value: (obj.value? obj.value: 0),
   entryUUID: undefined
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
    res.status(200).send({"status":"failure","message":"failure","timeStamp": Date.now(),"payload":[err]});
   });
 } catch (err) {
  res.status(200).send({"status":"failure","message":"failure","timeStamp": Date.now(),"payload":[err]});
 }
});

//THIS WILL UPDATE THE UUID AS WELL
router.post('/list', async (req, res) => {
 try {
  let arrayOfObjs = req.body;
  let errorMessage = "";
  for (let i = 0; i < arrayOfObjs.length; i++) {
   //Validate input
   const {error} = validation.listEntryValidation.validate(arrayOfObjs[i],{abortEarly:false});
   if (error) {
    error.details.forEach((ee,ie) => {
     errorMessage += `List #${i+1}: ${ee.message}. <br><br>`;
    });
   }
  }
  if (errorMessage) {
   return res.status(200).send({
    "status":"failure",
    "message":`${errorMessage} <br><br>No Lists Have Been Saved. <br><br>`,
    "timeStamp": Date.now(),
    "payload":[]
   });
  }
  let queryFailureCount = 0;
  let querySuccessCount = 0;
  let queryFailureMessage = "";
  let querySuccessMessage = "";
  for (let i = 0; i < arrayOfObjs.length; i++) {
   arrayOfObjs[i].listUUID = `L-${crypto.randomBytes(16).toString("hex")}`;
   arrayOfObjs[i].timeStamp = Date.now();
   let query = List.where({listName: arrayOfObjs[i].listName});
   query.setOptions({upsert: true});
   query.replaceOne(arrayOfObjs[i])
    .then(async (list) => {
      try {
       await List.countDocuments({listName: arrayOfObjs[i].listName}, (err, count) => {
        if (err) {
         queryFailureCount++;
         queryFailureMessage += `${arrayOfObjs[i].listNameLong}: Error - ${err} <br><br>`;
        }
        querySuccessCount++;
        querySuccessMessage += `${arrayOfObjs[i].listNameLong}: List has been successfully created/updated. <br><br>`;
       });
      } catch (err) {
       queryFailureCount++;
       queryFailureMessage += `${arrayOfObjs[i].listNameLong}: Error - ${err} <br><br>`;
      }
      if (arrayOfObjs.length-1 == i) {
       if (queryFailureCount > 0) {
        res.status(200).send({
         "status":"failure",
         "message":`Failure(${queryFailureCount}): <br>${queryFailureMessage}<br><br>Success(${querySuccessCount}): <br>${querySuccessMessage}`,
         "timeStamp": Date.now(),
         "payload":""
        });
       } else {
        res.status(200).send({
         "status":"success",
         "message":`${querySuccessCount} List(s) has been successfully created/updated.`,
         "timeStamp": Date.now(),
         "payload":""
        });
       }
      }
    });
  }
 } catch (err) {
  res.status(200).send({"status":"failure","message":"failure","timeStamp": Date.now(),"payload":[err]});
 }
});

module.exports = router;
