﻿
(function () {
    'use strict';

    angular
        .module('app.salesReps')
        .controller('salesRepsIndexController', ['$scope', '$location', 'salesRepsService', salesRepsIndexController]);

    function salesRepsIndexController($scope, $location, salesRepsService) {

        $scope.busy = true;
        $scope.items = [];                
        $scope.total = 0;
        $scope.numberPages = 0;
        $scope.maxSize = 15;

        $scope.param = {
            PageSize: 20,
            PageNumber: 1,
            SortBy: 'desc',
            SortDir: 'asc',
            rep_fname: '',
            rep_lname: '',
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
            salesRepsService.getFind($scope.param)
                .then(function (response) {
                    $scope.items = response.Data;
                    $scope.total = response.Total;
                    $scope.busy = false;
                    $scope.numberPages = Math.ceil(response.Total / $scope.param.PageSize);

                    //console.log($scope.numberPages);
                });
            //console.log($scope.param);
        }

        $scope.editBtnClicked = function (item) {            
            window.location.href = "/SalesReps/Edit/" + item.id;            
        }

        $scope.newBtnClicked = function () {
            window.location.href = "/SalesReps/Create/";
        }     

    }

})();