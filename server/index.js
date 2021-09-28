const express = require('express');
const fs = require('fs');
const emoji = require('node-emoji');
const compression = require('compression');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const cors = require('cors');
const childProcess = require('child_process');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const mongoStore = require("connect-mongo")(session);
const app = express();
const core = require('./core/core.js');
const system = require('../system_confs/system_vars.json');
const jobs = require('./core/cronJobs.js').jobs;
const handlebarsHelperFunctions = require('./controller/handlebars/helpers.js');
const routes = require('./controller/routes.js');
const appSpecificCode = require('./app.js');

//Main connection to DB
mongoose.connect(
  core.coreVars.dbServer,
  {useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false}
 )
 .then(() => console.log(`${core.coreVars.projectName}|${process.env.pm_id}: App\'s MongoDB connection established!`))
 .catch((err) => console.log(err));

const sessionStore = new mongoStore({
 mongooseConnection: mongoose.connection,
 collection: core.coreVars.dbSessionsColleciton,
 ttl: 2 * 24 * 60 * 60,
 autoRemove: 'native'
});

//Global Middleware: Must be defined before routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());

//Express session middleware
app.use(
 session({
  secret: system.tokenSecret,
  cookie: {
   maxAge: 172800000, //Two days
  },
  resave: false,
  saveUninitialized: true,
  store: sessionStore
 })
);

// Serve secure cookies, requires HTTPS
//if (process.env.NODE_ENV === "prod") {
// session.cookie.secure = true;
//}

// View engine setup
app.set('views', path.join(__dirname, "view/pages"));
app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        extname: '.handlebars',
        layoutsDir:'server/view/pages/layouts',
        partialsDir:'server/view/pages/partials'
}));

app.set('view engine', 'handlebars');

//Source: https://stackoverflow.com/a/59930561
var hbs = exphbs.create({});
for (var h in handlebarsHelperFunctions) {
 handlebarsHelperFunctions[h](hbs);
}

//All routes and pages are called here.
for (var r in routes) {
 routes[r](app);
}

//Create required directories and change permissions if they do not exist.
//These should be mounted to a large storage pool
if (!fs.existsSync(core.coreVars.installedDir)){
 console.log(`${core.coreVars.projectName}|${process.env.pm_id}: Creating: ${core.coreVars.installedDir}`);
 core.createDir (core.coreVars.installedDir);
}
if (!fs.existsSync(core.coreVars.dbStoreDir)){
 console.log(`${core.coreVars.projectName}|${process.env.pm_id}: Creating: ${core.coreVars.dbStoreDir}`);
 core.createDir (core.coreVars.dbStoreDir);
}

function startApp () {
 app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`${core.coreVars.projectName}|${process.env.pm_id}: ${emoji.emojify(':heavy_check_mark:.....:100:')}`);
 });
 for (var a in appSpecificCode) {
  appSpecificCode[a]();
 }
}

//Check if app is runing as correct user then execute.
core.incorrectUser(process.env.USER,process.env.HOST,process.env.PORT);
if (process.env.CORRECT_USER && process.env.INSTANCE_TYPE == 'primary') {
 childProcess.exec(`mongod -f ${core.coreVars.systemConfsDir}/mongod.conf`, (error, stdout, stderr) => {
  if (error) {
   //If it can not run show error and stop.
   console.error(`${core.coreVars.projectName}|${process.env.pm_id}: Error when starting MongoDB: ${error}`);
   return;
  }
  //Start has completed.
  console.log(`${core.coreVars.projectName}|${process.env.pm_id}: MongoDB start complete: ${stdout.replace(/\n$/, '')}`);
 });
 //Start all cron jobs defined in ./server/modules/cronJobs.js
 console.log(`${core.coreVars.projectName}|${process.env.pm_id}: Primary Instance starting cronJobs...`);
 for (key in jobs) {
  jobs[key].start();
 }
}

//Start app.
startApp();

process.on('SIGINT', () => {
 if (process.env.CORRECT_USER && process.env.INSTANCE_TYPE == 'primary') {
  childProcess.exec(`mongod -f ${core.coreVars.systemConfsDir}/mongod.conf --shutdown`, (error, stdout, stderr) => {
   if (error) {
    console.error(`${core.coreVars.projectName}|${process.env.pm_id}: MongoDB error: ${error}`);
   } else {
    console.log(`${core.coreVars.projectName}|${process.env.pm_id}: Shutting down MongoDB...`);
   }
   process.exit(error ? 1 : 0);
  });
 } else {
  process.exit(0);
 }
});
