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
  max: 255
 },
 accountType: {
  type: String,
  match: core.coreRegExs().accountTypeValidation,
  required: true,
  max: 255
 },
 institution: {
  type: String,
  match: core.coreRegExs().institutionValidation,
  min: 3,
  max: 255
 },
 accountUUID: {
  type: String,
  default: `A-${core.uuidv4()}_${Date.now()}`
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
 list: {
  type: Array,
  required: true
 },
 timeStamp: {
  type: Number,
  default: Date.now()
 }
});

const accountEntrySchema = new mongoose.Schema({
 accountUUID: {
  type: String,
  match: core.coreRegExs().accountUUIDValidation,
  required: true
 },
 entryDescription: {
  type: String,
  max: 255
 },
 entryType: {
  type: String,
  match: core.coreRegExs().entryTypeValidation,
  required: true,
  max: 255
 },
 balance: {
  type: Number,
  required: true
 },
 entryUUID: {
  type: String,
  default: `E-${core.uuidv4()}_${Date.now()}`
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
  default: `U-${core.uuidv4()}_${Date.now()}`,
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
