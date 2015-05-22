angular.module('starter.directives', ['ionic'])

    .directive('map', function ($ionicLoading, $ionicPopup, $ionicModal, Map, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                onCreate: '&'
            },
            link: function ($scope, $element) {
                var markerGroups = [];
                var modal;
                var addMarkerEvents = function (map, marker, operatorName, operatorInfo) {
                    marker.bindPopup(new L.Popup().setContent(
                            "<h3 class='balanced-900' style='font-family: captureit;'>" +
                            "<img src='img/ranks/PT/OR-02.png' width='20' height='38' />" +
                            "<span style='font-family: captureit;vertical-align:super;margin-left:5px;'>" + operatorName + "</span>" +
                            "</h3>" +
                            "<p style='font-family: captureit;'>" + operatorInfo + "</p>")
                    );
                };
                var addOperatorMarker = function (operator, squadId) {
                    var coordinates = new L.LatLng(operator.latitude, operator.longitude);
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
                        addMarkerEvents($scope.map.map, marker, operator.nickname, 'Element info');
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
                                            iconSize: new L.Point(0, 0)
                                        });
                                    },
                                    maxClusterRadius: 100
                                });
                            //$scope.map.map.addLayer(markerGroups[squadId]);
                            $scope.layers[squadId] = new L.LayerGroup().addTo($scope.map.map);
                            $scope.control.addOverlay($scope.layers[squadId], "Team");

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
                var addHostileMarker = function (hostile) {
                    var coordinates = new L.LatLng(hostile.latitude, hostile.longitude);
                    if (insidePlayableArea($scope.map, coordinates)) {
                        var marker = new L.Marker(coordinates,
                            {

                                //icon: new L.Icon({iconUrl: 'img/skull_red.png'}),
                                icon: new L.DivIcon({
                                    html: "<div class='pin pin-red' nickname='" + hostile.enemiesNumber + "'></div>",
                                    iconSize: new L.Point(0, 0)
                                }),
                                title: 'Inimigo nas redondezas'
                            }
                        );
                        marker.addTo($scope.map.map);
                        addMarkerEvents($scope.map.map, marker, hostile.enemiesNumber, 'Element info');
                    }
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
                var createPopup = function (options, callback, latLng) {
                    if (options && options instanceof Array && options.length > 0) {
                        var option = options.shift();
                        for (var property in option.options) {
                            if (option.options.hasOwnProperty(property)) {
                                $scope[property] = option.options[property];
                            }
                        }
                        $ionicModal.fromTemplateUrl(option.templateUrl, {
                            scope: $scope,
                            animation: 'slide-in-up'
                        }).then(function (modal) {
                            callback(modal);
                            console.log(latLng);
                            if (latLng) {
                                $scope.latLng = latLng
                            }
                        });
                    }
                };
                var drawLines = function (points) {
                    var gameArea = new L.Polygon(points, {color: 'red'}).addTo($scope.map.map);
                    $scope.control.addOverlay(gameArea, "Game Area");
                };
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
                var onEnemiesPopupSelected = function (value) {
                    $scope.enemiesNumber = value;
                    modal.hide();
                    if ($scope.enemiesNumber !== undefined) {
                        createPopup([{
                                templateUrl: 'templates/enemies_modal.html', options: {
                                    title: 'Sighted Enemies Direction',
                                    btns: [[
                                        {
                                            label: 'NE',
                                            value: 'NE',
                                            className: 'btn-direction-ne',
                                            hideLabel: true
                                        },
                                        {
                                            label: 'N',
                                            value: 'N',
                                            className: 'btn-direction-n',
                                            hideLabel: true
                                        },
                                        {
                                            label: 'NW',
                                            value: 'NW',
                                            className: 'btn-direction-nw',
                                            hideLabel: true
                                        }
                                    ], [
                                        {
                                            label: 'E',
                                            value: 'E',
                                            className: 'btn-direction-e',
                                            hideLabel: true
                                        },
                                        {
                                            label: 'C',
                                            value: 'C',
                                            className: 'btn-direction-c',
                                            hideLabel: true
                                        },
                                        {
                                            label: 'W',
                                            value: 'W',
                                            className: 'btn-direction-w',
                                            hideLabel: true
                                        },
                                    ], [
                                        {
                                            label: 'SE',
                                            value: 'SE',
                                            className: 'btn-direction-se',
                                            hideLabel: true
                                        },
                                        {
                                            label: 'S',
                                            value: 'S',
                                            className: 'btn-direction-s',
                                            hideLabel: true
                                        },
                                        {
                                            label: 'SW',
                                            value: 'SW',
                                            className: 'btn-direction-sw',
                                            hideLabel: true
                                        },
                                    ], [
                                        {
                                            label: 'Cancel',
                                            className: 'btn-cancel'
                                        }
                                    ]],
                                    onclick: function (value) {
                                        if ($scope.enemiesNumber && value) {
                                            $rootScope.$broadcast('enemyDetected', {
                                                latitude: $scope.latLng.lat,
                                                longitude: $scope.latLng.lng,
                                                enemiesNumber: $scope.enemiesNumber,
                                                direction: value
                                            })
                                        }
                                        modal.hide();
                                        modal.remove();
                                    },
                                    stylesheets: [{href: 'css/directions.css', type: 'text/css'}]
                                }
                            }],
                            function (_modal) {
                                if (modal) {
                                    modal.remove();
                                }
                                (modal = _modal).show();
                            });
                    } else {
                        modal.remove();
                    }
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
                    if ($scope.viewMode !== undefined) {
                        $scope.viewMode.setOperator($scope.myLocation.getLatLng());
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
                    $scope.map = new Map(new L.Map($element[0], mapOptions), drawLines, addOperatorMarker, addHostileMarker);
                    var googleLayerSattelite = new L.Google('SATELLITE');
                    var googleLayerRoadMap = new L.Google('ROADMAP');
                    var googleLayerHybrid = new L.Google('HYBRID');
                    var googleLayerTerrain = new L.Google('TERRAIN');
                    $scope.layers = [];
                    $scope.control = L.control.layers({
                        "Hybrid": googleLayerHybrid,
                        "RoadMap": googleLayerRoadMap,
                        "Satellite": googleLayerSattelite,
                        "Terrain": googleLayerTerrain
                    });
                    $scope.control.setPosition('bottomright');
                    $scope.control.addTo($scope.map.map);
                    $scope.map.map.addControl(new L.Control.Compass());
                    $scope.map.map.addLayer(googleLayerSattelite, {
                        maxZoom: 22,
                        minZoom: 11
                    });
                    $scope.onCreate({map: $scope.map});
                    $scope.map.map.on('click', function (e) {
                            var latLng = new L.LatLng(e.latlng.lat, e.latlng.lng);
                            if (insidePlayableArea($scope.map, latLng)) {
                                createPopup([{
                                        templateUrl: 'templates/enemies_modal.html', options: {
                                            title: 'Sighted Enemies Number',
                                            btns: [[
                                                {label: '1', value: '1'},
                                                {label: '2', value: '2'},
                                            ], [
                                                {label: '2-3', value: '2-3'},
                                                {label: '3-5', value: '3-5'},
                                            ], [
                                                {label: '5-7', value: '5-7'},
                                                {label: '+7', value: '+7'},
                                            ], [
                                                {label: 'Cancel', className: 'btn-direction-cancel'}
                                            ]],
                                            onclick: onEnemiesPopupSelected,
                                            stylesheets: [{href: 'css/enemies.css', type: 'text/css'}]
                                        }
                                    }],
                                    function (_modal) {
                                        (modal = _modal).show();
                                    }, latLng);
                            }
                        }
                    );
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
    }
)
;
