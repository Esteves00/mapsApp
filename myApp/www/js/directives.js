angular.module('starter.directives', ['ionic'])

    .directive('map', function ($ionicLoading, $ionicPopup, Map, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                onCreate: '&'
            },
            link: function ($scope, $element) {
                var markerGroups = [];
                var insidePlayableArea = function (map, latLng) {
                    var lat = latLng.lat, lng = latLng.lng;
                    var inside = false;
                    for (var i = 0, j = map.playablearea.points.length - 1; i < map.playablearea.points.length; j = i++) {
                        var xi = map.playablearea.points[i].lat, yi = map.playablearea.points[i].lng;
                        var xj = map.playablearea.points[j].lat, yj = map.playablearea.points[j].lng;
                        var intersect = ((yi > lng) != (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
                        if (intersect) inside = !inside;
                    }
                    return inside;
                };
                var drawLines = function (points) {
                    var gameArea = new L.Polygon(points, {color: 'red'}).addTo($scope.map.map);
                    $scope.control.addOverlay(gameArea, "Área de Jogo");
                };
                var updateLocation = function (pos) {
                    if ($scope.myLocation) {
                        $scope.myLocation.setLatLng(new L.LatLng(pos.coords.latitude, pos.coords.longitude));
                    } else {
                        $scope.myLocation = new L.Marker(
                            new L.LatLng(pos.coords.latitude, pos.coords.longitude),
                            {
                                title: "Encontra-se aqui",
                                icon: new L.DivIcon({
                                    html: "<div class='pin pin-orange' style='background: #FF5D00 url(\"img/xpto.png\") no-repeat bottom !important' nickname='YOUR_NAME'></div><div class='pulse'></div>",
                                    iconSize: new L.Point(0, 0)
                                })
                            }
                        ).addTo($scope.map.map);
                        addMarkerEvents($scope.map.map, $scope.myLocation, "Encontra-se aqui1", true);
                    }
                    if($scope.viewMode !== undefined){
                        $scope.viewMode.setOperator($scope.myLocation.getLatLng());
                    }
                };
                var addMarkerEvents = function (map, marker, markerInfo, myLocation) {
                    var popup = new L.Popup();
                    var color = (myLocation !== undefined ? 'balanced-900' : 'assertive');
                    popup.setContent("<h3 class='" + color + "' style='font-family: captureit;'>" + marker.title + "</h3>" + "<p style='font-family: captureit;'>" + markerInfo + "</p>");
                    marker.bindPopup(popup);
                    google.maps.event.addListener(marker, 'click', function () {
                        marker.openPopup();
                    });
                    //marker.on('click', function () {
                    //    marker.openPopup();
                    //});
                };
                var centerOnCurrentLocation = function () {
                    if (!$scope.map) {
                        return;
                    }
                    $ionicLoading.show({
                        content: 'Getting current location...',
                        showBackdrop: false
                    });
                    var successCurrentPosition = function (pos) {
                        $scope.map.map.panTo(new L.LatLng(pos.coords.latitude, pos.coords.longitude));
                        updateLocation(pos);
                        $ionicLoading.hide();
                    };
                    var successWatchPosition = function (pos) {
                        updateLocation(pos);
                    };
                    var error = function (error) {
                        $ionicPopup.show({
                            title: "Não foi possível encontrar a localização",
                            template: error.message,
                            scope: $scope,
                            buttons: [{
                                text: "OK",
                                type: 'button-flat button-assertive'
                            }]
                        });
                    };
                    navigator.geolocation.getCurrentPosition(successCurrentPosition, error);
                    navigator.geolocation.watchPosition(successWatchPosition, error);
                };
                var addOperatorMarker = function (operator, squadId, latitude, longitude) {
                    var coordinates = new L.LatLng(latitude, longitude);
                    if (insidePlayableArea($scope.map, coordinates)) {
                        var marker = new L.Marker(coordinates,
                            {
                                id: operator.username,
                                //icon: new L.Icon({iconUrl: 'img/skull_red.png'}),
                                icon: new L.DivIcon({
                                    html: "<div class='pin' style='background: #219710 url(\"img/xpto.png\") no-repeat bottom' nickname='" + operator.nickname + "'></div>",
                                    iconSize: new L.Point(0, 0)
                                }),
                                title: 'Inimigo nas redondezas'
                            }
                        );
                        //marker.addTo($scope.map.map);
                        addMarkerEvents($scope.map.map, marker, 'Element info', false);
                        if (!markerGroups[squadId]) {
                            markerGroups[squadId] = new L.MarkerClusterGroup(
                                {
                                    iconCreateFunction: function (cluster) {
                                        var childCount = $scope.map.getSquad(squadId).operatorsCount();
                                        var srcicon =
                                            childCount == 1 || childCount == 2 ? 'fire_maneuver' :
                                                childCount > 2 && childCount < 6 ? 'fireteam' :
                                                    childCount > 5 && childCount < 11 ? 'patrol' :
                                                        childCount > 9 && childCount < 14 ? 'squad' :
                                                            childCount >= 14 ? 'platoon' : undefined;
                                        return new L.DivIcon({
                                            html: "<div class='pin' style='background: #219710 url(\"img/squads/" + srcicon + ".png\") no-repeat bottom'></div><div class='pulse'></div>",
                                            //html: "<img src='img/squads/" + srcicon + ".png' alt='map icon'/>",
                                            //className: 'marker-cluster ' + c,
                                            iconSize: new L.Point(0, 0)
                                        });
                                    },
                                    maxClusterRadius: 100
                                });
                            //$scope.map.map.addLayer(markerGroups[squadId]);
                            $scope.layers[squadId] = new L.LayerGroup().addTo($scope.map.map);
                            $scope.control.addOverlay($scope.layers[squadId], squadId);

                            $scope.viewMode = L.control.viewmode({
                                operator: $scope.myLocation ? $scope.myLocation.getLatLng() : undefined,
                                squad: markerGroups[squadId]
                            });
                            $scope.viewMode.addTo($scope.map.map);

                        }
                        markerGroups[squadId].addLayer(marker);
                        markerGroups[squadId].addTo($scope.layers[squadId]);
                    }
                };

                function initialize() {
                    var mapOptions = {
                        center: new L.LatLng(43.07493, -89.381388),
                        zoom: 15,
                        zoomControl: true,
                        attributionControl: false,
                        maxZoom: 22,
                        minZoom: 11
                    };
                    $scope.map = new Map(new L.Map($element[0], mapOptions), drawLines, addOperatorMarker);
                    var googleLayer = new L.Google('SATELLITE');
                    $scope.map.map.addLayer(googleLayer, {
                        maxZoom: 22,
                        minZoom: 11
                    });
                    var compass = new L.Control.Compass();
                    $scope.map.map.addControl(compass);
                    $scope.layers = [];
                    $scope.control = L.control.layers();
                    $scope.control.addTo($scope.map.map);
                    //control.setPosition('topleft');
                    $scope.onCreate({map: $scope.map});
                    $scope.map.map.on('touchstart', function (e) {
                        e.originalEvent.preventDefault();
                    });
                    $scope.map.map.on('click', function (e) {
                        var latLng = new L.LatLng(e.latlng.lat, e.latlng.lng);
                        if (insidePlayableArea($scope.map, latLng))
                            var confirmPopup = $ionicPopup
                                .prompt({
                                    title: 'Inimigo nas Redondezas',
                                    template: "Confirma inimigo nas redondezas?",
                                    inputType: 'text',
                                    inputPlaceholder: 'Detalhes adicionais',
                                    cancelText: "Cancelar",
                                    cancelType: "button-light dark-bg",
                                    okText: "Confirmar",
                                    okType: "button button-flat button-balanced-900",
                                    cssClass: 'dialog-map'
                                })
                                .then(function (res) {
                                    if (res !== undefined) {
                                        var marker = new L.Marker(latLng, {
                                            markerId: latLng.lat + '_' + latLng.lng,
                                            info: res,
                                            icon: new L.Icon({iconUrl: 'img/skull_red.png'}),
                                            title: 'Inimigo nas redondezas'
                                        }).addTo($scope.map.map).bindPopup("Encontra-se aqui");
                                        addMarkerEvents($scope.map.map, marker, res);
                                        $rootScope.$broadcast('notificationCreated', {
                                            markerId: latLng.lat + '_' + latLng.lng,
                                            info: res,
                                            latLng: latLng
                                        });
                                    }
                                });
                    });
                    centerOnCurrentLocation();
                }

                if (document.readyState === "complete") {
                    initialize();
                }
                document.addEventListener("deviceready", function () {
                    var so = cordova.plugins.screenorientation;
                    so.setOrientation('landscape');
                    initialize();
                }, false);
            }
        }
    });
