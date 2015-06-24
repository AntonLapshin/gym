var http = require('http'),
    https = require('https'),
    fs = require('fs'),
    app = require('./app'),
    port = Number(process.env.PORT || 8081),
    portHttps = 8000;


var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

http.createServer(app.handler).listen(port);
https.createServer(options, app.handler).listen(portHttps);

console.log('Penalty http: ' + port);
console.log('Penalty https: ' + portHttps);

