

(function () {
    'use strict'

    angular
        .module('app.salesReps')
        .factory('salesRepsService', ['$http', '$q', 'constants', salesRepsService]);

    function salesRepsService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {           
            getFind: getFind,
            getRepEdit: getRepEdit,
            updateRep: updateRep,
            createRep: createRep
        };

        return service;

        function getFind(param) {
            var deferred = $q.defer();
            $http.post(baseUri + 'SalesReps/Find', param)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function getRepEdit(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'SalesReps/GetRepEdit?id=' + id)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function updateRep(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'SalesReps/Update', model)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }


        function createRep(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'SalesReps/SaveNew', model)
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