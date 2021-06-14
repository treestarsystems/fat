#!/bin/bash

projectName='fat'
systemId=''
baseDir='/opt'
appProdPort=''
appDevPort=''
mongoPort=''

function do_system_dependencies {
 echo -e "Installing system dependencies..."
 sudo apt install -y software-properties-common aptitude
 sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key C99B11DEB97541F0
 sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
 wget -qO - https://deb.nodesource.com/setup_14.x | bash -E
 sudo apt-add-repository https://cli.github.com/packages
 sudo aptitude update
 sudo aptitude -y upgrade
 sudo aptitude install -y nodejs
 sudo aptitude install -y nmap whois rsync screen build-essential nano gh
 npm install -g pm2
}

function do_generate_nginx_conf {
 cp $scriptDir/static_files/ssl-params.conf /etc/nginx/snippets/ssl-params.conf
 echo -e "Generating Temporary Self Signed Certificate..."
 openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout $baseDir/$projectName/system_confs/certs/$systemId.key -out $baseDir/$projectName/system_confs/certs/$systemId.pem -subj "/C=US/ST=GA/L=City/O=Tree Star Systems, LLC./OU=DEV/CN=$systemId"
 cat $baseDir/$projectName/system_confs/certs/$systemId.key > $baseDir/$projectName/system_confs/certs/$systemId.mongo.pem
 cat $baseDir/$projectName/system_confs/certs/$systemId.pem >> $baseDir/$projectName/system_confs/certs/$systemId.mongo.pem
 chmod 600 $baseDir/$projectName/system_confs/certs/$systemId.mongo.pem
 echo -e "Generating Diffie-Hellman Group. Please be patient..."
 openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
 echo -e "Generating NGINX Configuration..."
 echo "
#HTTP to HTTPS Redirect
server {
    listen 80;
    listen [::]:80;
    server_name $systemId;
    if (\$host = $systemId) {
        return 301 https://\$host\$request_uri;
    }
    if (\$host = $systemId) {
        return 301 https://\$host\$request_uri;
    }
}
#Host/Vhost/Alias conf
server {
     listen 443 ssl;
     listen [::]:443 ssl;
     ssl_certificate $baseDir/$projectName/system_confs/certs/$systemId.pem;
     ssl_certificate_key $baseDir/$projectName/system_confs/certs/$systemId.key;
     server_name $systemId;
     proxy_set_header Host \$host;
     proxy_set_header X-Forwarded-Proto \$scheme;
     proxy_set_header X-Real-IP \$remote_addr;
     proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
     location / {
             proxy_pass http://127.0.0.1:$appProdPort/;
             proxy_http_version 1.1;
             proxy_set_header Upgrade \$http_upgrade;
             proxy_set_header Connection 'upgrade';
             proxy_set_header Host \$host;
             proxy_cache_bypass \$http_upgrade;
     }
     location /public/ {
             root $baseDir/$projectName/server/view;
             access_log off;
             expires max;
     }
     include snippets/ssl-params.conf;
}
 " > /etc/nginx/sites-enabled/default-$projectName
 nginx -t &>/dev/null
 nginxExitCode=$(echo $?)
 if [ "$nginxExitCode" == 0  ]
 then
  service nginx restart
 else
  echo -e "Issue with NGINX configuration. Please check using the \"nginx -t\" command..."
 fi
}

function do_mongo_install {
 echo "Installing MongoDB 4.4.x"
 wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
 echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
 sudo aptitude install -y mongodb-org
 do_generate_mongod_conf
}

function do_prompts {
 #Prompt for projectName
 read -e -p "Enter Project Name (Valid Chars: Letter,Numbers,-,_): " projectName
 #Validate the input and keep asking until it is correct.
 #Source: https://stackoverflow.com/a/49832505
 while [[ $projectName == "" ]] || [[ $projectName == "." ]] || [[ $projectName == ".." ]] || [ $(echo "${#projectName}") -gt 255 ] || [[ ! $projectName =~ ^[0-9a-zA-Z._-]+$ ]] || [[ ! $(echo $projectName | cut -c1-1) =~ ^[0-9a-zA-Z.]+$ ]]
 do
  read -e -p "Enter A Valid Project Name (Valid Chars: Letter,Numbers,-,_): " projectName
 done

 #Prompt for systemId
 read -e -p "Enter A System ID (Valid Chars: Letter,Numbers,-,_): " systemId
 #Validate the input and keep asking until it is correct.
 #Source: https://stackoverflow.com/a/49832505
 while [[ ! $(echo $systemId | grep -P $regExValidHostname) == $systemId ]]
 do
  read -e -p "Enter A Valid System ID (Valid Chars: Letter,Numbers,-,_): " systemId
 done

 #Prompt for appProdPort
 read -e -p "Enter The Application's Production Port Number (Valid Chars: Numbers): " appProdPort
 #Validate the input and keep asking until it is correct.
 #Source: https://stackoverflow.com/a/49832505
 while [[ $appProdPort == "" ]] || [ $appProdPort -ge 65536 ] || [[ ! $appProdPort =~ ^[0-9]+$ ]]
 do
  read -e -p "Enter A Valid Port & Unused Number (Valid Chars: Numbers): " appProdPort
 done

 #Prompt for appDevPort
 read -e -p "Enter The Application's Development Port Number (Valid Chars: Numbers): " appDevPort
 #Validate the input and keep asking until it is correct.
 #Source: https://stackoverflow.com/a/49832505
 while [[ $appDevPort == "" ]] || [ $appDevPort -ge 65536 ] || [[ ! $appDevPort =~ ^[0-9]+$ ]] || [[ ! $appDevPort -ne $appProdPort ]]
 do
  read -e -p "Enter A Valid & Unused Port Number (Valid Chars: Numbers): " appDevPort
 done

 #Prompt for mongoPort
 read -e -p "Enter The Application's MongoDB Port Number (Valid Chars: Numbers): " mongoPort
 #Validate the input and keep asking until it is correct.
 #Source: https://stackoverflow.com/a/49832505
 while [[ $mongoPort == "" ]] || [ $mongoPort -ge 65536 ] || [[ ! $mongoPort =~ ^[0-9]+$ ]] || [[ ! $mongoPort -ne $appProdPort ]] || [[ ! $mongoPort -ne $appDevPort ]]
 do
  read -e -p "Enter A Valid & Unused Port Number (Valid Chars: Numbers): " mongoPort
 done

 #Prompt for installation's base directory
 read -e -p "Enter The Base Installation Directory (Ex: /opt|Default: /opt): " baseDirInput
 #Default variable if blank
 if [ "$baseDir" == "" ]
 then
  baseDir='/opt'
 fi
 #Validate the input and keep asking until it is correct.
 while [[ ! -d $baseDir ]]
 do
  read -e -p "Enter A Valid Directory (Ex: /opt): " baseDir
  #Default variable if blank
  if [ "$baseDir" == "" ]
  then
   baseDir='/opt'
  fi
 done

 do_system_dependencies
 do_generate_nginx_conf
}

do_prompts
