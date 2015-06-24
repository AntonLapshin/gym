var GymDb = require('./gymdb');

GymDb.create().then(
    function () {
        console.log("Database has been created");
        GymDb.close();
    },
    function (err) {
        console.log(err);
    });