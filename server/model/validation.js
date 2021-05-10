//Validation Schema for input fields.
const joi = require('joi');

const accountEntryValidation = joi.object({
 accountName: joi.string()
  .alphanum()
  .min(3)
  .max(255)
  .label('Account Name')
  .required(),
 accountType: joi.string()
  .label('Account Type')
  .pattern(/^retirement$|^generalInvesting$|^crypto$|^debt$|^checking$|^saving$|^creditScore$/)
  .message("\"Account Type\" selection is invalid")
  .required(),
 brokerage: joi.string()
  .label('Brokerage')
  .pattern(/^m1finance$|^coinbase$|^massmutual$/)
  .message("\"Brokerage\" selection is invalid")
  .required(),
 balance: joi.number()
  .label('Balance')
  .required(),
})

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
  .pattern(/member|admin/)
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
 accountEntryValidation,
 registerValidation,
 loginValidation
}
