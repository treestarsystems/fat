var pageSpecificTargetDiv = 'modifyAccountBody';

(() => {
 awaitResponse(pageSpecificTargetDiv);
 let toastOptions = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
   toast.addEventListener('mouseenter', Swal.stopTimer)
   toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
 }

 //Fetch list data from API endpoint
 axios({
  method: 'get',
  url: 'api/get/account/all',
 })
  .then((response) => {
   if (response.data.status == 'failure') {
    defaultErrorHandler(response.data.message);
    addAccountPrompt();
   }
   if (response.data.status == 'success') {
    if (response.data.totalRecords != 0) {
     toastOptions['icon'] = 'success';
     toastOptions['title'] = 'Accounts Loaded';
     Swal.fire(toastOptions)
     generateAccountItemsHTML(response.data.payload);
    } else {
//This function does not exist. May need to be replaced with
//     addAccountPrompt();
     accountEntryPrompt(response.data);
    }
   }
  })
  .catch((e) => {
   return popupErrorHandler(defaultErrorHandler(e),pageSpecificTargetDiv);
  });
})();

function refreshAccountList () {
 //Refresh list
 axios({
  method: 'get',
  url: 'api/get/account/all',
 })
  .then((response) => {
   if (response.data.status == 'failure') {
    defaultErrorHandler(response.data.message);
    addAccountPrompt();
   }
   if (response.data.status == 'success') {
    if (response.data.totalRecords != 0) {
     generateAccountItemsHTML(response.data.payload);
    } else {
     addAccountPrompt();
    }
   }
  })
  .catch((e) => {
   popupErrorHandler(defaultErrorHandler(e),pageSpecificTargetDiv);
  });
}

//obj is received from server
async function generateEditAccountEntryPrompt (obj) {
 let returnObj = {"status": "","message": "","payload": ""};
 try {
  let containerID = 'accountItemContainer';
  let lists = await axios({
   method: 'get',
   url: 'api/get/list/all',
  })
   .then((response) => {
    return response.data;
   });
  //Takes single list object;
  function generateOptions (obj,listName,accountObj) {
   let options = '';
   for (let i = 0; i < obj.length; i++) {
    if (listName == obj[i].listName) {
     let sortedList = obj[i].list.sort();
     for (let o = 0; o < sortedList.length; o++) {
      if (accountObj[listName] == sortedList[o]) {
       options += `<option value="${sortedList[o]}" selected>${sortedList[o].toUpperCase()}</option>`;
      } else {
       options += `<option value="${sortedList[o]}">${sortedList[o].toUpperCase()}</option>`;
      }
     }
    }
   }
   return options;
  }
  let html = `<div id="accountItemContainer">`;
  let payload = obj.payload;
  for (let i = 0; i < payload.length; i++) {
   let options;
   for (let key in payload[i]) {
    if (!key.match(/accountUUID|accountTypePrimary|accountTypeSecondary|institution|timeStamp/g)) {
     html += `
      <div class="row" style="margin-bottom: 5px;">
       <div class="col-md-12">
        <span class="d-block" style="font-size: 13px;display: unset !important;">${key.replace('account','')}:</span>
        <input type="text" class="form-control" value="${payload[i][key]}" id="${key}">
       </div>
      </div>
     `;
    } else if (key.match(/institution|accountTypePrimary|accountTypeSecondary/g)){
     html += `
      <div class="row" style="margin-bottom: 5px;">
       <div class="col-md-12">
        <span class="d-block" style="font-size: 13px;display: unset !important;">${capitalizeFirstCharacter(key.replace('accountType','Account Type '))}:</span>
        <select class="custom-select" id="${key}">
         ${generateOptions(lists.payload,key,obj.payload[0])}
        </select>
       </div>
      </div>
     `;
    }
   }
   html += `
    <div class="row" style="margin-top:25px">
     <div class="col-md" style="text-align:center;">
      <button type="button" class="btn btn-icon btn-rounded btn-outline-success" style="width: auto;height: 30px;padding: 3px 10px;cursor: pointer;" onclick="submitAccounts('${containerID}','edit','${payload[i].accountUUID}');"><i class="feather icon-check-circle"></i>&nbsp;Submit</button>
      <button type="button" class="btn btn-icon btn-rounded btn-outline-danger" style="width: auto;height: 30px;padding: 3px 10px;cursor: pointer;" onclick="Swal.close();"><i class="feather icon-x-circle"></i>&nbsp;Cancel</button>
     </div>
    </div>
   </div>`;
  }
  returnObj.status = "success";
  returnObj.message = "success message";
  returnObj.payload = html;
  return returnObj;
 } catch (e) {
  return popupErrorHandler(defaultErrorHandler(e),pageSpecificTargetDiv);
  return defaultErrorHandler(e);
 } finally {}
}

