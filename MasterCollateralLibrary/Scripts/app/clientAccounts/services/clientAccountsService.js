

(function () {
    'use strict'

    angular
        .module('app.clientAccounts')
        .factory('clientAccountsService', ['$http', '$q', 'constants', clientAccountsService]);

    function clientAccountsService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {           
            getFind: getFind,
            getClientAccountEdit: getClientAccountEdit,
            updateClientAccount: updateClientAccount,
            createClientAccount: createClientAccount,
            getBrands: getBrands,
            getAccountCategories: getAccountCategories,
            isAccountCodeExists: isAccountCodeExists
        };

        return service;

        function getFind(param) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ClientAccounts/Find', param)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function getClientAccountEdit(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'ClientAccounts/GetRepEdit?id=' + id)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function updateClientAccount(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'ClientAccounts/Update', model)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function createClientAccount(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ClientAccounts/SaveNew', model)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function getBrands() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ClientAccounts/GetBrands')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getAccountCategories() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ClientAccounts/GetAccountCategories')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function isAccountCodeExists(accountCode, excludeId) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ClientAccounts/IsAccountCodeExists', { accountCode, excludeId })
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