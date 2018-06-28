/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('accountIndexController', ['$scope', '$location', 'accountService', accountIndexController]);

    function accountIndexController($scope, $location, accountService) {

        $scope.busy = false;
        $scope.items = [];
        $scope.total = 0;
        $scope.numberPages = 0;
        
        $scope.param = {
            PageSize: 20,
            PageNumber: 1,
            SortBy: 'desc',
            SortDir: 'asc',
            email: ''
        };

        getItems();

        $scope.pageChanged = function () {
            getItems();
        }

        $scope.filterChanged = function () {

            if ($scope.param.email && $scope.param.email.length > 0) {
                $scope.param.SortBy = 'email';
            }

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

            if ($scope.busy === true) return;
            $scope.busy = true;
            var clone = JSON.stringify($scope.param);

            accountService.find($scope.param)
                .then(function (response) {                    
                    $scope.items = response.Data;                        
                    $scope.total = response.Total;
                    $scope.numberPages = Math.ceil($scope.total / $scope.param.PageSize);                                            
                    $scope.busy = false;
                });
        }

        $scope.editBtnClicked = function (item) {
            window.location.href = '/Account/Edit/' + item.Id;
        }

        $scope.newBtnClicked = function () {
            window.location.href = '/Account/Create';
        }
    }

})();