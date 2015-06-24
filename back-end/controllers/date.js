module.exports = {
    addMinutes: function (date, minutes) {
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    },
    addMinutesClone: function (date, minutes) {
        var newDate = new Date(date);
        newDate.setMinutes(newDate.getMinutes() + minutes);
        return newDate;
    },
    addSeconds: function (date, seconds) {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    },
    addSecondsClone: function (date, seconds) {
        var newDate = new Date(date);
        newDate.setSeconds(newDate.getSeconds() + seconds);
        return newDate;
    },
    addHours: function (date, hours) {
        date.setHours(date.getHours() + hours);
        return date;
    },
    addHoursClone: function (date, hours) {
        var newDate = new Date(date);
        newDate.setHours(newDate.getHours() + hours);
        return newDate;
    },
    setNextTime: function (date, hours) {
        var newDate = new Date(date);
        //newDate.setHours(newDate.getHours() + hours);
        newDate.setMinutes(newDate.getMinutes() + hours);
        return newDate;
    },
    intervalHours: function (timestamp) {
        return timestamp / 1000 / 60 / 60;
    }
};
