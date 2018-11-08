#!/bin/bash

#install node.js
#https://nodejs.org/download/
#execute
#chmod 777 <path of script>
#sudo <path of script>

npm install

gulp build --env dev
mv ./dist dist-cd-dev
