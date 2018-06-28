/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.distributor')
        .factory('distributorService', ['$http', '$q', 'constants', distributorService]);

    function distributorService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {            
            getDistributors: getDistributors,  
            getDistributor: getDistributor, 
        };

        return service;        

        function getDistributors() {
            var deferred = $q.defer();
            $http.get(baseUri + 'Distributors/GetDistributors')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };    

        function getDistributor(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'Distributors/GetDistributor?id=' + id)
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