

(function () {
    'use strict'

    angular
        .module('app.packFormulas')
        .factory('packFormulasService', ['$http', '$q', 'constants', packFormulasService]);

    function packFormulasService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {           
            getFind: getFind,
            getFormulaEdit: getFormulaEdit,
            updateFormula: updateFormula,
            createFormula: createFormula
            
        };

        return service;

        function getFind(param) {
            var deferred = $q.defer();
            $http.post(baseUri + 'PackFormulas/Find', param)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function getFormulaEdit(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'PackFormulas/GetFormulaEdit?id=' + id)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function updateFormula(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'PackFormulas/Update', model)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }


        function createFormula(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'PackFormulas/SaveNew', model)
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