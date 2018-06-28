/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.customer')
        .factory('customerService', ['$http', '$q', 'constants', customerService]);

    function customerService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {
            getCustomers: getCustomers,
            getCustomerByid: getCustomerByid,
        };

        return service;

        function getCustomers() {
            var deferred = $q.defer();
            $http.get(baseUri + 'Customers/Customers')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getCustomerByid(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'Customers/GetCustomerByid?id=' + id)
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