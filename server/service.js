#!/usr/bin/env node

//Destination: server
/*
Purpose: Collects information about the running process to make it easier to stop,
	 delete, and restart.
ToDo:    Make this all async....man fuck all dat
*/

/*
const fs = require('fs');
const fsSync = require('fs');
const core = require('./core/core.js');
const childProcess = require('child_process');
var argv = require('minimist')(process.argv.slice(2));

function instanceInfo (id,name,instance,environment) {
 var info = {};
 info.id = id;
 info.name = name;
 info.pid = fsSync.readFileSync(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_id-${id}.pid`).toString();
 info.instance = instance;
 info.environment = environment;
 let data = JSON.stringify(info, null, 2);
 fs.writeFile(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_Kill.json`, data, (err) => {
  if (err) throw err;
 });
}

if (argv.k) {
 let instanceId = require(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_Kill.json`);
// childProcess.execSync(`pm2 stop ${instanceId.id}`);
 childProcess.execSync(`pm2 stop all`);
}
if (argv.s) {
 let instanceId = require(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_Kill.json`);
// childProcess.execSync(`pm2 status ${instanceId.id}`);
 childProcess.execSync(`pm2 status all`);
}
if (argv.d) {
 let instanceId = require(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_Kill.json`);
// childProcess.execSync(`pm2 delete ${instanceId.id}`);
 childProcess.execSync(`pm2 delete all`);
}
if (argv.r) {
 let instanceId = require(`${core.coreVars.logStoreDir}/pid/${core.coreVars.projectName}_Kill.json`);
// childProcess.execSync(`pm2 restart ${instanceId.id}`);
 childProcess.execSync(`pm2 restart all`);
}

module.exports = {
 instanceInfo,
}
*/

const fs = require('fs');
const core = require('./core/core.js');
const childProcess = require('child_process');
var argv = require('minimist')(process.argv.slice(2));

function statusToJSON (inputObj) {
 let output = JSON.parse(inputObj);
 let statusArray = [];
 for (let i=0;i < output.length;i++) {
  if (output[i].name == core.coreVars.projectName) {
   let statusObj = {
    'name': core.coreVars.projectName,
    'status': output[i].pm2_env.status,
    'instance': output[i].pm_id,
    'type': output[i].pm2_env.INSTANCE_TYPE,
    'environment': output[i].pm2_env.NODE_ENV,
    'pid': output[i].pid,
    'port': output[i].pm2_env.PORT,
    'cpu': output[i].monit.cpu,
    'memory': output[i].monit.memory,
   }
   statusArray.push(statusObj);
  }
  if (output.length-1 == i) return statusArray;
 }
}

if (argv.k) {
 childProcess.exec(`pm2 stop ${core.coreVars.projectName}`,(error,stdout,stderr) => {
  if (error) {
   console.error(`Process Error: ${error}`);
   return;
  }
 });
}
if (argv.s) {
 childProcess.exec(`pm2 jlist`,(error,stdout,stderr) => {
  if (error) {
   console.error(`Process Error: ${error}`);
   return;
  }
  let output = JSON.parse(stdout);
  output.forEach((e,i) => {
   if (e.name == core.coreVars.projectName) {
    let statusString = `${e.pm2_env.status} : ${core.coreVars.projectName}/${e.pm_id}/${e.pm2_env.NODE_ENV}/${e.pm2_env.INSTANCE_TYPE} : pid-${e.pid}/usage cpu-${Math.round(e.monit.cpu/100)}% memory ${Math.round(e.monit.memory/1024/1024)}MB/port-${e.pm2_env.PORT}`;
    console.log(statusString);
   }
  });
 });
}
if (argv.j) {
 childProcess.exec(`pm2 jlist`,(error,stdout,stderr) => {
  if (error) {
   console.error(`Process Error: ${error}`);
   return;
  }
  console.log(statusToJSON(stdout));
 });
}
if (argv.d) {
 childProcess.exec(`pm2 delete ${core.coreVars.projectName}`,(error,stdout,stderr) => {
  if (error) {
   console.error(`Process Error: ${error}`);
   return;
  }
 });
}
if (argv.r) {
 childProcess.exec(`pm2 reload ${core.coreVars.projectName}`,(error,stdout,stderr) => {
  if (error) {
   console.error(`Process Error: ${error}`);
   return;
  }
 });
}
