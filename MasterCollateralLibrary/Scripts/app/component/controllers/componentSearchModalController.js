/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.component')
        .controller('componentSearchModalController', ['$scope', '$uibModalInstance', 'componentService', componentSearchModalController]);

    function componentSearchModalController($scope, $uibModalInstance, componentService) {

        $scope.busy = true;
        $scope.items = [];        
        $scope.selectedItem = {}        
        $scope.total = 0;

        $scope.param = {
            PageSize: 10,
            PageNumber: 1,
            SortBy: 'desc',
            SortDir: 'asc',
            desc: '',
            vendor: '',
            vendorPart: '',
            equiv: ''
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
        };

        function getItems() {            
            componentService.getFind($scope.param)
                .then(function (response) {
                    $scope.items = response.Data;
                    $scope.total = response.Total;
                    $scope.busy = false;
                });
        }

        $scope.setSelected = function (item) {
            $scope.selectedItem = item
        }

        $scope.ok = function () {
            $uibModalInstance.close($scope.selectedItem);           
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();