var port = Number(process.env.PORT || 8080);
require('./server').start(port)
    .then(function ()
    {
        console.log('Listening port ' + port);
    }, function (err)
    {
        throw err;
    });