//Object received from server
async function generateAddAccountPrompt () {
 let returnObj = {"status": "success","message": "success","payload": ""};
 try {
  let containerID = 'accountItemContainer';
  let lists = await axios({
   method: 'get',
   url: 'api/get/list/all',
  })
   .then((response) => {
    return response.data;
   })
   .catch((e) => popupErrorHandler(defaultErrorHandler(e),pageSpecificTargetDiv));

  //Takes an array of lists;
  function generateOptions (arr,listName) {
   if (!isNonEmptyArray(arr)) throw 'Invalid Array';
   if (!isString(listName)) throw 'Invalid String';
   let options = '';
   for (let i = 0; i < arr.length; i++) {
    if (listName == arr[i].listName) {
     let sortedList = arr[i].list.sort();
     for (let o = 0; o < sortedList.length; o++) {
      options += `<option value="${sortedList[o]}">${sortedList[o].toUpperCase()}</option>`;
     }
    }
   }
   return options;
  }
  let inputFields = ['accountName','accountDescription'];
  let sortedLists = (() => {
   if (lists.payload.length >= 1) {
    return lists.payload.sort();
   } else {
    return [];
   }
  })();
  let html = `<div id="${containerID}">`;
  await inputFields.forEach((e,i) => {
   html += `
    <div class="row" style="margin-bottom: 5px;">
     <div class="col-md-12">
      <span class="d-block" style="font-size: 13px;display: unset !important;">${e.replace('account','')}:</span>
      <input type="text" class="form-control" id="${e}">
     </div>
    </div>
   `;
  });
  if (sortedLists.length == 0) {
   throw 'Empty List Payload';
  } else {
   await sortedLists.forEach((e,i) => {
    if (e.listName.match(/institution|accountTypePrimary|accountTypeSecondary/g)){
     html += `
      <div class="row" style="margin-bottom: 5px;">
       <div class="col-md-12">
        <span class="d-block" style="font-size: 13px;display: unset !important;">${capitalizeFirstCharacter(e.listName.replace('accountType','Account Type '))}:</span>
        <select class="custom-select" id="${e.listName}">
         ${generateOptions(sortedLists,e.listName)}
        </select>
       </div>
      </div>
     `;
    }
   });
  }
  html += `
    <div class="row" style="margin-top:25px">
     <div class="col-md" style="text-align:center;">
      <button type="button" class="btn btn-icon btn-rounded btn-outline-success" style="width: auto;height: 30px;padding: 3px 10px;cursor: pointer;" onclick="submitAccounts('${containerID}','add');"><i class="feather icon-check-circle"></i>&nbsp;Submit</button>
      <button type="button" class="btn btn-icon btn-rounded btn-outline-danger" style="width: auto;height: 30px;padding: 3px 10px;cursor: pointer;" onclick="Swal.close();"><i class="feather icon-x-circle"></i>&nbsp;Cancel</button>
     </div>
    </div>
   </div>`;
  returnObj.payload = html;
  return returnObj;
 } catch (e) {
  return defaultErrorHandler(e);
 } finally {}
}

async function editAccountPrompt (responseObj,accountUUID) {
 let returnObj = {"status": "","message": "","payload": ""};
 try {
  let result = await generateEditAccountEntryPrompt(responseObj);
  if (result.status == 'failure') {
   Swal.fire({
    icon: 'error',
    title: 'Error Generating Prompt',
    target: `#${pageSpecificTargetDiv}`,
    allowEscapeKey: true,
    customClass: {
      container: 'position-absolute lowerzindex'
    },
    allowOutsideClick: true,
    showConfirmButton: false,
    html: `Error: ${result.message}`
   });
  }
  if (result.status == 'success') {
   Swal.fire({
    icon: 'info',
    title: 'Edit Account',
    target: `#${pageSpecificTargetDiv}`,
    allowEscapeKey: true,
    customClass: {
      container: 'position-absolute lowerzindex'
    },
    allowOutsideClick: true,
    showConfirmButton: false,
    html: result.payload
   });
  }
  returnObj.status = "success";
  returnObj.message = "success message";
  returnObj.payload = "";
  return returnObj;
 } catch (e) {
  return popupErrorHandler(defaultErrorHandler(e),pageSpecificTargetDiv);
 } finally {}
}

