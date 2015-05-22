angular.module('starter.map', []).factory('Map', function (PlayableArea, Squad, Operator, Hostile) {
    /**
     * Constructor, with class name
     */
    function Map(map, playableAreaCallback, operatorCallback, hostileCallBack) {
        this.playablearea = new PlayableArea();
        this.squads = [];
        this.map = map;
        this.playableAreaCallback = playableAreaCallback;
        this.operatorCallback = operatorCallback;
        this.hostileCallBack = hostileCallBack;
        this.hostiles = [];
    }


    Map.prototype.addHostile = function (hostile) {
        if (!hostile instanceof Hostile) {
            console.log('Trying to add an non Hostile object!!');
        } else {
            this.hostiles[hostile.id] = (hostile);
            if (this.hostileCallBack) {
                this.hostileCallBack(hostile);
            }
        }
    };
    Map.prototype.removeHostile = function (hostile) {
        if (!hostile instanceof Hostile) {
            console.log('Trying to remove an non Hostile object!!');
        }
        this.hostiles.splice(hostile);
    };
    Map.prototype.getHostile = function (hostile) {
        return this.hostiles[hostile];
    };


    Map.prototype.addSquad = function (squad) {
        if (!squad instanceof Squad) {
            console.log('Trying to add an non Squad object!!');
        } else {
            this.squads[squad.id] = (squad);
        }
    };
    Map.prototype.removeSquad = function (squad) {
        if (!squad instanceof Squad) {
            console.log('Trying to remove an non Squad object!!');
        }
        this.squads.splice(squad);
    };
    Map.prototype.getSquad = function (squadId) {
        return this.squads[squadId];
    };
    Map.prototype.setPlayableArea = function (playableareapoints) {
        if (!(playableareapoints instanceof Array)) {
            console.log('Trying to add an non Array object!!');
        } else {
            console.log(this.playablearea);
            var success = this.playablearea.setPoints(playableareapoints);
            if (success && this.playableAreaCallback) {
                this.playableAreaCallback(playableareapoints);
            }
        }
    };
    Map.prototype.addOperator = function (squadId, operator) {
        if (!operator instanceof Operator) {
            console.log('Trying to add an non Operator object!!');
        } else {
            this.squads[squadId].addOperator(operator);
            if (this.operatorCallback) {
                this.operatorCallback(operator, squadId);
            }
        }
    };
    Map.prototype.removeOperator = function (squadId, operator) {
        if (!element instanceof Operator) {
            console.log('Trying to remove an non Operator object!!');
            console.log('Trying to remove an non Operator object!!');
        }
        this.squads[squadId].splice(operator);
    };
    return Map;
});