angular.module('starter.playablearea', []).factory('PlayableArea', function ($rootScope) {

    /**
     * Constructor, with class name
     */
    function PlayableArea() {
        this.points = [];
    }

    PlayableArea.prototype.setPoints = function (playableareapoints) {
        var pointsAux = [];
        for (var i = 0; i < playableareapoints.length; i++) {
            var point = playableareapoints[i];
            if (!(point instanceof L.LatLng)) {
                console.log('Trying to add an non L.LatLng object!!');
                return false;
            } else {
                pointsAux[i] = point;
            }
        }
        this.points = pointsAux;
        return true;
    };
    return PlayableArea;
});