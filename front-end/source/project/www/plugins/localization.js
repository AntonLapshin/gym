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
        gyms1name:      ['Зал 2',                   'Gym 2'],
        gyms1desc:      ['Тренажерный зал в школе',
                        'TBD'],

        ex0name:        ['Жим лёжа',                'Ex 1'],
        ex0desc:        ['Базовое упражнение',
                         'TBD'],
        ex1name:        ['Присед',                  'Ex 2'],
        ex1desc:        ['Базовое упражнение',
                         'TBD'],
        ex2name:        ['Тяга к поясу в наклоне',  'Ex 3'],
        ex2desc:        ['Базовое упражнение',
                         'TBD'],
        ex3name:        ['Становая тяга',           'Ex 4'],
        ex3desc:        ['Базовое упражнение',
                         'TBD'],

        trChooseWeight: ['Выберите вес',            'Choose the weight'],
        trChooseRepeats: ['Количество повторений',  'Number of repeats'],
        trMeasureWeight: ['кг',                     'kg'],
        trNoLimit:      ['до отказа',               'no limit'],
        trExecute:      ['Выполнить',               'Execute'],

        menuHome:       ['Домой',                   'Home'],
        menuWorkout:    ['Тренировка',              'Workout'],
        menuRest:       ['Отдых',                   'Rest'],
        menuAwards:     ['Достижения',              'Awards'],
        menuShop:       ['Магазин',                 'Shop'],
        menuJob:        ['Работа',                  'Job'],

        jobTitle:       ['Работа',                  'Job'],
        jobAsk:         ['Необходимо собрать штангу весом {0} кг. Вы готовы?',                 'TBD'],
        jobTimeIsUp:    ['Время вышло',             'Time is up'],
        jobWrongWeight: ['Вес превышен',            'Wrong weight'],
        jobSuccess:     ['Вес собран',              'Success'],
        jobStatus:      ['Собрано: {0}кг. Нужно собрать: {1}кг', 'TBD'],

        YES:            ['Да',                      'Yes'],
        NO:             ['Нет',                     'No'],
        bankMoney:      ['Не хватает денег? Нажми, чтобы пополнить счет.', 'TBD'],
        bankEnergy:     ['Нажми, чтобы восстановить силы.', 'TBD'],
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

        mesWorldRecord:     ['Новый мировой рекорд!', 'TBD'],
        mesPresonalRecord:  ['Новый персональный рекорд!', 'TBD'],
        mesWorldRecordDesc: ['Вы установили новый мировой рекорд, выполнив упражнение {0} с весом <b>{1}кг</b>', 'TBD'],
        mesPersonalRecordDesc: ['Вы установили новый персональный рекорд, выполнив упражнение {0} с весом <b>{1}кг.</b>', 'TBD']
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