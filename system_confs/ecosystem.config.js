module.exports = {
 apps : [
  {
   name        : "fat",
   script      : "server/index.js",
   watch       : true,
   cwd         : "/opt/fat",
   instances   : "1",
   exec_mode   : "cluster",
   watch       : ["./server","./system_confs"],
   ignore_watch        : ["./log_storage","./db_storage","system_confs/system_conf.json","server/view"],
   out_file    : "./log_storage/fat_out.log",
   error_file  : "./log_storage/fat_err.log",
   pid_file    : "./log_storage/pid/fat_id.pid",
   log_date_format     : "YYYY-MM-DD HH:mm Z",
   kill_timeout : 60000,
   env: {
     "INSTANCE_TYPE": "primary",
     "NODE_ENV": "prod",
     "PORT": "2000",
     "HOST": "0.0.0.0"
   },
   env_dev : {
     "INSTANCE_TYPE": "primary",
     "NODE_ENV": "dev",
     "PORT": "2001",
     "HOST": "0.0.0.0"
   }
  },
  {
   name        : "fat",
   script      : "server/index.js",
   watch       : true,
   cwd         : "/opt/fat",
   instances   : "-1",
   exec_mode   : "cluster",
   watch       : ["./server","./system_confs"],
   ignore_watch        : ["./log_storage","./db_storage","system_confs/system_conf.json","server/view"],
   out_file    : "./log_storage/fat_out.log",
   error_file  : "./log_storage/fat_err.log",
   pid_file    : "./log_storage/pid/fat_id.pid",
   log_date_format     : "YYYY-MM-DD HH:mm Z",
   kill_timeout : 60000,
   env: {
     "INSTANCE_TYPE": "clone",
     "NODE_ENV": "prod",
     "PORT": "2000",
     "HOST": "0.0.0.0"
   },
   env_dev : {
     "INSTANCE_TYPE": "clone",
     "NODE_ENV": "dev",
     "PORT": "2001",
     "HOST": "0.0.0.0"
   }
  }
 ]
}
