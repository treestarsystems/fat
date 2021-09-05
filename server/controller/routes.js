//Destination: server/controller
const core = require('../core/core.js');

//API Endpoints
const add = require('./api/add');
const remove = require('./api/remove');
const get = require('./api/get');
const user = require('./api/user');

function apiEndpoint (app) {
 app.use('/api/add', add);
 app.use('/api/remove', remove);
 app.use('/api/get', get);
 app.use('/user', user);
}

function pagesEndpoint (app) {
 //Pages
// app.get('/', core.ensureAuthenticated, (req, res) => {
 app.get('/', (req, res) => {
  res.render('overview', {
   title: 'Overview',
   layout: 'admin',
   customJS: ["public/js/amchart/core.js","public/js/amchart/charts.js","public/js/amchart/themes/animated.js","public/js/fat-overview.js"]
  });
 });

 app.get('/modify-list', (req, res) => {
  res.render('form-modify-list', {title: 'Modify List', layout: 'admin', customJS: ["public/js/fat-form-modify-list.js"]});
 });

 app.get('/modify-account', (req, res) => {
  res.render('form-modify-account', {title: 'Modify Account', layout: 'admin', customJS: ["public/js/fat-form-modify-account.js"]});
 });

 app.get('/ie', (req, res) => {
  res.render('ie', {title: 'Incompatible Browser', layout: 'login', customJS: ["public/js/fat-user-accounts.js"]});
 });

/*
 app.get('/', (req, res) => {
  res.render('form-', {title: '', layout: 'admin'});
 });

 app.get('/', (req, res) => {
  res.render('form-', {title: '', layout: 'admin'});
 });
*/

 //User Pages
 app.get('/login', core.forwardAuthenticated, (req, res) => {
  res.render('user/login', {title: 'Login', layout: 'login', customJS: ["public/js/fat-user-accounts.js"]});
 });
 app.get('/register', (req, res) => {
  res.render('user/register', {title: 'Register', layout: 'login', customJS: ["public/js/fat-user-accounts.js"]});
 });
 app.get('/logout', (req,res) => {
  req.logout();
  res.redirect('/login');
 });
/*
 app.get('/profile', (req, res) => {
  res.render('user/profile', {title: 'Profile', layout: 'login'});
 });
 app.get('/password-reset', (req, res) => {
  res.render('user/password-reset', {title: 'Password Reset', layout: 'login'});
 });
*/
}

module.exports = {
 apiEndpoint,
 pagesEndpoint
}
