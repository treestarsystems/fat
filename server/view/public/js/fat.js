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
