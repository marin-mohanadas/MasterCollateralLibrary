

(function () {
    'use strict'

    angular
        .module('app.brand')
        .factory('brandService', ['$http', '$q', 'constants', brandService]);

    function brandService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {           
            getFind: getFind,
            getBrandEdit: getBrandEdit,
            updateBrand: updateBrand,
            createBrand: createBrand
        };

        return service;

        function getFind(param) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ProductBrands/Find', param)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function getBrandEdit(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'ProductBrands/GetComponentEdit?id=' + id)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function updateBrand(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'ProductBrands/Update', model)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function createBrand(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ProductBrands/SaveNew', model)
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