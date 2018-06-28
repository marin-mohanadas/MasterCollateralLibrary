/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.component')
        .controller('componentAddACLExceptionModalController', ['$scope', '$uibModalInstance', 'item', 'clientAccountsService', componentAddACLExceptionModalController]);

    function componentAddACLExceptionModalController($scope, $uibModalInstance, item, clientAccountsService) {

        $scope.exists = item.val;
        $scope.msg = item.msg;

        $scope.busy = true;
        $scope.total = 0;
        $scope.numberPages = 0;
        $scope.maxSize = 10;

        //$scope.exists = [];

        if (item !== null && item.length > 0) {
            console.log(item);
            for (var i = 0; i < item.length; i++) {
                $scope.exists.push(item.items[i]);                
            }            
        }
        $scope.items = [];
        $scope.selectedItems = [];

        $scope.param = {
            PageSize: 10,
            PageNumber: 1,
            SortBy: 'desc',
            SortDir: 'asc',
            acct_name: '',
            acct_city: '',
            acct_state: '',
        };

        getItems();

        $scope.pageChanged = function () {
            getItems();
        }

        $scope.filterChanged = function () {
            $scope.param.PageNumber = 1;
            getItems();
        }

        $scope.doSortBy = function (val) {
            if ($scope.param.SortBy === val) {
                $scope.param.SortDir = $scope.param.SortDir === "asc" ? "desc" : "asc";
            } else {
                $scope.param.SortBy = val;
                $scope.param.SortDir = "asc";
            }
            $scope.param.PageNumber = 1;
            getItems();
        }

        $scope.sortIcon = function (val) {
            if ($scope.param.SortBy === val) {
                if ($scope.param.SortDir === 'asc')
                    return 'glyphicon glyphicon-arrow-up';
                else if ($scope.param.SortDir === 'desc')
                    return 'glyphicon glyphicon-arrow-down';
                return '';
            }
        }

        function getItems() {
            clientAccountsService.getFind($scope.param)
                .then(function (response) {
                    $scope.items = response.Data;
                    $scope.total = response.Total;
                    $scope.busy = false;
                    $scope.numberPages = Math.ceil(response.Total / $scope.param.PageSize);
                });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.data = item;
        $scope.ok = function () {
            $uibModalInstance.close($scope.selectedItems);
        };

        $scope.setSelected = function (item) {
            var found = null;
            for (var i = 0; i < $scope.selectedItems.length; i++) {
                if ($scope.selectedItems[i].id === item.id) {
                    found = $scope.selectedItems[i];
                    break;
                }
            }
            if (found === null) {
                for (var i = 0; i < $scope.exists.length; i++) {
                    if ($scope.exists[i].account_id === item.id) {
                        found = $scope.exists[i];
                        break;
                    }
                }
            }
            if (found === null) {
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                item.expiration_date = today;
                $scope.selectedItems.push(angular.copy(item));    
                $scope.dup = null;
            } else {
                $scope.dup = angular.copy(found);
            }
        }
    }

})();