async function addAccountPrompt () {
 let returnObj = {"status": "","message": "","payload": ""};
 try {
  let result = await generateAddAccountPrompt();
  if (result.status == 'failure') {
   Swal.fire({
    icon: 'error',
    title: 'Error Generating Prompt',
    target: `#${pageSpecificTargetDiv}`,
    allowEscapeKey: true,
    customClass: {
      container: 'position-absolute lowerzindex'
    },
    allowOutsideClick: true,
    showConfirmButton: false,
    html: `Error: ${result.message}`
   });
  }
  if (result.status == 'success') {
   Swal.fire({
    icon: 'info',
    title: 'Add Account',
    target: `#${pageSpecificTargetDiv}`,
    allowEscapeKey: true,
    customClass: {
     container: 'position-absolute lowerzindex'
    },
    allowOutsideClick: true,
    showConfirmButton: false,
    html: result.payload
   });
  }
 } catch (e) {
  return popupErrorHandler(defaultErrorHandler(e),pageSpecificTargetDiv);
 } finally {}
}

function generateAccountItemsHTML (arrayOfAccountObjs) {
console.log(arrayOfAccountObjs)
 let returnObj = {"status": "","message": "","payload": ""};
 try {
  if (!isNonEmptyArray(arrayOfAccountObjs)) throw 'Invalid Array';
  let pageSpecificTargetDiv = document.getElementById('currentAccountsDiv');
  let pageSpecificTargetDivHTML = '';

//.... Continue from here adding error checks

  function accountItemTemplate (obj) {
   if (!isNonEmptyObject(obj)) throw 'Invalid Object';
   let objString = JSON.stringify(obj);
   let html = `
    <div class="card-block border-bottom">
     <div class="row d-flex align-items-center">
      <div class="col">
       <h3 id="name_${obj.accountUUID}" class="f-w-300">${obj.accountName}</h3>
       <span id="type_primary_${obj.accountUUID}" class="d-block">Primary Type: ${obj.accountTypePrimary.toUpperCase()}</span>
       <span id="type_secondary_${obj.accountUUID}" class="d-block">Secondary Type: ${obj.accountTypeSecondary.toUpperCase()}</span>
       <span id="institution_${obj.accountUUID}" class="d-block">Institution: ${obj.institution.toUpperCase()}</span>
       <span id="description_${obj.accountUUID}" class="d-block">Description: ${obj.accountDescription}</span>
      </div>
      <div class="col-auto">
       <i class="feather icon-edit f-30 text-c-blue" style="cursor: pointer;" onclick="editAccountItem('${obj.accountUUID}');"></i>
        &nbsp;
        &nbsp;
       <i class="feather icon-trash-2 f-30 text-c-red" style="cursor: pointer;"onclick="deleteAccountItem('${obj.accountUUID}')"></i>
      </div>
      </div>
    </div>
   `;
   return html;
  }
  for (let i = 0; i < arrayOfAccountObjs.length; i++) {
   pageSpecificTargetDivHTML += accountItemTemplate(arrayOfAccountObjs[i]);
  }
  pageSpecificTargetDiv.innerHTML = pageSpecificTargetDivHTML;
  returnObj.status = "success";
  returnObj.message = "success message";
  returnObj.payload = pageSpecificTargetDivHTML;
  return returnObj;
 } catch (e) {
  return popupErrorHandler(defaultErrorHandler(e),pageSpecificTargetDiv);
 } finally {}
}

