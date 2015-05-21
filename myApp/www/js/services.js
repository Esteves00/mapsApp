angular.module('starter.services', []).service('LoginService', function ($q) {
    return {
        loginUser: function (name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            if (name == 'user' && pw == 'secret') { //TODO: implement auth mechanism
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        }
    }
}).service('TeamService', function ($q) {
    return {
        loginUser: function (name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            if (name == 'user' && pw == 'secret') { //TODO: implement auth mechanism
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})
;