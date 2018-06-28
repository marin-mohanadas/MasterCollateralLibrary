/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.vendor')
        .controller('vendorSearchModalController', ['$scope', '$uibModalInstance', 'vendorService', vendorSearchModalController]);

    function vendorSearchModalController($scope, $uibModalInstance, vendorService) {

        $scope.busy = true;
        $scope.items = [];
        $scope.selectedItem = {};
        $scope.pageSize = 10;
        $scope.pageNumber = 1;
        $scope.sortBy = 'id';
        $scope.sortDir = 'asc';
        $scope.total = 0;

        getItems();

        $scope.pageChanged = function () {
            getItems();
        }

        $scope.doSortBy = function (val) {
            if ($scope.sortBy === val) {
                $scope.sortDir = $scope.sortDir === "asc" ? "desc" : "asc";
            } else {
                $scope.sortBy = val;
                $scope.sortDir = "asc";
            }
            $scope.pageNumber = 1;
            getItems();
        }

        $scope.sortIcon = function (val) {
            if ($scope.sortBy === val) {
                if ($scope.sortDir === 'asc')
                    return 'glyphicon glyphicon-arrow-up';
                else if ($scope.sortDir === 'desc')
                    return 'glyphicon glyphicon-arrow-down';
                return '';
            }
        };

        function getItems() {
            vendorService.find($scope.pageSize, $scope.pageNumber, $scope.sortBy, $scope.sortDir)
                .then(function (response) {
                    //console.log(response);
                    $scope.items = response.Data;
                    $scope.total = response.Total;
                    $scope.busy = false;
                });
        }

        $scope.setSelected = function (item) {
            $scope.selectedItem = item;
        }

        $scope.ok = function () {
            $uibModalInstance.close($scope.selectedItem);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();