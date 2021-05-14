//Validation Schema for input fields.
const core = require('../core/core.js');
const joi = require('joi');

const accountValidation = joi.object({
 accountName: joi.string()
  .alphanum()
  .min(3)
  .max(255)
  .label('Account Name')
  .required(),
 accountType: joi.string()
  .label('Account Type')
  .pattern(core.coreRegExs.accountTypeValidaton)
  .message("\"Account Type\" selection is invalid")
  .required(),
 brokerage: joi.string()
  .label('Brokerage')
  .pattern(core.coreRegExs.brokerageValidaton)
  .message("\"Brokerage\" selection is invalid")
  .required()
});

const accountEntryValidation = joi.object({
 accountUUID: joi.string()
  .label('Account UUID')
  .required(),
 entryDescription: joi.string()
  .label('Description')
  .max(255)
  .message("\"Description\" must be less than 255 characters"),
 entryType: joi.string()
  .label('Entry Type')
  .pattern(core.coreRegExs.entryTypeValidaton)
  .message("\"Entry Type\" is invalid")
  .required(),
 balance: joi.number()
  .label('Balance')
  .positive()
  .required(),
});

const registerValidation = joi.object({
 username: joi.string()
  .alphanum()
  .min(6)
  .label('Username')
  .required(),
 fullname: joi.string()
  .min(6)
  .label('Full name')
  .required(),
 email: joi.string()
  .required(6)
  .label('Email')
  .email(),
 accessLevel: joi.string()
  .required(6)
  .label('Access Level')
  .pattern(core.coreRegExs.accessLevelValidaton)
  .message("\"Access Level\" selection is invalid"),
 password: joi.string()
  .min(6)
  .label('Passowrd')
  .required(),
 passwordRepeat: joi.string()
  .min(6)
  .label('Repeated Passowrd')
  .required(),
 registrationKey: joi.string()
  .label('Registration Key')
  .required()
})

const loginValidation = joi.object({
 username: joi.string()
  .min(6)
  .label('Username')
  .required(),
 password: joi.string()
  .min(6)
  .label('Password')
  .required(),
});

module.exports = {
 accountValidation,
 accountEntryValidation,
 registerValidation,
 loginValidation
}
