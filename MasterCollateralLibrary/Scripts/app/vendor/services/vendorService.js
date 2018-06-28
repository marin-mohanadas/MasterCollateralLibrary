/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.vendor')
        .factory('vendorService', ['$http', '$q', 'constants', vendorService]);

    function vendorService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {
            getVendors: getVendors,
            find: find,
            getVendorDetail: getVendorDetail,
            getVendorComponents: getVendorComponents,
            save: save
        };

        return service;

        function getVendors() {
            var deferred = $q.defer();
            $http.get(baseUri + 'Vendors/Vendors')
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
            $http.get(baseUri + 'Vendors/Find?pageSize=' + pageSize +
                '&pageNumber=' + pageNumber + '&sortBy=' + sortBy + '&sortDir=' + sortDir)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getVendorDetail(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'Vendors/Get?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }        

        function getVendorComponents(id, find) {
            var deferred = $q.defer();
            $http.post(baseUri + 'Vendors/GetVendorComponents?id=' + id, find)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }        

        function save(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'Vendors/Save', model)
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