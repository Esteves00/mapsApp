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
            $scope.map.setGameZone(coordinates);
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
    .controller('ZoneCtrl', function ($scope, Map, CoordinatesConverter, CommonStubService, MasterStubService, $controller, $q, $ionicPopup, $rootScope, $ionicModal) {
        $scope.login = function (username, password) {
            MasterStubService.login(username, password)
                .success(function (data) {
                    $scope.loginResult = data.response;
                })
                .error(function (error) {
                    $scope.loginResult = 'Unable to load data: ' + error;
                });
        };
        $scope.getAllMasterZones = function () {
            MasterStubService.getAllMasterZones().success(function (data) {
                if (data.response === 1) {
                    $scope.zones = data.list;
                    $scope.getZoneCoordinates($scope.selectedZone);
                }
            }).error(function (error) {
                $scope.getAllMasterZonesResult = 'Unable to load data: ' + error;
            });
        };
        $scope.selectedZone = undefined;
        $scope.selectedZoneType = undefined;
        $scope.zoneInEdition = {color:'#ff0000'};
        $scope.zoneTypeInEdition = {};
        $scope.getAllZoneTypes = function () {
            MasterStubService.getAllZoneTypes().success(function (data) {
                if (data.response === 1) {
                    $scope.zoneTypes = data.list;
                }
            }).error(function (error) {
                $scope.error = 'Unable to load data: ' + error;
            });
        };
        $scope.mapCreated = function (map) {
            $scope.map = map;
            //angular.extend(this, $controller('CommonController', {$scope: $scope}));
            //angular.extend(this, $controller('MasterController', {$scope: $scope}));


            $scope.login('master01@socom.com', 'master01');
            $scope.getAllZoneTypes();
            $scope.getAllMasterZones();

        };
        $scope.getZoneType = function (selectedZoneType) {
            $scope.zoneTypeInEdition.id = selectedZoneType;
        };
        $scope.getZoneCoordinates = function (selectedZone) {
            $scope.selectedZone = selectedZone;
            //TODO: refresh controls
            if ($scope.map.map.hasLayer($scope.currentLayer)) {
                $scope.map.map.removeLayer($scope.currentLayer);
            }
            $scope.selectedzoneCoordinates = []; //LatLng
            if ($scope.currentLayer) {
                $scope.map.map.removeLayer($scope.currentLayer);
            }
            if (selectedZone != undefined && selectedZone != null) {
                MasterStubService.getZoneCoordByMasterZoneId(selectedZone).success(function (data) {
                    if (data.response === 1) {
                        var converter = new CoordinatesConverter();
                        $scope.selectedzoneCoordinates = [];
                        angular.forEach(data.list, function (coordinate) {
                            converter.latitude.setDMS(coordinate.lat_d, coordinate.lat_m, coordinate.lat_s, coordinate.lat_c);
                            converter.longitude.setDMS(coordinate.lng_d, coordinate.lng_m, coordinate.lng_s, coordinate.lng_c);
                            $scope.selectedzoneCoordinates.push(new L.LatLng(converter.getLatitude(), converter.getLongitude()));
                        });
                        console.log($scope.selectedzoneCoordinates);
                        if ($scope.selectedzoneCoordinates.length > 0) {
                            $scope.currentLayer = new L.Polygon($scope.selectedzoneCoordinates, {color: 'red'});
                            $rootScope.$broadcast('layerAdded', $scope.currentLayer);
                        } else {
                            $rootScope.$broadcast('layerRemoved');
                        }
                        $scope.zoneInEdition = {color:'#ff0000'};
                        angular.forEach($scope.zones, function (zone) {
                            if (zone.id == selectedZone) {
                                $scope.zoneInEdition = angular.copy(zone);
                                if ($scope.zoneInEdition.capture_points !== undefined) {
                                    $scope.zoneInEdition.capture_points = parseInt($scope.zoneInEdition.capture_points);
                                }
                            }
                        });
                        $scope.getZoneType($scope.zoneInEdition.zone_id);
                    }
                });
            }
            else {
                $scope.zoneInEdition = {color:'#ff0000'};
                $scope.zoneTypeInEdition = {};
                $rootScope.$broadcast('layerRemoved');
            }
        };
        $scope.$on('zoneDefined', function (event, layer) {
            angular.forEach(layer.getLatLngs(), function (coordinate) {
                var converter = new CoordinatesConverter();
                converter.setLatitude(coordinate.lat);
                converter.setLongitude(coordinate.lng);
                var coord = {
                    lat_c: converter.latitude.getDirection(),
                    lat_d: converter.latitude.getDegrees(),
                    lat_m: converter.latitude.getMinutes(),
                    lat_s: converter.latitude.getSecondsDecimal(),
                    lng_c: converter.longitude.getDirection(),
                    lng_d: converter.longitude.getDegrees(),
                    lng_m: converter.longitude.getMinutes(),
                    lng_s: converter.longitude.getSecondsDecimal()
                };
                $scope.selectedzoneCoordinates.push(coord);
            });
            $scope.currentLayer = layer;
            $rootScope.$broadcast('layerAdded', $scope.currentLayer);
        });
        $scope.$on('zoneUpdated', function (event, layer) {
            $scope.selectedzoneCoordinates = [];
            angular.forEach(layer.getLatLngs(), function (coordinate) {
                var converter = new CoordinatesConverter();
                converter.setLatitude(coordinate.lat);
                converter.setLongitude(coordinate.lng);

                var coord = {
                    lat_c: converter.latitude.getDirection(),
                    lat_d: converter.latitude.getDegrees(),
                    lat_m: converter.latitude.getMinutes(),
                    lat_s: converter.latitude.getSecondsDecimal(),
                    lng_c: converter.longitude.getDirection(),
                    lng_d: converter.longitude.getDegrees(),
                    lng_m: converter.longitude.getMinutes(),
                    lng_s: converter.longitude.getSecondsDecimal()
                };
                $scope.selectedzoneCoordinates.push(coord);
            });
            $scope.currentLayer = layer;
            //$rootScope.$broadcast('layerAdded', $scope.currentLayer);
        });
        $scope.save = function () {
            var saveCoords = function (selectedZoneId) {
                console.log(selectedZoneId);
                MasterStubService.getZoneCoordByMasterZoneId(selectedZoneId).success(function (data) {
                    if (data.response === 1) {
                        console.log(data);
                        angular.forEach(data.list, function (coordinate) {
                            MasterStubService.deleteZoneCoord(coordinate.id).success(function (data) {
                                console.log(data);
                            }).error(function (error) {

                            });
                        });
                        angular.forEach($scope.selectedzoneCoordinates, function (coordinate) {
                            MasterStubService.createZoneCoord(
                                selectedZoneId,
                                coordinate.lat_c,
                                coordinate.lat_d,
                                coordinate.lat_m,
                                coordinate.lat_s,
                                coordinate.lng_c,
                                coordinate.lng_d,
                                coordinate.lng_m,
                                coordinate.lng_s)
                                .success(function (data) {
                                }).error(function (error) {
                                });
                        });
                        $scope.getAllZoneTypes();
                        $scope.getAllMasterZones();
                        $scope.getZoneCoordinates($scope.selectedZone);
                    }
                });
            };
            console.log($scope.zoneInEdition.color);
            if ($scope.zoneInEdition.id === undefined) {
                console.log($scope.zoneInEdition);
                console.log($scope.zoneTypeInEdition);
                MasterStubService.createMasterZone($scope.zoneTypeInEdition.id, $scope.zoneInEdition.description, $scope.zoneInEdition.capture_points, $scope.zoneInEdition.color)
                    .success(function (data) {
                        saveCoords(data.response);
                    }).error(function (error) {
                        console.log(error);
                    });
            } else {
                MasterStubService.updateMasterZone($scope.zoneInEdition.id, $scope.zoneTypeInEdition.id, $scope.zoneInEdition.description, $scope.zoneInEdition.capture_points, $scope.zoneInEdition.color)
                    .success(function (data) {
                        saveCoords($scope.zoneInEdition.id);
                    }).error(function (error) {
                        console.log(error);
                    });
            }
        };
        $scope.cancel = function () {
            //TODO: refresh controls
            $scope.zoneInEdition = {color:'#ff0000'};
            $scope.zoneTypeInEdition = {};
            $scope.getZoneCoordinates($scope.selectedZone);
        };
        $scope.removeZone = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: "Confirm removal",
                template: 'If you preceed, the selected zone will be deleted and you will no longer have access to it!',
                scope: $scope
            });
            confirmPopup.then(function (res) {
                if (res) {
                    MasterStubService.deleteMasterZone($scope.selectedZone);
                    $scope.selectedZone = undefined;
                    $scope.selectedZoneType = undefined;
                    $scope.zoneInEdition = {color:'#ff0000'};
                    $scope.zoneTypeInEdition = {};
                    $scope.getAllZoneTypes();
                    $scope.getAllMasterZones();
                    $scope.getZoneCoordinates($scope.selectedZone);
                }
            });
        }

        $scope.manageZoneTypes = function () {
            $ionicModal.fromTemplateUrl("templates/zone_types_modal.html", {
                controller: "ZoneTypeCtrl",
                animation: 'slide-in-up'
            }).then(function (modal) {
                ($scope.modal = modal).show();
            });
        };

        $scope.$on('zoneTypesModalClosed', function () {
            console.log('asdas');
            $scope.getAllZoneTypes();
            $scope.getAllMasterZones();
            $scope.getZoneCoordinates($scope.selectedZone);
            $scope.modal.remove();
        });

    })
    .controller('ZoneTypeCtrl', function ($scope, Map, CoordinatesConverter, CommonStubService, MasterStubService, $controller, $q, $ionicPopup, $rootScope) {
        $scope.getMasterZoneTypes = function () {
            MasterStubService.getMasterDefinedZoneTypes()
                .success(function (data) {
                    $scope.masterZones = data.list;
                })
                .error(function (error) {
                    console.log(error);
                });
        };
        $scope.masterZoneTypeInEdition = {};
        $scope.masterZoneTypeSelected = {};
        $scope.getMasterZoneTypes();
        $scope.getMasterZoneType = function (selectedZoneType) {
            $scope.masterZoneTypeInEdition = selectedZoneType ? {
                id: selectedZoneType.id,
                name: selectedZoneType.name
            } : {
                color: '#ff0000'
            };
        };
        $scope.cancelMasterZoneType = function () {
            $scope.masterZoneTypeInEdition = {};
            angular.forEach($scope.masterZones, function (zoneType) {
                if (zoneType.id == $scope.masterZoneTypeSelected.id) {
                    $scope.getMasterZoneType($scope.masterZoneTypeSelected);
                }
            });
        };
        $scope.saveMasterZoneType = function () {
            if ($scope.masterZoneTypeSelected && $scope.masterZoneTypeInEdition.id && $scope.masterZoneTypeInEdition.id > 0) {
                MasterStubService.updateZoneType($scope.masterZoneTypeInEdition.id, $scope.masterZoneTypeInEdition.name)
                    .success(function (data) {
                        $scope.masterZoneTypeInEdition = {};
                        $scope.masterZoneTypeSelected = {};
                        $scope.getMasterZoneTypes();
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            } else {
                MasterStubService.createZoneType($scope.masterZoneTypeInEdition.name)
                    .success(function (data) {
                        $scope.masterZoneTypeInEdition = {};
                        $scope.masterZoneTypeSelected = {};
                        $scope.getMasterZoneTypes();
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }
        };
        $scope.deleteMasterZoneType = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: "Confirm removal",
                template: 'If you preceed, the selected zone type will be deleted and you will no longer have access to it!',
                scope: $scope
            });
            confirmPopup.then(function (res) {
                if (res) {
                    MasterStubService.deleteZoneType($scope.masterZoneTypeInEdition.id)
                        .success(function (data) {
                            $scope.masterZoneTypeInEdition = {};
                            $scope.masterZoneTypeSelected = {};
                            $scope.getMasterZoneTypes();
                        })
                        .error(function (error) {
                            console.log(error);
                        });
                }
            });

        };
        $scope.closeModal = function () {
            $rootScope.$broadcast('zoneTypesModalClosed');
        };
    });