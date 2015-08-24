define(['ko'], function(ko){

    var _language,
        _languages = { 'ru' : 0, 'en' : 1};

    var _strings =
    {
        decEnergy:      ['Затраты энергии', 'TBD'],
        earnMoney:      ['Заработано', 'TBD'],

        gymsBtnEnter:   ['Войти',                   'Enter'],
        gym0name:      ['Качалка в подвале',       'Underground gym'],
        gym0desc:      ['Старый заброшенный подвал, переделанный под тренажерный зал. Здесь довольно сыро и совсем мало спортивного инвентаря.',
                         'TBD'],
        gym1name:      ['Зал 2',                   'Gym 2'],
        gym1desc:      ['Тренажерный зал в школе', 'TBD'],

        gym2name:      ['Зал 3',                   'Gym 3'],
        gym2desc:      ['Тренажерный зал', 'TBD'],

        ex0name:        ['Жим лёжа',                'Ex 1'],
        ex0desc:        ['Базовое упражнение',
                         'TBD'],
        ex1name:        ['Присед',                  'Ex 2'],
        ex1desc:        ['Базовое упражнение',
                         'TBD'],
        ex2name:        ['Становая тяга',           'Ex 3'],
        ex2desc:        ['Базовое упражнение',
                         'TBD'],
        ex3name:        ['Тяга к поясу в наклоне',  'Ex 4'],
        ex3desc:        ['Упражнение Арнольда',
                         'TBD'],
        ex4name:        ['Подъемы на бицепс',  'Ex 5'],
        ex4desc:        ['Бицуха',
                         'TBD'],

        ach0name:       ['Новичок', 'TBD'],
        ach0desc:       ['Выполнил первую тренировку до полной усталости', 'TBD'],
        ach1name:       ['Сбор штанги', 'TBD'],
        ach1desc:       ['Подтвердил умение собирать вес для штанги', 'TBD'],
        ach2name:       ['Жим лежа 80 кг', 'TBD'],
        ach2desc:       ['Установлен личный рекорд 80 кг в жиме лежа', 'TBD'],
        achNew:        ['Новое достижение', 'TBD'],


        trChooseWeight: ['Выберите вес',            'Choose the weight'],
        trChooseRepeats: ['Количество повторений',  'Number of repeats'],
        trMeasureWeight: ['кг',                     'kg'],
        trNoLimit:      ['до отказа',               'no limit'],
        trExecute:      ['Выполнить',               'Execute'],

        menuHome:       ['Домой',                   'Home'],
        menuWorkout:    ['Тренировка',              'Workout'],
        menuRest:       ['Отдых',                   'Rest'],
        menuAchievements: ['Достижения',              'Achievements'],
        menuShop:       ['Магазин',                 'Shop'],
        menuJob:        ['Работа',                  'Job'],

        jobTitle:       ['Работа',                  'Job'],
        jobAsk:         ['Необходимо собрать штангу весом {0} кг. Вес грифа составляет 20кг. Вы готовы?',                 'TBD'],
        jobTimeIsUp:    ['Время вышло',             'Time is up'],
        jobWrongWeight: ['Вес превышен',            'Wrong weight'],
        jobSuccess:     ['Вес собран',              'Success'],
        jobStatus:      ['Собрано: {0}кг. Нужно собрать: {1}кг', 'TBD'],

        YES:            ['Да',                      'Yes'],
        NO:             ['Нет',                     'No'],
        bankMoney:      ['Не хватает денег? Нажми, чтобы пополнить счет.', 'TBD'],
        bankEnergy:     ['Нажми, чтобы восстановить силы.', 'TBD'],
        bankGold:       ['Купить золото.', 'TBD'],
        socialFriends:  ['Нажми, чтобы пригласить в игру друзей.', 'TBD'],
        massAdd:        ['Не хватает массы? Нажми и мы придумаем как тебе помочь', 'TBD'],
        massUnit:       ['кг', 'kg'],


        showFrazzle:   ['Показать усталость', 'Show frazzle'],
        manFrazzle:    ['Усталость', 'Frazzle'],
        manStress:     ['Стресс', 'Stress'],
        manM0:         ['Мышцы шеи', 'TBD'],
        manM1:         ['Трапециевидные мышцы', 'TBD'],
        manM2:         ['Дельтовидные мышцы', 'TBD'],
        manM3:         ['Бицепс', 'TBD'],
        manM4:         ['Трицепс', 'TBD'],
        manM5:         ['Мышцы предплечья', 'TBD'],
        manM6:         ['Грудные мышцы', 'TBD'],
        manM7:         ['Косые мышцы живота', 'TBD'],
        manM8:         ['Прямые мышцы живота', 'TBD'],
        manM9:         ['Круглые мышцы', 'TBD'],
        manM10:        ['Широчайшие мышцы', 'TBD'],
        manM11:        ['Ягодичные мышцы', 'TBD'],
        manM12:        ['Задние мышцы бедра', 'TBD'],
        manM13:        ['Квадрицепс', 'TBD'],
        manM14:        ['Большеберцовые мышцы', 'TBD'],
        manM15:        ['Икроножные мышцы', 'TBD'],

        manFr0:        ['Усталости нет', 'TBD'],
        manFr1:        ['Небольшая усталость', 'TBD'],
        manFr2:        ['Средняя усталость', 'TBD'],
        manFr3:        ['Сильная усталость', 'TBD'],
        manFr4:        ['Очень сильная усталость', 'TBD'],

        journalHeader: ['Журнал тренировки', 'TBD'],

        mesWorldRecord:     ['Новый абсолютный рекорд!', 'TBD'],
        mesPresonalRecord:  ['Новый персональный рекорд!', 'TBD'],
        mesWorldRecordDesc: ['Вы установили новый абсолютный рекорд, выполнив упражнение {0} с весом <b>{1}кг</b>', 'TBD'],
        mesPersonalRecordDesc: ['Вы установили новый персональный рекорд, выполнив упражнение {0} с весом <b>{1}кг.</b>', 'TBD'],

        wr:             ['Абсолютный рекорд', 'Absolute Record'],
        pr:             ['Персональный рекорд', 'Personal Record'],
        wrDesc:         ['Будет установлен абсолютный рекорд', 'TBD'],
        prDesc:         ['Будет установлен персональный рекорд', 'TBD'],
        wrMini:         ['АР', 'AR'],
        prMini:         ['ПР', 'PR'],
        wrNone:         ['не установлен', 'none'],

        topPlayers:     ['Топ игроков', 'Top Players'],
        topFriends:     ['Топ друзей', 'Top Friends'],

        buy:            ['Купить', 'Buy'],

        level:          ['Уровень', 'Level']
    };

    var _localization = {

        getLanguage: function() { return _language; },
        setLanguage: function(language){
            _language = language;
            for (var name in _strings){
                if (!_strings.hasOwnProperty(name))
                    continue;

                if (this[name]){
                    this[name](
                        _strings[name][ _languages[_language] ]
                    );
                }
                else {
                    this[name] = ko.observable(
                        _strings[name][ _languages[_language] ]
                    );
                }
            }
        }

    };

    _localization.setLanguage(window.cfg.language);

    return _localization;
});