const router = require('express').Router();
const core = require('../../core/core.js');
var system = require('../../../system_confs/system_vars.json');
const validation = require('../../model/validation');
const passport = require('passport');
const User = require('../../model/schemas').userModel;

/*
router.post('/register', async (req,res) => {
 var obj = req.body;
 //Validate input
 const {error} = validation.registerValidation.validate(obj,{abortEarly:false});
 if (error) {
  let message = "";
  error.details.forEach((e,i) => {
   message += `${e.message}. <br><br>`;
  });
  return res.status(400).send({"status":"failure","message":message});
 }
 //Check registration key
 if (obj.accessLevel == 'member' && obj.registrationKey != 'Ham&Eggs!') return res.status(400).send({"status":"failure","message":"Invalid Reigstration Key."});
 if (obj.accessLevel == 'admin' && obj.registrationKey != 'adminaccount') return res.status(400).send({"status":"failure","message":"Invalid Reigstration Key."});
 //Check if username or email exists
 const userExists = await User.findOne({username: obj.username});
 if (userExists) return res.status(400).send({"status":"failure","message":"Username exists."});
 const emailExists = await User.findOne({email: obj.email});
 if (emailExists) return res.status(400).send({"status":"failure","message":"Email exists."});
 //Password match
 if (obj.password != obj.passwordRepeat) return res.status(400).send({"status":"failure","message":"Passwords do not match."});

 const saltHash = core.genPassword(obj.password);
 const salt = saltHash.salt;
 const hash = saltHash.hash;

 const userObj = new User({
  username: obj.username,
  fullname: obj.fullname,
  email: obj.email,
  accessLevel: obj.accessLevel,
  userId: `U-${core.uuidv4()}`,
  hash: hash,
  salt: salt,
 });

 userObj.save()
  .then((user) => {
   res.send({"status":"success","message":"User has been successfully created."});
  })
  .catch((err) => {
   res.send({"status":"failure","message":err});
  });
});
*/

/*
//Login
router.post('/login', async (req,res) => {
 var obj = req.body;
 //Validate input
 const {error} = validation.loginValidation.validate(obj,{abortEarly:false});
 if (error) {
  let message = "";
  error.details.forEach((e,i) => {
   message += `${e.message}. <br><br>`;
  });
  return res.status(400).send({"status":"failure","message":message});
 }
 //Check if Username
 const userExists = await User.findOne({username: obj.username});
 if (!userExists) return res.status(400).send({"status":"failure","message":"Username or Password is incorrect"});

 passport.authenticate('local', (err, user, info) => {
  if (err) return res.json({"status":"failure","message":err});
  req.login(user, (err) => {
   if (err) return res.json({"status":"failure","message":"Username or Password is incorrect"});
   res.json({"status":"success","message":"Redirecting..."});
  });
 })(req, res);
});
*/

/*
router.post('/login', (req, res, next) => {
 passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/user/login',
 })(req, res, next);
});
*/

module.exports = router;
