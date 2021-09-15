var pathName = window.location.pathname;
var basePathArray = pathName.split('/');
var currentYear = new Date().getFullYear();
var userPagesRegExp = new RegExp (/\/login|\/register/g);

function awaitResponse (targetDivID) {
 let options = {
  html: '<p style="color:white;font-size:x-large;text-shadow: -2px 0 gray, 0 2px gray, 2px 0 gray, 0 -2px gray;">Awaiting Response...&#9203;</p>',
  inputAttributes: {
   autocapitalize: 'off'
  },
  background: 'transparent',
  allowOutsideClick: false,
  showConfirmButton: false,
  didOpen: () => {
   Swal.showLoading();
  },
 }
 if (targetDivID) {
  options['target'] = `#${targetDivID}`;
  options['customClass'] = {container: 'position-absolute'};
 }
 Swal.fire(options);
}

//Show active pages menu
function showActiveNavigation () {
 let menuElement = document.querySelector(`.navbar-content a[href='${pathName}']`);
 menuElement.parentNode.classList.add('active');
 menuElement.parentNode.parentNode.style.display = 'block';
 menuElement.parentNode.parentNode.parentNode.classList.add('pcoded-trigger');
}

async function getListAll () {
 return axios({
  method: 'get',
  url: 'api/get/list/alls',
 })
  .then((response) => {
   let result = [0, response.data];
   return result;
  })
  .catch((e) => {
   let result = [1, 'Error Retrieving Accounts'];
   return result;
  });
}

//Source: https://attacomsian.com/blog/string-capitalize-javascript
function capitalizeFirstCharacter (str) {
 if(typeof str === 'string') {
  return str.replace(/^\w/, c => c.toUpperCase());
 } else {
  return '';
 }
};

function popupErrorHandler (errorString,targetDiv) {
 let errorMessage = ((errorString.message) ? errorString.message:errorString);
 try {
  Swal.fire({
   icon: 'error',
   title: 'Error: Check Console',
   target: (targetDiv ? `#${targetDiv}`:'body'),
   allowEscapeKey: true,
   allowOutsideClick: true,
   showConfirmButton: false,
   customClass: {
    container: 'position-absolute'
   },
   html: `${errorMessage}<br><br><button type="button" class="btn btn-icon btn-rounded btn-outline-danger" style="width: auto;height: 30px;padding: 3px 10px;cursor: pointer;" onclick="Swal.close();"><i class="feather icon-x-circle"></i>&nbsp;Close</button>`,
  });
 } catch (e) {
  return defaultErrorHandler(e);
 }
}

function defaultErrorHandler (errorString) {
 let returnObj = {"status": "","message": "","payload": ""};
 //This is done just incase you use the "throw" keyword to produce your own error.
 let errorMessage = ((errorString.message) ? errorString.message:errorString);
 returnObj.status = "failure";
 returnObj.message = `Function: ${arguments.callee.caller.name} - Error: ${errorMessage}`;
 returnObj.payload = errorString;
 console.error(returnObj);
 return returnObj;
}

showActiveNavigation();

