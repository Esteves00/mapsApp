angular.module('starter.direction', []).factory('Direction', function () {

    var direction = {
        NORTH_EAST: "ne",
        NORTH : "n",
        NORTH_WEST : "nw",
        EAST : "e",
        CAMPER : "c",
        WEST : "w",
        SOUTH_EAST: "se",
        SOUTH : "s",
        SOUTH_WEST : "sw"
    };

    direction.get = function (key) {
        return direction[key];
    };


    return direction;
});