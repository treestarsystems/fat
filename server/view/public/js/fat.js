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

function popupErrorHandler (error,targetDiv) {
 let errorMessage = ((error.message) ? error.message:error);
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
  return error;
 } catch (e) {
  return defaultErrorHandler(e);
 } finally {}
}

function defaultErrorHandler (error) {
 let returnObj = {"status": "","message": "","payload": ""};
 //This is done just incase you use the "throw" keyword to produce your own error.
 let errorMessage = ((error.message) ? error.message:error);
 returnObj.status = "failure";
 returnObj.message = `Function: ${arguments.callee.caller.name} - Error: ${errorMessage}`;
 returnObj.payload = error;
 console.error(returnObj);
 return returnObj;
}

//Source: https://attacomsian.com/blog/javascript-check-variable-is-object
function isObject (obj) {
 if (Object.prototype.toString.call(obj) !== '[object Object]') return false;
 return true;
}

//Source: https://attacomsian.com/blog/check-if-javascript-object-is-empty
function isNonEmptyObject (obj) {
 if (isObject(obj) == false) return false;
 if (Object.keys(obj).length === 0) return false;
 return true;
}

//Source: https://stackoverflow.com/a/9436948
function isString (str) {
 if (typeof str === 'string' || str instanceof String) return true;
 return false;
}

//Source: https://stackoverflow.com/a/20956445
function isNonEmptyArray (arr) {
 if (!Array.isArray(arr)) return false;
 if (arr.length == 0) return false;
 return true;
}

function defaultToastNotification (options) {
 try {
  let defaultToastOptions = {
   toast: true,
   icon: (options.icon ? options.icon:'info'),
   title: (options.title ? options.title:'No Message Set'),
   position: 'top-end',
   showConfirmButton: false,
   timer: (options.timer ? options.timer:1000),
   timerProgressBar: (options.timerProgressBar ? options.timerProgressBar:true),
   didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
   }
  }
  Swal.fire(defaultToastOptions);
 } catch (e) {
  defaultErrorHandler(e);
 } finally {}
}

showActiveNavigation();

