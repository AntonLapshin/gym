({
    mainConfigFile: 'project/www/main.js',
    appDir: 'project',
    baseUrl: 'www',
    removeCombined: true,
    fileExclusionRegExp: /^test/,
    findNestedDependencies: true,
    dir: 'build',
    inlineText: true,
    stubModules : ['text'],
    optimizeCss: 'standard',
    modules: [
        {
            name: "main",
            include: ['components/choice/vm','components/game/vm','components/info/vm','components/instruction/vm','components/intro/vm','components/lang/vm','components/load/vm','components/match/vm','components/member/vm','components/psychic/vm','components/result/vm','components/scores/vm','components/sound/vm','components/team/vm','components/timer/vm','components/top/vm','components/tournament/vm','components/twist/vm']
        }
    ]
})

