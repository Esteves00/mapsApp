angular.module('starter.hostile', []).factory('Hostile', function (Direction) {

    /**
     * Constructor, with class name
     */
    function Hostile(latitude, longitude, enemiesNumber, direction) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.enemiesNumber = enemiesNumber;
        this.direction = Direction.get(direction);
    }

    return Hostile;
});