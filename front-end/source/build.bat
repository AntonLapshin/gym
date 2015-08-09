node r.js -o app.build.js
del /s /q build\www\components\*.html
del /s /q build\www\components\*.less
del /s /q build\www\*.less
rd /s /q build\www\server
rd /s /q build\www\social
rd /s /q build\www\plugins
rd /s /q build\www\lib
rd /s /q ..\app
xcopy build\www ..\app /s /i /y
pause