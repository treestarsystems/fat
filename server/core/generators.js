//List generated from DB and passed to this function.
async function generateListObj (listObjFromDB) {
 try {
//  throw 'test';
  let listObj = {};
  for (let i = 0; i < listObjFromDB.length; i++) {
   listObj[listObjFromDB[i].listName] = listObjFromDB[i].list;
  }
//console.log(listObj);
  let returnObj = {
   rawList: listObj,
   validationRegExs: createValidationRegExs(listObj),
   coreRegExs: coreRegExs(listObj)
  };
  return returnObj;
 } catch (e) {
  console.log(`There is an issue retrieving lists in core.js: ${e}`);
  //If error. Return the bare minimum list so user can be prompted.
  let emptyList = {
   accountTypePrimary: ["asset","liability","expense","equity","revenue"],
   accessLevelList: ["member","admin"],
   accountTypeSecondary: [''],
   institution: [''],
   entryType: ['']
  };
  let returnObj = {
   rawList: emptyList,
   validationRegExs: createValidationRegExs(emptyList),
   coreRegExs: coreRegExs(emptyList)
  };
  return returnObj;
 }
}

function createValidationRegExs (listObj) {
 let validationObj = {};
 let arrayOfLists = [];
 for (let key in listObj) {
  //Remoe the accessLevelList and others if needed in the future.
  if (!key.match(/accessLevelList/g)) arrayOfLists.push(key.replace('List',''));
  let result = '';
  for (let i = 0; i < listObj[key].length; i++) {
   result += `^${listObj[key][i]}$`;
   if (listObj[key].length-1 != i) result += '|';
   if (listObj[key].length-1 == i) {
    validationObj[`${key.replace('List','Validation')}`] = RegExp(result);
   }
  }
  validationObj['fatRequiredLists'] = arrayOfLists;
 }
 return validationObj;
}

function coreRegExs (listObj) {
 let obj = {};
 let validationRegExs = createValidationRegExs(listObj);
 for (let key in validationRegExs) {
  obj[key] = validationRegExs[key];
 }
 return obj;
};

module.exports = {
 generateListObj,
 createValidationRegExs,
 coreRegExs
}
