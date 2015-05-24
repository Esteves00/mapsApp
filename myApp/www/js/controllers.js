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
    .controller('MapCtrl', function ($scope, $ionicLoading, $stateParams, $timeout, $firebaseArray, $ionicPopup, Map, Squad, Operator, Specialization) {
        var ref = new Firebase("https://torrid-heat-5220.firebaseio.com/teams/");
        $scope.mapCreated = function (map) {
            $scope.map = map;
            $scope.map.addSquad(new Squad(1));
            $scope.map.setPlayableArea(
                [
                    new L.LatLng(39.749603, -8.81188),
                    new L.LatLng(39.747245, -8.809389),
                    new L.LatLng(39.7350782, -8.8159208),
                    new L.LatLng(39.7250685, -8.7888804),
                    new L.LatLng(39.7042049, -8.7450639),
                    new L.LatLng(39.7049312, -8.7117615),
                    new L.LatLng(39.7470229, -8.6982563),
                    new L.LatLng(39.763266, -8.7687178),
                    new L.LatLng(39.749603, -8.81188)
                ]
            );
            $scope.data = $firebaseArray(ref);
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
            $scope.$on('enemyDetected', function (event, enemy) {
                console.log(enemy);
                alert("Enemies Number:" + enemy.enemiesNumber + "\nDirection: " + enemy.direction);
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
    }
)
;
