angular.module('hudModule', [])
    .controller('HudController', function ($scope, $rootScope) {
        $scope.$on('operatorAdded', function (v, i) {
            console.log(i);
        });
        $scope.$on("userPositionUpdated", function () {
            console.log(arguments);
        });

//  $rootScope.$broadcast("kajshd", true);

        var test_config = {
            bg_color: "rgba(220, 220, 220, 0.7)",
            fg_color: "rgba(120, 120, 120, 0.9)",
            type: "mf", // h=hidden, m=mini, f=full > hmf, hf, mf
            compass: {
                extend_lines: true,
                lines_color: "rgba(180, 180, 180, 0.6)",
                height: 30,
                fov: 270,
                scaling: "sin"
            },
            ruler: {
                lines_color: "rgba(180, 180, 180, 0.6)",
                height: 120,
                //  max_dist: 1500,
                //  scaling: "linear",
                //  steps: 5
                scaling: "steps",
                steps: [10, 100, 1000, 10000]
                // add spline interpolation http://blog.ivank.net/interpolation-with-cubic-splines.html
            }
        };

        $scope.init = function () {
            new Hud(test_config);
        };

        DEBUG = true;


        // Credit to http://blog.mackerron.com/2011/01/01/javascript-cubic-splines/
        var CubicSpline, MonotonicCubicSpline;
        MonotonicCubicSpline = function () {
            function p(f, d) {
                var e, k, h, j, b, l, i, a, g, c, m;
                i = f.length;
                h = [];
                l = [];
                e = [];
                k = [];
                j = [];
                a = [];
                b = 0;
                for (g = i - 1; 0 <= g ? b < g : b > g; 0 <= g ? b += 1 : b -= 1) {
                    h[b] = (d[b + 1] - d[b]) / (f[b + 1] - f[b]);
                    if (b > 0)l[b] = (h[b - 1] + h[b]) / 2
                }
                l[0] = h[0];
                l[i - 1] = h[i - 2];
                g = [];
                b = 0;
                for (c = i - 1; 0 <= c ? b < c : b > c; 0 <= c ? b += 1 : b -= 1)h[b] === 0 && g.push(b);
                c = 0;
                for (m = g.length; c < m; c++) {
                    b = g[c];
                    l[b] = l[b + 1] = 0
                }
                b = 0;
                for (g = i - 1; 0 <= g ? b < g : b > g; 0 <= g ? b += 1 : b -= 1) {
                    e[b] = l[b] / h[b];
                    k[b] = l[b + 1] / h[b];
                    j[b] = Math.pow(e[b], 2) + Math.pow(k[b], 2);
                    a[b] = 3 / Math.sqrt(j[b])
                }
                g = [];
                b = 0;
                for (c = i - 1; 0 <= c ? b < c : b > c; 0 <= c ? b += 1 : b -= 1)j[b] > 9 && g.push(b);
                j = 0;
                for (c = g.length; j < c; j++) {
                    b = g[j];
                    l[b] = a[b] * e[b] * h[b];
                    l[b + 1] = a[b] * k[b] * h[b]
                }
                this.x = f.slice(0, i);
                this.y = d.slice(0, i);
                this.m = l
            }

            p.prototype.interpolate = function (f) {
                var d, e, k, h;
                for (e = d = this.x.length - 2; d <= 0 ? e <= 0 : e >= 0; d <= 0 ? e += 1 : e -= 1)if (this.x[e] <= f)break;
                d = this.x[e + 1] - this.x[e];
                f = (f - this.x[e]) / d;
                k = Math.pow(f, 2);
                h = Math.pow(f, 3);
                return (2 * h - 3 * k + 1) * this.y[e] + (h - 2 * k + f) * d * this.m[e] + (-2 * h + 3 * k) * this.y[e + 1] + (h - k) * d * this.m[e + 1]
            };
            return p
        }();
        CubicSpline = function () {
            function p(f, d, e, k) {
                var h, j, b, l, i, a, g, c, m, o, n;
                if (f != null && d != null) {
                    b = e != null && k != null;
                    c = f.length - 1;
                    i = [];
                    o = [];
                    g = [];
                    m = [];
                    n = [];
                    j = [];
                    h = [];
                    l = [];
                    for (a = 0; 0 <= c ? a < c : a > c; 0 <= c ? a += 1 : a -= 1)i[a] = f[a + 1] - f[a];
                    if (b) {
                        o[0] = 3 * (d[1] - d[0]) / i[0] - 3 * e;
                        o[c] = 3 * k - 3 * (d[c] - d[c - 1]) / i[c - 1]
                    }
                    for (a = 1; 1 <= c ? a < c : a > c; 1 <= c ? a += 1 : a -= 1)o[a] = 3 / i[a] * (d[a + 1] - d[a]) - 3 / i[a - 1] * (d[a] - d[a - 1]);
                    if (b) {
                        g[0] = 2 * i[0];
                        m[0] = 0.5;
                        n[0] = o[0] / g[0]
                    } else {
                        g[0] = 1;
                        m[0] = 0;
                        n[0] = 0
                    }
                    for (a = 1; 1 <= c ? a < c : a > c; 1 <= c ? a += 1 : a -= 1) {
                        g[a] = 2 * (f[a + 1] - f[a - 1]) - i[a - 1] * m[a - 1];
                        m[a] = i[a] / g[a];
                        n[a] = (o[a] - i[a - 1] * n[a - 1]) / g[a]
                    }
                    if (b) {
                        g[c] = i[c - 1] * (2 - m[c - 1]);
                        n[c] = (o[c] - i[c - 1] * n[c - 1]) / g[c];
                        j[c] = n[c]
                    } else {
                        g[c] = 1;
                        n[c] = 0;
                        j[c] = 0
                    }
                    for (a = e = c - 1; e <= 0 ? a <= 0 : a >= 0; e <= 0 ? a += 1 : a -= 1) {
                        j[a] = n[a] - m[a] * j[a + 1];
                        h[a] = (d[a + 1] - d[a]) / i[a] - i[a] * (j[a + 1] + 2 * j[a]) / 3;
                        l[a] = (j[a + 1] - j[a]) / (3 * i[a])
                    }
                    this.x = f.slice(0, c + 1);
                    this.a = d.slice(0, c);
                    this.b = h;
                    this.c = j.slice(0, c);
                    this.d = l
                }
            }

            p.prototype.derivative = function () {
                var f, d, e, k, h;
                d = new this.constructor;
                d.x = this.x.slice(0, this.x.length);
                d.a = this.b.slice(0, this.b.length);
                h = this.c;
                e = 0;
                for (k = h.length; e < k; e++) {
                    f = h[e];
                    d.b = 2 * f
                }
                h = this.d;
                e = 0;
                for (k = h.length; e < k; e++) {
                    f = h[e];
                    d.c = 3 * f
                }
                f = 0;
                for (e = this.d.length; 0 <= e ? f < e : f > e; 0 <= e ? f += 1 : f -= 1)d.d = 0;
                return d
            };
            p.prototype.interpolate = function (f) {
                var d, e;
                for (d = e = this.x.length - 1; e <= 0 ? d <= 0 : d >= 0; e <= 0 ? d += 1 : d -= 1)if (this.x[d] <= f)break;
                f = f - this.x[d];
                return this.a[d] + this.b[d] * f + this.c[d] * Math.pow(f, 2) + this.d[d] * Math.pow(f, 3)
            };
            return p
        }();

        var test_data = {
            self_pos: {
                x: 0,
                y: 0
            },
            facing: 0,
            points: [
                {
                    pos: {
                        x: 5, y: 5
                    },
                    type: "test"
                }
            ]
        };

        var compass_points = {
            0: {
                height: 50,
                name: "N"
            },
            45: {
                height: 40,
                name: "NE"
            },
            90: {
                height: 50,
                name: "E"
            },
            135: {
                height: 40,
                name: "SE"
            },
            180: {
                height: 50,
                name: "S"
            },
            225: {
                height: 40,
                name: "SW"
            },
            270: {
                height: 50,
                name: "W"
            },
            315: {
                height: 40,
                name: "NW"
            }
        };

        var requestAnimFrame =
                window.requestAnimationFrame
                || window.webkitRequestAnimationFrame
                || window.mozRequestAnimationFrame
                || window.oRequestAnimationFrame
                || window.msRequestAnimationFrame
                || function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                }
            ;

        var alphaToX = function (a, dir, w, fov, applySin) {
            // get position relative to width
            var k = (a - dir);
            if (k < -360 / 2) // -360? need fix
                k += 360;
            if (k > 360 / 2)
                k -= 360
            var rel = k / fov;
            if (rel < -0.5 || rel > 0.5)
                return;

            if (applySin)
                rel = -1 * Math.sin(Math.toRad(180 * rel)) / 2;

            return w / 2 + rel * w;
        };

        var getDist = function (lat1, lon1, lat2, lon2) {
            // Credit  http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
            var R = 6378100; // Radius of the earth in m
            var dLat = Math.toRad(lat2 - lat1);
            var dLon = Math.toRad(lon2 - lon1);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRad(lat1)) * Math.cos(Math.toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in m
            return d;
        };

        var getAlpha = function (lat1, lon1, lat2, lon2) {
            // http://gis.stackexchange.com/questions/29239/calculate-bearing-between-two-decimal-gps-coordinates
            var startLat = Math.toRad(lat1);
            var startLong = Math.toRad(lon1);
            var endLat = Math.toRad(lat2);
            var endLong = Math.toRad(lon2);

            var dLong = endLong - startLong;

            var dPhi = Math.log(math.tan(endLat / 2 + Math.PI / 4) / Math.tan(startLat / 2 + Math.PI / 4));
            if (abs(dLong) > Math.PI)
                if (dLong > 0)
                    dLong = -(2 * Math.PI - dLong);
                else
                    dLong = (2 * Math.PI + dLong);
            var alpha = (Math.degrees(Math.atan2(dLong, dPhi)) + 360) % 360;
            return alpha;
        };

        Math.toRad = function (deg) {
            return deg * (Math.PI / 180)
        };
        Math.toDeg = function (rad) {
            return rad * (180 / Math.PI)
        };

        var Compass = function (cntx, conf, points, hud) {
            this.cntx = cntx;
            this.conf = conf;
            this.points = points;
            this.hud = hud;
            this.smoothingFactor = 0.9;
            this.lastSin = 0;
            this.lastCos = 0;
            this.compassOptions = {
                filter: 3
            };

            this.lastChange = 0;
            this.oldDir = 0;
            this.newDir = 0;
            window.addEventListener("deviceorientation", this.onHtmlOrientationEvent.bind(this));
            document.addEventListener("deviceready", function () {
                if (navigator.compass) {
                    console.log(this, this.onCordovaOrientationEvent);
                    var watchID = navigator.compass.watchHeading(this.onCordovaOrientationEvent.bind(this), console.error, this.compassOptions);
                    window.removeEventListener("deviceorientation", this.onHtmlOrientationEvent.bind(this));
                }
            }.bind(this));
        };
        Compass.prototype.getAngle = function () {
            // Smoothing based on delta time
            var ttr = 400;
            var sinceLastChange = Date.now() - this.lastChange;
            var d = sinceLastChange / ttr;
            if (d > 1)
                d = 1;
            return Math.toDeg(this.oldDir + (Math.sin(d * Math.PI / 2)) * (this.newDir - this.oldDir));
        };
        Compass.prototype.onSensorChanged = function (angle) {
            this.oldDir = this.newDir;
            this.newDir = angle;
            this.lastChange = Date.now();
        };

        Compass.prototype.onHtmlOrientationEvent = function (event) {
            // Simulate cordova's plugin filter option
            if (this.compassOptions.filter && Math.abs(event.alpha - this.getAngle()) >= this.compassOptions.filter) {
                this.onSensorChanged(Math.toRad(event.alpha));
            }
        };
        Compass.prototype.onCordovaOrientationEvent = function (heading) {
            this.onSensorChanged(Math.toRad(heading.magneticHeading));
        };
        Compass.prototype.draw = function () {
            var alpha = this.getAngle();
            var w = this.cntx.canvas.width;
            var h = this.cntx.canvas.height;

            if (DEBUG) {
                this.cntx.save();
                this.cntx.fillStyle = "rgba(255,0,0,1)";
                this.cntx.fillText("Dir: " + alpha, w / 2, h / 2);
                this.cntx.restore();
            }
            // draw compass separator
            this.cntx.beginPath();
            this.cntx.moveTo(0, h - this.conf.compass.height);
            this.cntx.lineTo(w, h - this.conf.compass.height);
            this.cntx.stroke();
            // draw compass points lines

            Object.keys(this.points).forEach(function (a) {
                var x = alphaToX(a, alpha, w, this.conf.compass.fov, this.conf.compass.scaling === "sin");
                if (x === null)
                    return;
                this.cntx.beginPath();
                this.cntx.moveTo(x, h - this.conf.compass.height);
                this.cntx.lineTo(x, h - this.conf.compass.height + (this.conf.compass.height * this.points[a].height / 100));
                this.cntx.stroke();

                if (this.points[a].name) {
                    this.cntx.fillText(this.points[a].name, x, h - 5);
                }
            }.bind(this));
            if (this.conf.compass.extend_lines) {
                this.cntx.save();
                this.cntx.strokeStyle = this.conf.compass.lines_color;
                Object.keys(this.points).forEach(function (a) {
                    var x = alphaToX(a, alpha, w, this.conf.compass.fov, this.conf.compass.scaling === "sin");
                    if (x === null)
                        return;
                    this.cntx.beginPath();
                    this.cntx.moveTo(x, 0);
                    this.cntx.lineTo(x, h - this.conf.compass.height);
                    this.cntx.stroke();
                }.bind(this));
                this.cntx.restore();
            }
        };

        var Ruler = function (cntx, conf, hud) {
            this.cntx = cntx;
            this.conf = conf;
            this.hud = hud;
        };
        Ruler.prototype.draw = function () {
            if (this.hud.currentState !== "f")
                return;
            var w = this.cntx.canvas.width;
            var h = this.cntx.canvas.height;

            this.cntx.save();
            this.cntx.strokeStyle = this.conf.ruler.lines_color;
            this.cntx.font = "9px Arial";
            this.cntx.textAlign = 'right';

            if (this.conf.ruler.scaling === "linear") {
                for (var i = 0, y = 0; i < this.conf.ruler.steps; i++) {
                    // draw line
                    y = (this.conf.ruler.height / this.conf.ruler.steps) * i;
                    this.cntx.beginPath();
                    this.cntx.stroke();
                    this.cntx.fillText((this.conf.ruler.max_dist / this.conf.ruler.steps) * (this.conf.ruler.steps - i) + "m", w, y + 9);
                }
            }
            if (this.conf.ruler.scaling === "steps") {
                for (var i = 0, y = 0; i < this.conf.ruler.steps.length; i++) {
                    // draw line
                    y = (this.conf.ruler.height / this.conf.ruler.steps.length) * i;
                    this.cntx.beginPath();
                    this.cntx.stroke();
                    this.cntx.fillText(this.conf.ruler.steps[this.conf.ruler.steps.length - i - 1] + "m", w, y + 9);
                }
            }
            this.cntx.restore();
        };
        Ruler.prototype.getY = function () {
            var base = ([0]).concat(this.conf.ruler.steps.map(function (v, i) {
                return i + 1;
            })); // [0, 1, 2, 3, ...]
            var s = new MonotonicCubicSpline(([0]).concat(this.conf.ruler.steps), base);
        };


        var Hud = function (conf, map) {
            this.map = map;
            this.conf = conf;
            this.currentState = this.conf.type === "mf" ? "m" : "h"; //h=hidden, m=mini, f=full
            this.stateMap = {
                "hmf": {
                    "h": {
                        "down": "m",
                    },
                    "m": {
                        "up": "h",
                        "down": "f"
                    },
                    "f": {
                        "up": "m"
                    }
                },
                "mf": {
                    "m": {
                        "down": "f"
                    },
                    "f": {
                        "up": "m"
                    }
                },
                "hf": {
                    "h": {
                        "down": "f"
                    },
                    "f": {
                        "up": "h"
                    }
                }
            };
            this.sizeFrom = document.getElementById("hud_container").parentNode.parentNode;
            this.container = document.getElementById("hud_container");
            this.canvas = document.getElementById("hud_canvas");
            this.canvas.height = 0;
            this.cntx = this.canvas.getContext("2d");

            this.compass = new Compass(this.cntx, this.conf, compass_points, this);
            this.ruler = new Ruler(this.cntx, this.conf, this);

            ionic.onGesture("swipe", this.swipeHandler.bind(this), document);
            if (this.currentState === "m") {
                this.start();
            }
        };
        Hud.prototype.update = function () {
            this.cntx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.cntx.save();
            this.cntx.fillStyle = this.conf.bg_color;
            this.cntx.fillRect(0, 0, this.w, this.h);
            this.cntx.restore();

            this.compass.draw();
            this.ruler.draw();

            if (this.currentState !== "h")
                requestAnimFrame(this.update.bind(this));
        };
        Hud.prototype.start = function () {
            DEBUG && console.log("Hud activated.");

            this.setupCanvas();
            this.setupEvents();
            this.update();
        };
        Hud.prototype.stop = function () {
            DEBUG && console.log("Hud deactivated.");
            window.removeEventListener("resize", this.setupCanvas);
        };
        Hud.prototype.setupEvents = function () {
            window.addEventListener("resize", this.setupCanvas.bind(this));
            window.addEventListener("userPositionUpdated", function (v) {
                console.log(v);
            });
        };
        Hud.prototype.setupCanvas = function () {
            this.setSize();
            this.canvas.width = this.w;
            this.canvas.height = this.h;
            this.cntx.fillStyle = this.conf.fg_color;
            this.cntx.font = "12px Arial";
            this.cntx.lineWidth = 2;
            this.cntx.miterLimit = 3;
            this.cntx.textAlign = 'center';
            this.cntx.strokeStyle = this.conf.fg_color;
        };
        Hud.prototype.setSize = function () {
            console.log(this.sizeFrom, this.sizeFrom.clientWidth);
            this.w = Math.max(this.sizeFrom.clientWidth || 0);
            this.h = 0;
            switch (this.currentState) {
                case 'f':
                    this.h += this.conf.ruler.height;
                case 'm':
                    this.h += this.conf.compass.height;
            }
        };
        Hud.prototype.swipeHandler = function (ev) {
            var oldState = this.currentState;

            this.currentState = this.stateMap[this.conf.type][this.currentState][ev.gesture.direction] || this.currentState;
            this.setupCanvas();

            if (oldState === "h" && this.currentState !== "h")
                this.start();
            if (oldState !== "h" && this.currentState === "h")
                this.stop();
        };

    })
    .directive('hud', function () {
        return {
            restrict: 'E',
            template: "<div id=\"hud_container\" ng-controller=\"HudController\" ng-init=\"init()\" style=\"z-index: 5555;top:0;position:absolute;\">" +
            "<canvas id=\"hud_canvas\"></canvas>" +
            "</div> "
        };
    });