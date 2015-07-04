exports.gyms = [
    {
        _id: 0,
        exercises: [0,1,2],
        req: null
    },
    {
        _id: 1,
        exercises: [0,1,2,3],
        req: {
            conditions: [
                {level: 30, friends: 5},
                {level: 5, friends: 20},
                {gold: 20}
            ]
        }
    },
    {
        _id: 2,
        exercises: [0,1,2,3,4],
        req: {
            conditions: [
                {level: 50, friends: 15},
                {level: 30, friends: 30},
                {level: 10, gold: 100}
            ]
        }
    }
];
