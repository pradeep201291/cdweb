#!/bin/bash

#install node.js
#https://nodejs.org/en/download/
#execute
#chmod 777 <path of script>
#sudo <path of script>

#REM one time

npm install webpack -g
npm install gulp -g
npm install npm-install-all -g
npm install npm-install-missing -g

npm-install-all

npm-install-missing