async function submitAccounts(containerDivID,type,accountUUID) {
 let returnObj = {"status": "","message": "","payload": ""};
 try {
  let containerID = 'accountItemContainer';
  let containingDiv = document.getElementById(containerDivID);
  let fields = Array.from(containingDiv.querySelectorAll('input , select'));
  let submissionObj = (async () => {
   let resultObj = {}
   await fields.forEach((e,i) => {
    if (e.value == "") throw 'Please Fill In All Fields'
    resultObj[e.id] = e.value;
   });
   if (type == 'edit') resultObj['accountUUID'] = accountUUID;
   return resultObj;
  });
  returnObj.status = "success";
  returnObj.message = "success message";
  returnObj.payload = await submissionObj();
  if (type == 'add') {
   axios({
    method: 'post',
    url: 'api/add/account',
    data: returnObj.payload
   })
    .then((response) => {
     let toastOptions = {
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
       toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
     }
     if (response.data.status == 'failure') {
      toastOptions['icon'] = 'error';
      toastOptions['title'] = response.data.message;
      Swal.fire(toastOptions);
     }
     if (response.data.status == 'success') {
      toastOptions['icon'] = 'success';
      toastOptions['title'] = response.data.message;
      Swal.fire(toastOptions);
      refreshAccountList();
     }
    })
    .catch((e) => {
     popupErrorHandler(defaultErrorHandler(e),pageSpecificTargetDiv);
    });
  }
//An API endpoint needs to be added for this functionality.
  if (type == 'edit') {
console.log(returnObj.payload)
   axios({
    method: 'put',
    url: 'api/edit/account',
    data: returnObj.payload
   })
    .then((response) => {
     let toastOptions = {
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
       toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
     }
     if (response.data.status == 'failure') {
      toastOptions['icon'] = 'error';
      toastOptions['title'] = response.data.message;
      Swal.fire(toastOptions);
     }
     if (response.data.status == 'success') {
      toastOptions['icon'] = 'success';
      toastOptions['title'] = response.data.message;
      Swal.fire(toastOptions);
      refreshAccountList();
     }
    })
    .catch((e) => {
     popupErrorHandler(defaultErrorHandler(e),pageSpecificTargetDiv);
    });
  }
  return returnObj;
 } catch (e) {
  return popupErrorHandler(defaultErrorHandler(e),pageSpecificTargetDiv);
 } finally {}
/*
 let allDivSelectElements = containingDiv.querySelectorAll('select');
 let arrayOfAccountsObjs = [];
 let validationCheck = {
  "status":true,
  "listName":[]
 }
 allDivSelectElements.forEach((e,i) => {
  let targetElement = document.getElementById(`${e.id}Title`);
  targetElement.style.color = "#545454";
  let listObj = {
   "listName":"",
   "listNameLong":"",
   "list":[]
  };
  listObj.listName = e.id;
  listObj.listNameLong = document.getElementById(`${e.id}Title`).innerHTML.replace(':','');
  for (let oi = 0; oi < e.options.length; oi++) {
   listObj.list.push(e.options[oi].value);
  }
  if (listObj.list.length == 0) {
   validationCheck.status = false;
   validationCheck.listName.push(`${e.id}Title`)
  }
  arrayOfAccountsObjs.push(listObj);
 });
 if (validationCheck.status) {
  generateAccountItemsHTML(arrayOfAccountsObjs);
  Swal.close();
 } else {
  validationCheck.listName.forEach((e,i) => {
   let targetElement = document.getElementById(e);
   targetElement.style.color = "red";
  });
 }
 console.log(arrayOfAccountsObjs);
 axios({
  method: 'post',
  url: 'api/add/list',
  data: arrayOfAccountsObjs
 })
  .then((response) => {
   console.log(response)
  });
*/
}

function editAccountItem (accountUUID) {
 //Fetch list data from API endpoint
 axios({
  method: 'get',
  url: `api/get/account/uuid/${accountUUID}`,
 })
  .then(async (response) => {
   if (response.data.status == "failure") {
    popupErrorHandler(defaultErrorHandler(response.data.message),pageSpecificTargetDiv);
   }
   if (response.data.status == "success") {
    await editAccountPrompt(response.data,accountUUID);
   }
  })
  .catch((e) => {
   popupErrorHandler(defaultErrorHandler(e),pageSpecificTargetDiv);
  });
}

async function deleteAccountItem (accountUUID) {
 let responseObj = {"status":"success","message":"success","payload":""}
 try {
  //Fetch list data from API endpoint
 let deleteResponse = await axios({
   method: 'delete',
   url: `api/remove/account/uuid/${accountUUID}`,
  })
   .then(async (response) => {
    if (response.data.status == "success") {
     defaultToastNotification({title:`${response.data.message}`,icon:'success'});
     setTimeout(() => {},2000);
     refreshAccountList();
    }
    if (response.data.status == "failure") {
     defaultToastNotification({title:`${response.data.message}`,icon:'error',timer:2000});
     throw response.data.message;
    }
   });
 } catch (e) {
  defaultErrorHandler(e);
 } finally {}
}

