define(function () {
    return {
        GAME: [
            {
                src: '//pp.vk.me/c619417/v619417333/d5ef/qxUrsjhRcz4.jpg',
                name: 'background', target: ['.intro', '.match', '.result', '.choice', '.tournament'],
                required: true
            },
            {
                src: '//pp.vk.me/c619417/v619417333/d5f7/QOj4EmWNDRY.jpg',
                name: 'background-top', target: ['.top'],
                required: true
            },
            {
                src: '//pp.vk.me/c619417/v619417333/d606/CsI5pMosgKA.jpg',
                name: 'instruction', target: ['.instruction img.image1']
            },
//            {
//                src: 'resources/table.png',
//                name: 'table', target: ['#tournament-table img'],
//                required: true
//            },
//            {
//                name: 'soundtrack',
//                src: '//cs9-12v4.vk.me/p24/c1aee4b5ddfaa8.mp3',
//                loop: false
//            }
        ],
        ENGINE: [
            {
                name: 'field',
                src: '//pp.vk.me/c619417/v619417333/d5ff/yjrJzLFLkVw.jpg',
                required: true
            },
            {
                name: 'gate',
                src: 'engine/img/gate.png',
                required: true
            },
            {
                name: 'ball',
                src: 'engine/img/ball_brazil.png',
                required: true
            },
            {
                name: 'head',
                src: 'engine/img/head.png',
                required: true
            },
            {
                name: 'leftHand',
                src: 'engine/img/leftHand.png',
                required: true
            },
            {
                name: 'rightHand',
                src: 'engine/img/rightHand.png',
                required: true
            },
            {
                name: 'stadium',
                src: 'engine/mp3/stadium.mp3',
                loop: true,
                duration: 7
            },
            {
                name: 'strike',
                src: 'engine/mp3/strike.mp3'
            },
            {
                name: 'goal',
                src: 'engine/mp3/goal.mp3'
            },
            {
                name: 'miss',
                src: 'engine/mp3/miss.mp3'
            }
        ]
    };
});
