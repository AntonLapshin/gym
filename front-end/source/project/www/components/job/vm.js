define([
    'ko',
    'jquery',
    'text!./view.html',
    'c',
    'cs/timer/vm',
    'server/server',
    'bootbox'
], function (ko, $, html, c, timer, server, bootbox) {

    var TIMEOUT = 60;
    var PATH = 'components/job/';
    var LEFT_SIDE_START_POSITION = {x: 114, y: 64};
    var RIGHT_SIDE_START_POSITION = {x: 0, y: 64};
    var AREA = {width: 273, height: 511};
    var BASE_WEIGHT = 20;

    var DISK_ARRAY =
        [
            {weight: 25, header: '25', width: 15, size: 128, img: '25kg'},
            {weight: 20, header: '20', width: 12, size: 119, img: '20kg'},
            {weight: 15, header: '15', width: 11, size: 99, img: '15kg'},
            {weight: 10, header: '10', width: 10, size: 90, img: '10kg'},
            {weight: 5, header: '5', width: 12, size: 76, img: '5kg'},
            {weight: 2.5, header: '2.5', width: 10, size: 66, img: '2500g'},
            {weight: 1.25, header: '1.25', width: 5, size: 49, img: '1250g'},
            {weight: 0.625, header: '0.625', width: 4, size: 41, img: '625g'}
        ];

    var INDEX_ARRAY = [0, 1, 2, 3, 4, 5, 6, 7];

    function getDiskArray(side) {
        var area;

        var indexArray = [].concat(INDEX_ARRAY).sort(function() {
            return .5 - Math.random();
        });

        var x = 0;
        var y = 0;
        var j = 0;

        return $.map(indexArray, function (i) {
            var disk = DISK_ARRAY[i];

            var gap = c.random(2, 15);

            if (x + disk.size + gap > AREA.width) {
                x = c.random(0, 15);
                y = y + 128 + c.random(0, 15);
            }

            if (y + disk.size > AREA.height) {
                return null;
            }

            var item = {
                weight: disk.weight,
                id: i,
                x: x,
                y: y,
                side: side,
                deg: c.random(0, 360)
            };

            x = x + disk.size + gap;
            return item;
        });
    }

    function getDiskArrayForArea(items, excludeSide) {
        var arr = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.side == excludeSide) continue;

            var disk = DISK_ARRAY[item.id];

            var diskArea = {
                id: item.id,
                weight: disk.weight,
                header: disk.header + c.strings.massUnit(),
                img: PATH + disk.img + '.png',
                x: item.x + 'px',
                y: item.y + 'px',
                deg: item.deg
            };
            arr.push(diskArea);
        }
        return arr;
    }

    function ViewModel() {
        var self = this;

        this.weight = ko.observable();
        this.items = ko.observableArray([]);
        this.itemsSelected = ko.observableArray([]);
        this.summaryWeight = ko.computed(function () {
            var weight = BASE_WEIGHT;
            for (var i = 0; i < this.itemsSelected().length; i++) {
                weight += (this.itemsSelected()[i].weight);
            }
            return weight;
        }, this);
        this.textStatus = ko.computed(function () {
            return c.format(c.strings.jobStatus(), this.summaryWeight(), this.weight());
        }, this);
        this.itemsLeft = ko.computed(function () {
            return getDiskArrayForArea(this.items(), 'right');
        }, this);

        this.itemsRight = ko.computed(function () {
            return getDiskArrayForArea(this.items(), 'left');
        }, this);

        this.itemsSideLeft = ko.computed(function () {
            var arr = [];
            var x = LEFT_SIDE_START_POSITION.x;
            var y = LEFT_SIDE_START_POSITION.y;
            for (var i = 0; i < this.itemsSelected().length; i++) {
                var item = this.itemsSelected()[i];
                if (item.side == 'right') continue;

                var disk = DISK_ARRAY[item.id];
                x = x - disk.width;
                var sideDisk = {
                    header: disk.header + c.strings.massUnit(),
                    img: PATH + disk.img + '-side.png',
                    x: x + 'px',
                    y: Math.floor(y - disk.size / 2) + 'px'
                };
                arr.push(sideDisk);
            }
            return arr;
        }, this);

        this.itemsSideRight = ko.computed(function () {
            var arr = [];
            var x = RIGHT_SIDE_START_POSITION.x;
            var y = RIGHT_SIDE_START_POSITION.y;
            for (var i = 0; i < this.itemsSelected().length; i++) {
                var item = this.itemsSelected()[i];
                if (item.side == 'left') continue;

                var disk = DISK_ARRAY[item.id];
                var sideDisk = {
                    header: disk.header + c.strings.massUnit(),
                    img: PATH + disk.img + '-side.png',
                    x: x + 'px',
                    y: Math.floor(y - disk.size / 2) + 'px'
                };
                x = x + disk.width;
                arr.push(sideDisk);
            }
            return arr;
        }, this);

        this.onShow = function(){
            this.reset();
        };

        this.init = function(){
            timer('job').init();
            c.on('timer.stop', function(){
                bootbox.dialog({
                    message: c.strings.jobTimeIsUp(),
                    title: c.strings.jobTitle()
                });
                c.fire('home');
            });
            return self;
        };

        this.reset = function(){
            timer('job').hide();
            self.itemsSelected([]);
            self.items([]);
            self.weight(null);
        };

        this.start = function () {
            server.jobGet()
                .then(function (weight) {
                    bootbox.dialog({
                        message: c.format(c.strings.jobAsk(), weight),
                        title: c.strings.jobTitle(),
                        buttons: {
                            yes: {
                                label: c.strings.YES(),
                                className: "btn-success",
                                callback: function () {

                                    self.itemsSelected([]);
                                    var itemsLeft = getDiskArray('left');
                                    var itemsRight = getDiskArray('right');
                                    var arr = [];
                                    var i;
                                    for (i = 0; i < itemsLeft.length; i++) arr.push(itemsLeft[i]);
                                    for (i = 0; i < itemsRight.length; i++) arr.push(itemsRight[i]);
                                    self.items(arr);
                                    self.weight(weight);

                                    timer('job').start(TIMEOUT).show();
                                }
                            },
                            no: {
                                label: c.strings.NO(),
                                className: "btn-danger",
                                callback: function () {
                                }
                            }
                        }
                    });
                });
            return self;
        };

        this.select = function (item) {
            var disk = DISK_ARRAY[item.id];
            var arrSelected = this.itemsSelected();
            var arr = this.items();
            var arrNew = [];

            for (var i = 0; i < arr.length; i++) {
                if (arr[i].weight != disk.weight) {
                    arrNew.push(arr[i]);
                }
                else {
                    arrSelected.push(arr[i]);
                }
            }
            this.items(arrNew);
            this.itemsSelected(arrSelected);
            if (this.summaryWeight() == this.weight()) {
                server.jobComplete().then(function (data) {
                    bootbox.dialog({
                        message: c.strings.jobSuccess(),
                        title: c.strings.jobTitle()
                    });
                    timer('job').stop();
                    c.fire('home');
                    //c.fire('money.earn', money);
                });
            }
            else if (this.summaryWeight() > this.weight()) {
                bootbox.dialog({
                    message: c.strings.jobWrongWeight(),
                    title: c.strings.jobTitle()
                });
                timer('job').stop();
                c.fire('home');
            }
        };

        this.test = function () {
            this.init().start().show();
        };
    }

    return c.add(ViewModel, html, 'job');
});