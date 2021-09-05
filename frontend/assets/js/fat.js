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

showActiveNavigation();

