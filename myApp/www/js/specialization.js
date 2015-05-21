angular.module('starter.specialization', []).factory('Specialization', function () {

    var specialization = {
        INFANTRY: "img/infantry.png",
        MEDIC: "img/medic.png",
        MAINTENANCE: "img/maintenance.png",
        RECON: "img/recon.png",
        SPECIAL_FORCE: "img/special_force.png",
        SIGNALS: "img/signals.png",
        SOF: "img/sof.png",
        ENGINEER: "img/engineer.png",
        RADAR: "img/radar.png",
        TRANSPORTATION: "IMG/TRANSPORTATION.PNG",
        ARMOVRED: "img/armovred.png",
        ANTI_TANK: "img/anti_tank.png",
        MORTAR: "img/mortar.png",
        GUNNER: "img/mortar.png",
        LOADER: "img/mortar.png",
        ARTELLERY: "img/artellery.png",
        BRIDGING: "img/bridging.png",

    };

    specialization.get = function (key) {
        return specialization[key];
    };


    return specialization;
});