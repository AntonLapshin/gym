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
            include: [
                'components/ava/vm',
                'components/battery/vm',
                'components/friends/vm',
                'components/gold/vm',
                'components/main/vm',
                'components/sw/vm',
                'components/man/vm',
                'components/member/vm',
                'components/menu/vm',
                'components/money/vm',
                'components/muscleinfo/vm',
                'components/private/vm',
                'components/top/vm'
            ]
        }
    ]
})

