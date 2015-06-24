define(['physics'], function (Physics) {

    return {
        PenaltyBall: new Physics.vector(355, 765),
        //PenaltyCamera: new Physics.vector(3, 560),
        LeftCrossbar: new Physics.vector(70, 45),
        RightCrossbar: new Physics.vector(626, 45),
        LeftGate: new Physics.vector(70, -25),
        RightGate: new Physics.vector(626, -25),
        TopGate: new Physics.vector(348, -105),
        GateOffset: new Physics.vector(63, -88),
        GoalkeeperStart: new Physics.vector(350, 100)
    };
});