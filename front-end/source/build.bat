node r.js -o app.build.js
del /s /q build\www\components\*.html
rd /s /q build\www\server
rd /s /q build\www\social
rd /s /q ..\app
xcopy build\www ..\app /s /i /y