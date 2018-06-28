/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.gpo')
        .factory('gpoService', ['$http', '$q', 'constants', gpoService]);

    function gpoService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {
            getGPOs: getGPOs,
            getGPO: getGPO,
            getFind: getFind,
            deletegpo: deletegpo,
            creategpo: creategpo,
            updategpo: updategpo,
        };

        return service;

        function getGPOs() {
            var deferred = $q.defer();
            $http.get(baseUri + 'GPOs/GetGPOs')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getGPO(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'GPOs/GetGPO?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getFind(param) {
            var deferred = $q.defer();
            $http.post(baseUri + 'GPOs/Find', param)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }
        function deletegpo(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'GPOs/Delete?id=' + model.id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function creategpo(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'GPOs/SaveNew', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function updategpo(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'GPOs/Update', model)
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