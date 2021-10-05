const mongoose = require('mongoose');
const core = require('../core/core');
const crypto = require("crypto");


const accountSchema = new mongoose.Schema({
 accountName: {
  type: String,
  required: true,
  min: 3,
  max: 255
 },
 accountDescription: {
  type: String,
  max: 255
 },
 accountTypePrimary: {
  type: String,
  required: true,
  max: 255
 },
 accountTypeSecondary: {
  type: String,
  required: true,
  max: 255
 },
 institution: {
  type: String,
  min: 3,
  max: 255
 },
 accountUUID: {
  type: String,
  default: `A-${crypto.randomBytes(16).toString("hex")}`
 },
 timeStamp: {
  type: Number,
  default: Date.now()
 }
});

const listEntrySchema = new mongoose.Schema({
 listName: {
  type: String,
  required: true
 },
 listNameLong: {
  type: String,
  required: true
 },
 list: {
  type: Array,
  required: true
 },
 listUUID: {
  type: String
 },
 timeStamp: {
  type: Number
 }
});

const accountEntrySchema = new mongoose.Schema({
 accountUUID: {
  type: String,
  required: true
 },
 entryDescription: {
  type: String,
  max: 255
 },
 entryType: {
  type: String,
  required: true,
  max: 255
 },
 value: {
  type: Number,
  required: true
 },
 entryUUID: {
  type: String,
  default: `E-${crypto.randomBytes(16).toString("hex")}`
 },
 timeStamp: {
  type: Number,
  default: Date.now()
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
 userUUID: {
  type: String,
  default: `U-${crypto.randomBytes(16).toString("hex")}`,
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
 timeStamp: {
  type: Date,
  default: Date.now
 }
});

let accountModel = mongoose.model(core.coreVars.dbAccountCollection,accountSchema,core.coreVars.dbAccountCollection);
let accountEntryModel = mongoose.model(core.coreVars.dbAccountEntryCollection,accountEntrySchema,core.coreVars.dbAccountEntryCollection);
let listEntryModel = mongoose.model(core.coreVars.dbListEntryCollection,listEntrySchema,core.coreVars.dbListEntryCollection);
let userModel = mongoose.model(core.coreVars.dbUserCollection,userSchema,core.coreVars.dbUserCollection);

module.exports = {
 accountModel,
 accountEntryModel,
 listEntryModel,
 userModel
}
