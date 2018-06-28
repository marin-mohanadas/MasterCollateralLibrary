/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.category')
        .controller('categoriesIndexController', ['$scope', '$uibModal', 'categoryService', categoriesIndexController]);

    function categoriesIndexController($scope, $uibModal, categoryService) {

        $scope.busy = true;
        $scope.items = [];

        categoryService.getRootCategories()
            .then(function (response) {                
                $scope.items = response;
                $scope.busy = false;                
            });

        $scope.collapseAll = function () {
            $scope.$broadcast('angular-ui-tree:collapse-all');
        };

        $scope.expandAll = function () {
            $scope.$broadcast('angular-ui-tree:expand-all');
        };

        $scope.toggle = function (scope) {
            scope.toggle();
        };

        $scope.removeCat = function (scope) {            
            var id = scope.$nodeScope.$modelValue.id;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: id }
                }
            });

            modalInstance.result.then(function (item) {                                
                categoryService.remove(item.val)
                    .then(function (response) {
                        if (response === true) {
                            scope.remove();
                        }
                    });                
            }, function () {

            });
        };

        $scope.newSubItem = function (scope) {
            var nodeData = scope.$modelValue;
            
            var cat = {
                id: 0,
                cat_desc: '',
                parent_id: nodeData.id,
                children: []
            };

            //console.log('before');
            //console.log(cat);

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/categories/views/categoryAddModal.html',
                controller: 'categoryAddModalController',
                size: 'sm',
                resolve: {
                    item: cat
                }
            });

            modalInstance.result.then(function (item) {              
                //console.log('after')
                //console.log(item);
                nodeData.children.push(item);
                
            }, function () {

            });            
        };

        $scope.updateCat = function (scope) {
            var nodeData = scope.$modelValue;
            
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/categories/views/categoryAddModal.html',
                controller: 'categoryAddModalController',
                size: 'sm',
                resolve: {
                    item: nodeData
                }
            });

            modalInstance.result.then(function (item) {
                nodeData.cat_desc = item.cat_desc;
            }, function () {

            });
        };

        $scope.treeOptions = {
            //accept: function (sourceNodeScope, destNodesScope, destIndex) {
            //    return false;
            //}

            beforeDrop: function (e) {

                // todo: allow to move node to root. check $nodeScope and clear out parent_id
                //console.log(e.dest.nodesScope.$nodeScope.$modelValue);
                if (e.dest.nodesScope.$nodeScope === null
                    || e.dest.nodesScope.$nodeScope.$modelValue === null) {
                    return false;
                }

                var sourceValue = e.source.nodeScope.$modelValue;
                var destValue = e.dest.nodesScope.$nodeScope.$modelValue;

                //console.log(sourceValue);
                //console.log(destValue);
                
                if (sourceValue !== undefined && sourceValue.id > 0 && destValue !== undefined) {
                    sourceValue.parent_id = destValue.id;
                    console.log(sourceValue);
                    categoryService.update(sourceValue)
                        .then(function (response) {
                            console.log(response);
                            if (response === true) {
                                return true;
                            }
                            return false;
                        });
                } else {
                    return false;
                }
            }
        };
    }
})();