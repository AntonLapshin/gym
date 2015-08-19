exports.exercises = [
    {
        // Жим лежа
        _id: 0,
        min: 20,
        max: 500,
        step: 2.5,
        coeff: 1,
        power: 30,
        energy: 50,
        wr: null,
        body: [
            {"_id": 2, "stress": 0.5},
            {"_id": 4, "stress": 0.8},
            {"_id": 5, "stress": 0.3},
            {"_id": 6, "stress": 1.0}
        ]
    },
    {
        // Присед
        _id: 1,
        min: 20,
        max: 600,
        step: 2.5,
        coeff: 1,
        power: 40,
        energy: 7,
        wr: null,
        body: [
            {"_id": 11, "stress": 0.7},
            {"_id": 12, "stress": 0.8},
            {"_id": 13, "stress": 1.0},
            {"_id": 14, "stress": 0.7},
            {"_id": 15, "stress": 0.3}
        ]
    },
    {
        // Становая тяга в стиле сумо
        _id: 2,
        min: 20,
        max: 700,
        step: 2.5,
        coeff: 1,
        power: 40,
        energy: 6,
        wr: null,
        body: [
            {"_id": 1, "stress": 0.4},
            {"_id": 2, "stress": 0.3},
            {"_id": 5, "stress": 0.3},
            {"_id": 9, "stress": 0.5},
            {"_id": 10, "stress": 1.0},
            {"_id": 11, "stress": 0.5},
            {"_id": 12, "stress": 0.5},
            {"_id": 13, "stress": 0.2},
            {"_id": 14, "stress": 0.1},
            {"_id": 15, "stress": 0.1}
        ]
    },
    {
        // Т-тяга
        _id: 3,
        min: 10,
        max: 300,
        step: 2.5,
        coeff: 0.4,
        power: 25,
        energy: 4,
        wr: null,
        body: [
            {"_id": 1, "stress": 0.2},
            {"_id": 2, "stress": 0.3},
            {"_id": 3, "stress": 0.7},
            {"_id": 4, "stress": 0.1},
            {"_id": 5, "stress": 0.3},
            {"_id": 9, "stress": 0.1},
            {"_id": 10, "stress": 0.7}
        ]
    },
    {
        // Подъемы на бицепс
        _id: 4,
        min: 5,
        max: 200,
        step: 1,
        coeff: 0.7,
        power: 15,
        energy: 3,
        wr: null,
        body: [
            {"_id": 3, "stress": 1.0},
            {"_id": 5, "stress": 0.3}
        ]
    }
];