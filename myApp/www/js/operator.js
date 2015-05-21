angular.module('starter.operator', []).factory('Operator', function (Specialization) {

    /**
     * Constructor, with class name
     */
    function Operator(username, nickname, latitude, longitude, specialization) {
        this.username = username;
        this.nickname = nickname;
        this.latitude = latitude;
        this.longitude = longitude;
        this.specialization = Specialization.get(specialization); //
    }

    return Operator;
});