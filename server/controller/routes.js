//Destination: server/controller

//API Endpoints
const coinbase = require('./api/coinbase');
const m1finance = require('./api/m1finance');
const add = require('./api/add');
const remove = require('./api/remove');
const get = require('./api/get');
const user = require('./api/user');

function apiEndpoint (app) {
 app.use('/api/coinbase', coinbase);
 app.use('/api/m1finance', m1finance);
 app.use('/api/add', add);
 app.use('/api/remove', remove);
 app.use('/api/get', get);
 app.use('/user', user);
}

function pagesEndpoint (app) {
 //Pages

/*
 //User Pages
 app.get('/login', core.forwardAuthenticated, (req, res) => {
  res.render('user/login', {title: 'Login', layout: 'login'});
 });
 app.get('/register', (req, res) => {
  res.render('user/register', {title: 'Register', layout: 'login'});
 });
 app.get('/profile', (req, res) => {
  res.render('user/profile', {title: 'Profile', layout: 'login'});
 });
 app.get('/password-reset', (req, res) => {
  res.render('user/password-reset', {title: 'Password Reset', layout: 'login'});
 });
 app.get('/logout', (req,res) => {
  req.logout();
  res.redirect('/login');
 });
*/
}

module.exports = {
 apiEndpoint,
 pagesEndpoint
}
