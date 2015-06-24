define(['model/teams', 'server/server', 'controllers/users'], function (teams, server, UsersController) {

    return {
        teams: teams,
        goals: -1,
        miss: -1,
        place: -1,

        init: function (playerTeamIndex) {
            this.teams[playerTeamIndex].isPlayer = true;
            this.goals = 0;
            this.miss = 0;
        },

        save: function () {
            return server.saveUser({
                id: this.player.id,
                score: this.player.score,
                goals: this.player.goals,
                miss: this.player.miss,
                exp: this.player.exp
            });
        },

        load: function () {
            var self = this;
            return UsersController.getMe()
                .then(function (user) {
                    self.player = user;
                });
        },

        upgrade: function () {
            this.player.goals += this.goals;
            this.player.miss += this.miss;
            this.player.exp += 1;
            this.exp += 1;
        }
    }
});