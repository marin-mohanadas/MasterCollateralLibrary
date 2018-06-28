/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('profileService', ['$http', '$q', 'constants', profileService]);

    function profileService($http, $q, constants) {

        var baseUri = constants.baseUri;
        
        var service = {
            getUserProfile: getUserProfile,
            getSalesRepId: getSalesRepId
        };

        return service;

        function getUserProfile() {
            var deferred = $q.defer();
            $http.get(baseUri + 'Account/UserProfile')
                .then(function (response) {
                    deferred.resolve(response.data);                    
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };        

        function getSalesRepId() {
            var deferred = $q.defer();
            getUserProfile()
                .then(function (response) {                    
                    if (response !== '' && response.Claims.length > 0) {
                        for (var i = 0; i < response.Claims.length; i++) {
                            if (response.Claims[i].Key === 'salesrep_id') {
                                deferred.resolve(response.Claims[i].Value);
                            }
                        }
                    }
                });
            return deferred.promise;
        }        
    }

})();