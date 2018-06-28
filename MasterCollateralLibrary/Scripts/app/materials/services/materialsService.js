

(function () {
    'use strict'

    angular
        .module('app.materials')
        .factory('materialsService', ['$http', '$q', 'constants', materialsService]);

    function materialsService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {           
            getFind: getFind,
            //getBrandEdit: getBrandEdit,
            updateMaterial: updateMaterial,
            deleteMaterial: deleteMaterial,
            createMaterial: createMaterial
            
        };

        return service;

        function getFind(param) {
            var deferred = $q.defer();
            $http.post(baseUri + 'Materials/Find', param)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function deleteMaterial(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'Materials/Delete?id=' + model.id)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        function createMaterial(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'Materials/SaveNew', model)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function updateMaterial(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'Materials/Update', model)
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