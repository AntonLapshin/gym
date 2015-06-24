var fs = require('fs'),
    url = require("url"),
    path = require("path");

exports.handler = function (request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(__dirname, 'www', uri);

    fs.exists(filename, function (exists) {
        console.log(request.url);

        if (!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        var contentTypesByExtension = {
            '.html': "text/html",
            '.css': "text/css",
            '.js': "text/javascript"
        };

        if (fs.statSync(filename).isDirectory()) {
            console.log(new Date());
            if (fs.statSync(filename).isDirectory()) filename += '/index.html';            
        }

        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            var headers = {};
            var contentType = contentTypesByExtension[path.extname(filename)];
            if (contentType) headers["Content-Type"] = contentType;
            response.writeHead(200, headers);
            response.write(file, "binary");
            response.end();
        });
    });
};

