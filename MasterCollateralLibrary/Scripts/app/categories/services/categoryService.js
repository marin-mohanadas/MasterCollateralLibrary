/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.category')
        .factory('categoryService', ['$http', '$q', 'constants', categoryService]);

    function categoryService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {
            getProduct1Categories: getProduct1Categories,            
            getProduct2Categories: getProduct2Categories,
            getProduct2CategoriesByCat1Id: getProduct2CategoriesByCat1Id,
            getRootCategories: getRootCategories,
            create: create,
            update: update,
            remove: remove,
            getCatFullPath: getCatFullPath,
            getCrossRefTree: getCrossRefTree,
            getParentTreeNodes: getParentTreeNodes,
            getChildrenTreeNodes: getChildrenTreeNodes
        };

        return service;

        function getProduct1Categories() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ProductCategories/Product1Categories')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getProduct2Categories() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ProductCategories/Product2Categories')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getProduct2CategoriesByCat1Id(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'ProductCategories/Product2CategoriesByCat1Id?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getRootCategories() {
            var deferred = $q.defer();
            $http.get(baseUri + 'Categories/GetRootCategories')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function create(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'Categories/Create', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function update(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'Categories/Update?id='+model.id, model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function remove(id) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'Categories/Delete?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getCatFullPath(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'Categories/GetCatFullPath?id='+id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getCrossRefTree(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'Categories/GetCrossRefTree?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getParentTreeNodes() {
            var deferred = $q.defer();
            $http.get(baseUri + 'Categories/GetParentTreeNodes')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getChildrenTreeNodes(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'Categories/GetChildrenTreeNodes?id=' + id)
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