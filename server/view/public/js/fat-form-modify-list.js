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
   if (response.data.status != "success") {
    toastOptions['icon'] = 'success';
    toastOptions['title'] = 'Lists Loaded';
    Swal.fire(toastOptions)
   } else {
    Swal.fire({
     icon: 'warning',
     title: 'Missing Neceesary Lists',
     target: '#modifyListBody',
     allowEscapeKey: false,
     customClass: {
      container: 'position-absolute'
     },
     allowOutsideClick: false,
     showConfirmButton: false,
     html: `
      <div id="listsContainer">
       <div class="row" style="margin-bottom: 5px;">
        <div class="col-md-12">
         <span class="d-block" style="font-size: 13px;display: unset !important;">Primary Account Type:</span>
         <span class="d-block" style="font-size: 11px;display: unset !important;">(Change via CLI)</span>
        </div>
        <div class="col-md-12">
         <input style="width:100%" type="text" class="form-control-sm" value="asset,liability,expense,equity,revenue" disabled="true">
        </div>
       </div>
       <div class="row" style="margin-bottom: 5px;">
        <div class="col-md-12">
         <span class="d-block" style="font-size: 13px;display: unset !important;" id="accountTypeSecondaryTitle">Secondary Account Type:</span>
         <select id="accountTypeSecondary" class="js-example-tags col-sm-12" multiple="multiple"></select>
        </div>
       </div>
       <div class="row" style="margin-bottom: 5px;">
        <div class="col-md-12">
         <span class="d-block" style="font-size: 13px;display: unset !important;" id="institutionTitle">Institution:</span>
         <select id="institution" class="js-example-tags col-sm-12" multiple="multiple"></select>
        </div>
       </div>
       <div class="row" style="margin-bottom: 5px;">
        <div class="col-md-12">
         <span class="d-block" style="font-size: 13px;display: unset !important;" id="entryTypeTitle">Entry Type:</span>
         <select id="entryType" class="js-example-tags col-sm-12" multiple="multiple"></select>
        </div>
       </div>
       <div class="row" style="margin-top:25px">
        <div class="col-md" style="text-align:center;">
         <button type="button" class="btn btn-icon btn-rounded btn-outline-success" style="width: auto;height: 30px;padding: 3px 10px;cursor: pointer;" onclick="submitLists('listsContainer');"><i class="feather icon-check-circle"></i>&nbsp;Submit</button>
        </div>
       </div>
      </div>
     `
    });
    $(".js-example-tags").select2({tags: true});
   }
  })
})();

function generateListItemsHTML(arrayOfListObjs) {
 let targetDiv = document.getElementById('currentListsDiv');
 let targetDivHTML = '';
 function listItemTemplate (obj) {
  let html = `
   <div class="card-block border-bottom">
    <div class="row d-flex align-items-center">
     <div class="col-auto">
      <i class="feather icon-edit f-30 text-c-blue" style="cursor: pointer;"></i>
     </div>
     <div class="col">
      <h3 class="f-w-300">${obj.listNameLong}</h3>
      <span class="d-block">
       ${obj.list.toString()}
      </span>
     </div>
     <div class="col-auto">
      <i class="feather icon-trash-2 f-30 text-c-red" style="cursor: pointer;"></i>
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
 //This should be passed from the backend.
 arrayOfListsObjs.push({
  "listName":"accountTypePrimary",
  "listNameLong":"Primary Account Type",
  "list":["asset","liability","expense","equity","revenue"]
 });
 allDivSelectElements.forEach((e,i) => {
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
  arrayOfListsObjs.push(listObj);
 });
 console.log(arrayOfListsObjs);
 generateListItemsHTML(arrayOfListsObjs);
 Swal.close();
}

