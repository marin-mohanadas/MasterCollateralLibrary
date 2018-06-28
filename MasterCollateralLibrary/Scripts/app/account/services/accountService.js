/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.account')
        .factory('accountService', ['$http', '$q', 'constants', accountService]);

    function accountService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {
            find: find,
            get: get,
            create: create,
            update: update,
            roles: roles
        };

        return service;

        function find(param) {
            var deferred = $q.defer();
            $http.post(baseUri + 'Account/Find', param)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function get(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'Account/Get?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function create(param) {
            var deferred = $q.defer();
            $http.post(baseUri + 'Account/Create', param)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function update(param) {
            var deferred = $q.defer();
            $http.put(baseUri + 'Account/Edit', param)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function roles() {
            var deferred = $q.defer();
            $http.get(baseUri + 'Account/Roles')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }
    }

})();