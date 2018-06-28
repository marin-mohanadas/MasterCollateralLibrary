/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.productGroup')
        .factory('productGroupService', ['$http', '$q', 'constants', productGroupService]);

    function productGroupService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {
            getProductGroups: getProductGroups,
            find: find,
            getProductGroupDetail: getProductGroupDetail,
            getCeClasses: getCeClasses,
            getTechnicalHeadings: getTechnicalHeadings
        };

        return service;

        function getProductGroups() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ProductGroups/ProductGroups')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function find(pageSize, pageNumber, sortBy, sortDir) {
            var deferred = $q.defer();
            $http.get(baseUri + 'ProductGroups/Find?pageSize=' + pageSize +
                '&pageNumber=' + pageNumber + '&sortBy=' + sortBy + '&sortDir=' + sortDir)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getProductGroupDetail(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'ProductGroups/GetProductGroupDetail?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getCeClasses() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ProductGroups/GetCeClasses')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getTechnicalHeadings() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ProductGroups/GetTechnicalHeadings')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };
    }

})();