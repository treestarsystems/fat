/*
*/

(() => {
 awaitResponse('modifyListBody');
 let toastOptions = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
   toast.addEventListener('mouseenter', Swal.stopTimer)
   toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
 }

 //Fetch list data from API endpoint
 axios({
  method: 'get',
  url: 'api/get/list/all',
 })
  .then((response) => {
   if (response.data.status == "success") {
    toastOptions['icon'] = 'success';
    toastOptions['title'] = 'Lists Loaded';
    Swal.fire(toastOptions)
    generateListItemsHTML(response.data.payload);
   } else {
    listEntryPrompt(response.data);
   }
  })
})();

//Object received from server
function generateListEntryPrompt (obj) {
 let html = `<div id="listsContainer">`;
 let payload = obj.payload;
 for (let i = 0; i < payload.length; i++) {
  let options;
  for (let il = 0; il < payload[i].list.length; il++) {
   options += `<option selected="selected">${payload[i].list[il]}</option>`;
  }
  html += `
   <div class="row" style="margin-bottom: 5px;">
    <div class="col-md-12">
     <span class="d-block" style="font-size: 13px;display: unset !important;" id="${payload[i].listName}Title">${payload[i].listNameLong}:</span>
     <select id="${payload[i].listName}" class="js-example-tags col-sm-12" multiple="multiple" ${(payload[i].listName.match(/accessLevelList|accountTypePrimary/g) ? 'zdisabled':'')}>
      ${options}
     </select>
    </div>
   </div>
  `;
 }
if (obj.missingLists) {
 let missingLists = obj.missingLists;
 for (let i = 0; i < missingLists.length; i++) {
  let listNameLong = (() => {
   if (missingLists[i] == 'institution') return "Institutions";
   if (missingLists[i] == 'accountTypeSecondary') return "Secondary Account Types";
   if (missingLists[i] == 'entryType') return "Entry Types";
  })();
  html += `
   <div class="row" style="margin-bottom: 5px;">
    <div class="col-md-12">
     <span class="d-block" style="font-size: 13px;display: unset !important;" id="${missingLists[i]}Title">${listNameLong}:</span>
     <select id="${missingLists[i]}" class="js-example-tags col-sm-12" multiple="multiple" ${(missingLists[i].match(/accessLevelList|accountTypePrimary/g) ? 'zdisabled':'')}>
     </select>
    </div>
   </div>
  `;
 }
}
 html += `
   <div class="row" style="margin-top:25px">
    <div class="col-md" style="text-align:center;">
     <button type="button" class="btn btn-icon btn-rounded btn-outline-success" style="width: auto;height: 30px;padding: 3px 10px;cursor: pointer;" onclick="submitLists('listsContainer');"><i class="feather icon-check-circle"></i>&nbsp;Submit</button>
     <button type="button" class="btn btn-icon btn-rounded btn-outline-danger" style="width: auto;height: 30px;padding: 3px 10px;cursor: pointer;" onclick="Swal.close();"><i class="feather icon-x-circle"></i>&nbsp;Cancel</button>
    </div>
   </div>
  </div>`;
 return html;
}

function listEntryPrompt (responseObj) {
 Swal.fire({
  icon: 'warning',
  title: 'Missing Neceesary Lists',
  target: '#modifyListBody',
  allowEscapeKey: false,
  customClass: {
   container: 'position-absolute lowerzindex'
  },
  allowOutsideClick: false,
  showConfirmButton: false,
  html: generateListEntryPrompt(responseObj)
 });
 $(".js-example-tags").select2({tags: true,tokenSeparators: [',', ' ']});
 //On unselect event. Remove item from select dropdown
 $(".js-example-tags").on('select2:unselect',(e)=> {
  let select = document.getElementById(e.target.id);
  select.remove(e.params.data.element.index);
 });
}

function editListPrompt (responseObj) {
 Swal.fire({
  icon: 'info',
  title: 'Edit Lists',
  target: '#modifyListBody',
  allowEscapeKey: false,
  customClass: {
   container: 'position-absolute lowerzindex'
  },
  allowOutsideClick: false,
  showConfirmButton: false,
  html: generateListEntryPrompt(responseObj)
 });
 $(".js-example-tags").select2({tags: true,tokenSeparators: [',', ' ']});
 //On unselect event. Remove item from select dropdown
 $(".js-example-tags").on('select2:unselect',(e)=> {
  let select = document.getElementById(e.target.id);
  select.remove(e.params.data.element.index);
 });
}

function generateListItemsHTML(arrayOfListObjs) {
 let targetDiv = document.getElementById('currentListsDiv');
 let targetDivHTML = '';
 function listItemTemplate (obj) {
  let html = `
   <div class="card-block border-bottom">
    <div class="row d-flex align-items-center">
     <div class="col">
      <h3 class="f-w-300">${obj.listNameLong}</h3>
      <span class="d-block">
       ${obj.list.toString()}
      </span>
     </div>
    </div>
   </div>
  `;
  return html;
 }
 for (let i = 0; i < arrayOfListObjs.length; i++) {
  targetDivHTML += listItemTemplate(arrayOfListObjs[i]);
 }
 targetDiv.innerHTML = targetDivHTML;
}

function submitLists(containerDivID) {
 let containingDiv = document.getElementById(containerDivID);
 let allDivSelectElements = containingDiv.querySelectorAll('select');
 let arrayOfListsObjs = [];
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
  arrayOfListsObjs.push(listObj);
 });
 if (validationCheck.status) {
  generateListItemsHTML(arrayOfListsObjs);
  Swal.close();
 } else {
  validationCheck.listName.forEach((e,i) => {
   let targetElement = document.getElementById(e);
   targetElement.style.color = "red";
  });
 }
 console.log(arrayOfListsObjs);
 axios({
  method: 'post',
  url: 'api/add/list',
  data: arrayOfListsObjs
 })
  .then((response) => {
   console.log(response)
  });
}

function editList () {
 //Fetch list data from API endpoint
 axios({
  method: 'get',
  url: 'api/get/list/all',
 })
  .then((response) => {
   if (response.data.status == "success") {
    editListPrompt(response.data);
   }
  })
}
