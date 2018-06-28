
(function () {
    'use strict';

    angular
        .module('app.gpo')
        .controller('gpoController', ['$scope', '$uibModal', '$location', 'gpoService', gpoController]);

    function gpoController($scope, $uibModal, $location, gpoService) {

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
            id: '',
            gpo_name: ''
        };

        $scope.selectedLine = {};

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
            gpoService.getFind($scope.param)
                .then(function (response) {
                    $scope.items = response.Data;
                    $scope.total = response.Total;
                    $scope.busy = false;
                    $scope.numberPages = Math.ceil(response.Total / $scope.param.PageSize);
                });
        }

        
        $scope.editBtnClicked = function (item) {
            $scope.selectedLine = JSON.parse(JSON.stringify(item)); // make a copy
        }

        $scope.editBtnOkClicked = function (item) {
            if (item.id === $scope.selectedLine.id) {
                gpoService.updategpo($scope.selectedLine)
                    .then(function (res) {
                        if (res === true) {
                            item.id = $scope.selectedLine.id;
                            item.gpo_name = $scope.selectedLine.gpo_name;
                            $scope.selectedLine = {};
                        }
                    });
            }
        }

        $scope.editBtnCancelClicked = function (item) {
            $scope.selectedLine = {};
        }

        $scope.deleteBtnClicked = function (item) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: item }
                }
            });
            modalInstance.result.then(function (item) {
                gpoService.deletegpo(item.val)
                    .then(function (res) {
                        if (res === true) {
                            var index = $scope.items.indexOf(item.val);
                            $scope.items.splice(index, 1);
                        }
                    });
            }, function () {

            });
        }

        $scope.newBtnClicked = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/gpo/views/newgpoModal.html',
                controller: 'newgpoModalController',
                size: 'sm'
            });
            modalInstance.result.then(function (item) {
                gpoService.creategpo(item)
                    .then(function (res) {
                        if (res.id > 0) {
                            getItems();
                        }
                    });
            }, function () {

            });
        }
    }

})();