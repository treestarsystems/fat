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
   if (response.data.status == 'faulire') {
    throw response.data.message;
   }
   if (response.data.status == 'success1') {
    if (response.data.totalRecords != 0) {
     toastOptions['icon'] = 'success';
     toastOptions['title'] = 'Accounts Loaded';
     Swal.fire(toastOptions)
     generateAccountItemsHTML(response.data.payload);
    } else {
     accountEntryPrompt(response.data);
    }
   }
  })
  .catch((e) => {
   catchErrorMessagePopUp(e,pageSpecificTargetDiv);
  });
})();

//Object received from server
async function generateAccountEntryPrompt (obj) {
 let lists = await axios({
  method: 'get',
  url: 'api/get/list/all',
 })
  .then((response) => {
   return response.data;
  });
 //Takes single list object;
 function generateOptions (obj,listName) {
  let options = '';
  for (let i = 0; i < obj.length; i++) {
   if (listName == obj[i].listName) {
    let sortedList = obj[i].list.sort();
    for (let o = 0; o < sortedList.length; o++) {
     options += `<option value="${sortedList[o]}">${sortedList[o].toUpperCase()}</option>`;
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
       <input type="text" class="form-control" value="${payload[i][key]}">
      </div>
     </div>
    `;
   } else if (key.match(/institution|accountTypePrimary|accountTypeSecondary/g)){
    html += `
     <div class="row" style="margin-bottom: 5px;">
      <div class="col-md-12">
       <span class="d-block" style="font-size: 13px;display: unset !important;">${capitalizeFirstCharacter(key.replace('accountType','Account Type '))}:</span>
       <select class="custom-select">
        ${generateOptions(lists.payload,key)}
       </select>
      </div>
     </div>
    `;
   }
  }
 }
 html += `
   <div class="row" style="margin-top:25px">
    <div class="col-md" style="text-align:center;">
     <button type="button" class="btn btn-icon btn-rounded btn-outline-success" style="width: auto;height: 30px;padding: 3px 10px;cursor: pointer;" onclick="submitAccounts();"><i class="feather icon-check-circle"></i>&nbsp;Submit</button>
     <button type="button" class="btn btn-icon btn-rounded btn-outline-danger" style="width: auto;height: 30px;padding: 3px 10px;cursor: pointer;" onclick="Swal.close();"><i class="feather icon-x-circle"></i>&nbsp;Cancel</button>
    </div>
   </div>
  </div>`;
 return html;
}

/*
function listEntryPrompt (responseObj) {
 Swal.fire({
  icon: 'warning',
  title: 'Missing Neceesary Accounts',
  target: pageSpecificTargetDiv,
  allowEscapeKey: false,
  customClass: {
   container: 'position-absolute lowerzindex'
  },
  allowOutsideClick: false,
  showConfirmButton: false,
  html: '' //generateAccountEntryPrompt(responseObj)
 });
 $(".js-example-tags").select2({tags: true,tokenSeparators: [',', ' ']});
 //On unselect event. Remove item from select dropdown
 $(".js-example-tags").on('select2:unselect',(e)=> {
  let select = document.getElementById(e.target.id);
  select.remove(e.params.data.element.index);
 });
}
*/

async function editAccountPrompt (responseObj) {
 Swal.fire({
  icon: 'info',
  title: 'Edit Accounts',
  target: pageSpecificTargetDiv,
  allowEscapeKey: true,
  customClass: {
   container: 'position-absolute lowerzindex'
  },
  allowOutsideClick: true,
  showConfirmButton: false,
  html: await generateAccountEntryPrompt(responseObj).then((html) => {return html})
 });
}

function generateAccountItemsHTML(arrayOfAccountObjs) {
 let pageSpecificTargetDiv = document.getElementById('currentAccountsDiv');
 let pageSpecificTargetDivHTML = '';
 function accountItemTemplate (obj) {
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
}

function submitAccounts(containerDivID) {
 let containingDiv = document.getElementById(containerDivID);
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
}

function editAccountItem (accountUUID) {
 //Fetch list data from API endpoint
 axios({
  method: 'get',
  url: `api/get/account/uuid/${accountUUID}`,
 })
  .then(async (response) => {
   if (response.data.status == "success") {
    await editAccountPrompt(response.data);
   }
  })
}
