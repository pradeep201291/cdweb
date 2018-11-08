
rem try to make this work
rem SET Path = %Path%;%USERPROFILE%\AppData\Roaming\npm;

attrib -r *.* /s

rem check first before removing
rem rmdir /s /q dist-dev
rem rmdir /s /q dist-test
rem rmdir /s /q dist-test1
rem rmdir /s /q dist-test4

call npm install

call gulp build --env dev
ren dist dist-cd-dev

REM This environment for Tavant only
REM call gulp build --env test
REM ren dist dist-cd-test_url_test_api

call gulp build --env test1
ren dist dist-cd-test1

call gulp build --env test4
ren dist dist-cd-test

call gulp build --env test2
ren dist dist-cd-test2

call gulp build --env prod
ren dist dist-cd-prod