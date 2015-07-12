define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'components/timer/vm',
    'model/game',
    'bootbox'
], function (ko, html, c, timer, game, bootbox) {

    var TIMEOUT = 60;
    var PATH = 'components/job/';
    var LEFT_SIDE_START_POSITION = {x: 89, y: 74};
    var RIGHT_SIDE_START_POSITION = {x: 0, y: 74};
    var AREA = {width: 195, height: 298};
    var BASE_WEIGHT = 20;
    var isAlreadyFinished = false;

    var DISK_ARRAY =
        [
            {weight: 25, header: '25', width: 9, height: 83, size: 91, img: '25kg'},
            {weight: 20, header: '20', width: 8, height: 77, size: 83, img: '20kg'},
            {weight: 15, header: '15', width: 7, height: 65, size: 72, img: '15kg'},
            {weight: 10, header: '10', width: 7, height: 60, size: 63, img: '10kg'},
            {weight: 5, header: '5', width: 7, height: 51, size: 54, img: '5kg'},
            {weight: 2.5, header: '2.5', width: 6, height: 41, size: 48, img: '2500g'},
            {weight: 1.25, header: '1.25', width: 4, height: 32, size: 36, img: '1250g'},
            {weight: 0.625, header: '0.625', width: 3, height: 27, size: 28, img: '625g'}
        ];

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getDiskArray(side) {
        var area;

        var indexArray = [];
        var diskArray = [];
        var x = 0;
        var y = 0;

        for (var i = 0; i < DISK_ARRAY.length; i++)indexArray.push(i);

        var j = 0;
        while (diskArray.length < DISK_ARRAY.length && j < 100) {
            var rndIndex = getRandom(0, indexArray.length - 1);
            if (indexArray[rndIndex] == -1) {
                j++;
                continue;
            }
            var disk = DISK_ARRAY[rndIndex];
            if (x + disk.size < AREA.width && y + disk.size < AREA.height) {
                var item = {
                    weight: disk.weight,
                    id: rndIndex,
                    x: x,
                    y: y,
                    side: side
                };
                diskArray.push(item);
                x += disk.size;
                indexArray[rndIndex] = -1;
                if (x + 83 > AREA.width) {
                    x = 0;
                    y += 85;
                }
            }
            j++;
        }

        return diskArray;
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
                header: disk.header + ' кг',
                img: PATH + disk.img + '.png',
                x: item.x + 'px',
                y: item.y + 'px'
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
        this.textStatus = ko.computed(function(){
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
                    header: disk.header + ' кг',
                    img: PATH + disk.img + '-side.png',
                    x: x + 'px',
                    y: Math.floor(y - disk.height / 2) + 'px'
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
                    header: disk.header + ' кг',
                    img: PATH + disk.img + '-side.png',
                    x: x + 'px',
                    y: Math.floor(y - disk.height / 2) + 'px'
                };
                x = x + disk.width;
                arr.push(sideDisk);
            }
            return arr;
        }, this);

        this.start = function(weight){
            game.server.jobGet()
                .then(function(weight){
                    bootbox.dialog({
                        message: c.format(c.strings.jobAsk(), weight),
                        title: c.strings.jobTitle(),
                        buttons: {
                            yes: {
                                label: c.strings.YES(),
                                className: "btn-success",
                                callback: function() {
                                    isAlreadyFinished = false;
                                    self.itemsSelected([]);
                                    var itemsLeft = getDiskArray('left');
                                    var itemsRight = getDiskArray('right');
                                    var arr = [];
                                    var i;
                                    for (i = 0; i < itemsLeft.length; i++) arr.push(itemsLeft[i]);
                                    for (i = 0; i < itemsRight.length; i++) arr.push(itemsRight[i]);
                                    self.items(arr);
                                    self.weight(weight);

                                    timer('job').show().init(TIMEOUT)
                                        .then(function(){
                                            if (isAlreadyFinished)
                                                return;
                                            bootbox.dialog({
                                                message: c.strings.jobTimeIsUp(),
                                                title: c.strings.jobTitle()
                                            });
                                            c.fire('home');
                                        });
                                }
                            },
                            no: {
                                label: c.strings.NO(),
                                className: "btn-danger",
                                callback: function() {
                                }
                            }
                        }
                    });
                });
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
                game.server.jobComplete().then(function(money){
                    isAlreadyFinished = true;
                    bootbox.dialog({
                        message: c.strings.jobSuccess(),
                        title: c.strings.jobTitle()
                    });
                    c.fire('home');
                    c.fire('money.earn', money);
                });
            }
            else if (this.summaryWeight() > this.weight()) {
                isAlreadyFinished = true;
                bootbox.dialog({
                    message: c.strings.jobWrongWeight(),
                    title: c.strings.jobTitle()
                });
                c.fire('home');
            }
        };

        this.test = function () {
            this.show().init().start();
        };
    }

    return c.add(ViewModel, html, 'job');
});