

(function () {
    'use strict'

    angular
        .module('app.boxes')
        .factory('boxesService', ['$http', '$q', 'constants', boxesService]);

    function boxesService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {           
            getFind: getFind,
            //getBrandEdit: getBrandEdit,
            updateBox: updateBox,
            createBox: createBox,
            deleteBox: deleteBox
            
        };

        return service;

        function getFind(param) {
            var deferred = $q.defer();
            $http.post(baseUri + 'Boxes/Find', param)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        //function getBrandEdit(id) {
        //    var deferred = $q.defer();
        //    $http.get(baseUri + 'ProductBrands/GetComponentEdit?id=' + id)
        //        .then(function (response) {
        //                deferred.resolve(response.data);
        //            },
        //            function (err) {
        //                deferred.reject(err);
        //            });
        //    return deferred.promise;
        //}

        function updateBox(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'Boxes/Update', model)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function deleteBox(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'Boxes/Delete?id=' + model.id)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        function createBox(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'Boxes/SaveNew', model)
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