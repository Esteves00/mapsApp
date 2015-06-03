angular.module('starter.controllers', ['starter.services'])
    .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout) {
        // Form data for the login modal
        $scope.loginData = {};
        $scope.isExpanded = false;
    })
    .controller('LoginCtrl', function ($scope, $state, $timeout, $stateParams, $ionicSideMenuDelegate, $ionicPopup, LoginService) {
        $ionicSideMenuDelegate.canDragContent(false);
        //ionic.material.ink.displayEffect();
        $scope.login = {
            email: "user",
            password: "secret"
        };
        $scope.showPopup = function () {
            $scope.submitted = true;
            $ionicPopup.show({
                title: "Login falhado!",
                template: 'Por favor, confirme as suas credenciais!',
                scope: $scope,
                buttons: [{
                    text: "OK",
                    type: 'button-flat button-balanced-900',
                    onTap: function (e) {
                        $scope.submitted = false;
                    }
                }]
            });
        };
        $scope.signIn = function (form) {
            if (form.$valid) {
                LoginService.loginUser($scope.login.email, $scope.login.password).success(function (data) {
                    $state.go('app.map');
                }).error(function (data) {
                    $scope.showPopup();
                });
            }
        };

    })
    .controller('ProfileCtrl', function ($scope, $ionicLoading, $stateParams, $timeout, $firebaseArray, $ionicPopup, Map, Squad, Operator, Specialization) {

    })
    .controller('MapCtrl', function ($scope, $ionicLoading, $stateParams, $timeout, $firebaseArray, $ionicPopup, Map, Squad, Operator, Specialization, Hostile, $ionicSideMenuDelegate, CoordinatesConverter) {
        $ionicSideMenuDelegate.canDragContent(false);
        var ref = new Firebase("https://torrid-heat-5220.firebaseio.com/teams/");
        $scope.mapCreated = function (map) {
            $scope.map = map;
            $scope.map.addSquad(new Squad(1));


            var requestResult = [
                {lat_c: "N", lat_d: 39, lat_m: 44, lat_s: 58.57, lng_c: "W", lng_d: 8, lng_m: 48, lng_s: 42.76},
                {lat_c: "N", lat_d: 39, lat_m: 44, lat_s: 50.08, lng_c: "W", lng_d: 8, lng_m: 48, lng_s: 33.8},
                {lat_c: "N", lat_d: 39, lat_m: 44, lat_s: 6.28, lng_c: "W", lng_d: 8, lng_m: 48, lng_s: 57.31},
                {lat_c: "N", lat_d: 39, lat_m: 43, lat_s: 30.24, lng_c: "W", lng_d: 8, lng_m: 47, lng_s: 19.96},
                {lat_c: "N", lat_d: 39, lat_m: 42, lat_s: 15.13, lng_c: "W", lng_d: 8, lng_m: 44, lng_s: 42.23},
                {lat_c: "N", lat_d: 39, lat_m: 42, lat_s: 17.7, lng_c: "W", lng_d: 8, lng_m: 42, lng_s: 42.34},
                {lat_c: "N", lat_d: 39, lat_m: 44, lat_s: 49.28, lng_c: "W", lng_d: 8, lng_m: 41, lng_s: 53.72},
                {lat_c: "N", lat_d: 39, lat_m: 45, lat_s: 47.75, lng_c: "W", lng_d: 8, lng_m: 46, lng_s: 7.38},
                {lat_c: "N", lat_d: 39, lat_m: 44, lat_s: 58.57, lng_c: "W", lng_d: 8, lng_m: 48, lng_s: 42.47}
            ];
            var coordinates = []; //LatLng
            var converter = new CoordinatesConverter();
            angular.forEach(requestResult, function (coordinate) {
                converter.latitude.setDMS(coordinate.lat_d, coordinate.lat_m, coordinate.lat_s, coordinate.lat_c);
                converter.longitude.setDMS(coordinate.lng_d, coordinate.lng_m, coordinate.lng_s, coordinate.lng_c);
                coordinates.push(new L.LatLng(converter.getLatitude(), converter.getLongitude()));
            });
            $scope.map.setPlayableArea(coordinates);
            $scope.data = $firebaseArray(ref);
            $scope.$on('hostileUpdated', function (event, operator) {
                console.log(operator);
            });
            $scope.$on('notificationCreated', function (event, marker) {
                $scope.data.$add({
                    markerId: marker.markerId,
                    position: {
                        latitude: marker.latLng.lat,
                        longitude: marker.latLng.lng
                    },
                    info: marker.info
                }).then(function () {
                    alert('Profile saved to Firebase!');
                }).catch(function (error) {
                    alert('Error!');
                });
            });
            $scope.$on('enemyDetected', function (event, hostile) {
                console.log(hostile);
                $scope.map.addHostile(new Hostile(hostile.latitude, hostile.longitude, hostile.enemiesNumber, hostile.direction));
                //alert("Hostile Number:" + hostile.enemiesNumber + "\nDirection: " + hostile.direction);
            });
            ref.on('child_added', function (child) {
                var mk = child.val();
                $scope.map.addOperator(1, new Operator(mk.id, mk.nickname, mk.position.latitude, mk.position.longitude, Specialization.get(mk.specialization)));
                //var marker = new L.Marker(new L.LatLng(mk.position.latitude, mk.position.longitude),
                //    {
                //        //map: $scope.map,
                //        id: mk.markerId,
                //        icon: new L.Icon({iconUrl: 'img/skull_red.png'}),
                //        title: 'Inimigo nas redondezas'
                //    }
                //);
                //marker.addTo($scope.map.map);
            });
            ref.on('child_removed', function _remove(snap) {
                console.log('2');
                console.log(snap);
            });
            ref.on('child_changed', function _change(snap) {
                console.log('3');
                console.log(snap);
            });
            ref.on('child_moved', function _move(snap, prevChild) {
                console.log('4');
                console.log(snap);
                console.log(prevChild);
            });
        };
    })
    .controller('ZoneCtrl', function ($scope, $ionicLoading, $stateParams, $timeout, $firebaseArray, $ionicPopup, Map, Squad, Operator, Specialization, Hostile) {

        $scope.mapCreated = function (map) {
            $scope.map = map;
        }
    });
