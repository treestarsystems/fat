//Validation Schema for input fields.
const core = require('../core/core.js');
const joi = require('joi');

const accountValidationEdit = joi.object({
 accountName: joi.string()
  .alphanum()
  .min(3)
  .max(255)
  .label('Account Name')
  .required(),
 accountDescription: joi.string()
  .label('Account Description'),
 accountTypePrimary: joi.string()
  .label('Account Type Primary')
  .required(),
 accountTypeSecondary: joi.string()
  .label('Account Type Secondary')
  .required(),
 institution: joi.string()
  .label('Institution')
  .required(),
 accountUUID: joi.string()
  .label('AccountUUID')
  .required()
});

const accountValidation = joi.object({
 accountName: joi.string()
  .alphanum()
  .min(3)
  .max(255)
  .label('Account Name')
  .required(),
 accountDescription: joi.string()
  .label('Account Description'),
 accountTypePrimary: joi.string()
  .label('Account Type Primary')
  .required(),
 accountTypeSecondary: joi.string()
  .label('Account Type Secondary')
  .required(),
 institution: joi.string()
  .label('Institution')
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
  .required(),
 value: joi.number()
  .label('Value')
  .min(0),
});

const listEntryValidation = joi.object({
 list: joi.array()
  .label('List')
  .required(),
 listName: joi.string().label('List Name')
  .max(255)
  .message("\"List Name\" must be less than 255 characters")
  .required(),
 listNameLong: joi.string()
  .label('List Name Long')
  .max(255)
  .message("\"List Name Long\" must be less than 255 characters")
  .required()
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
  .label('Access Level'),
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
 accountValidationEdit,
 accountEntryValidation,
 listEntryValidation,
 registerValidation,
 loginValidation
}
