
rem try to make this work
set drivepath=%CD%
set folder=dist-cd-prod

rem SET Path = %Path%;%USERPROFILE%\AppData\Roaming\npm;
rem check first before removing
IF EXIST %drivepath%\%folder% rmdir /s /q dist-cd-prod

attrib -r *.* /s

call npm install

call gulp build --env prod
ren dist dist-cd-prod