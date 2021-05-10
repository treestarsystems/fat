const mongoose = require('mongoose');
const core = require('../core/core');

const accountSchema = new mongoose.Schema({
 accountName: {
  type: String,
  required: true,
  min: 3,
  max: 255
 },
 accountDescription: {
  type: String,
  required: true
 },
 accountType: {
  type: String,
  match: /^retirement$|^generalInvesting$|^crypto$|^debt$|^checking$|^saving$|^creditScore$/,
  required: true,
  min: 6,
  max: 255
 },
 brokerage: {
  type: String,
  match: /^m1finance$|^coinbase$|^massmutual$/,
  required: true,
  min: 3,
  max: 255
 },
 balance: {
  type: Number,
  required: true
 },
 entryUUID: {
  type: String,
  default: core.uuidv4()
 },
 date: {
  type: Date,
  default: Date.now
 }
});

const userSchema = new mongoose.Schema({
 username: {
  type: String,
  required: true,
  min: 6,
  max: 255
 },
 fullname: {
  type: String,
  required: true,
  min: 6,
  max: 255
 },
 email: {
  type: String,
  required: true,
  min: 6,
  max: 255
 },
 accessLevel: {
  type: String,
  required: true
 },
 userId: {
  type: String,
  required: true
 },
 hash: {
  type: String,
  required: true
 },
 salt: {
  type: String,
  required: true
 },
 date: {
  type: Date,
  default: Date.now
 }
});

let accountModel = mongoose.model(core.coreVars.dbAccountCollection,accountSchema,core.coreVars.dbAccountCollection);
let userModel = mongoose.model(core.coreVars.dbUserCollection,userSchema,core.coreVars.dbUserCollection);

module.exports = {
 accountModel,
 userModel
}

