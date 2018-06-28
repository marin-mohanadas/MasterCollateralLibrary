
(function () {
    'use strict';

    angular
        .module('app.boxes')
        .controller('boxesController', ['$scope', '$uibModal', '$location', 'boxesService', boxesController]);

    function boxesController($scope, $uibModal, $location, boxesService) {

        $scope.busy = true;
        $scope.items = [];                
        $scope.total = 0;
        $scope.numberPages = 0;
        $scope.maxSize = 15;

        $scope.param = {
            PageSize: 20,
            PageNumber: 1,
            SortBy: 'desc',
            SortDir: 'asc'
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
            boxesService.getFind($scope.param)
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
            $scope.selectedLine = JSON.parse(JSON.stringify(item)); // make a copy
        }

        $scope.editBtnOkClicked = function (item) {
            if (item.id === $scope.selectedLine.id) {
                boxesService.updateBox($scope.selectedLine)
                    .then(function (res) {
                        if (res === true) {
                            item.box_active = $scope.selectedLine.box_active;
                            item.box_brand = $scope.selectedLine.box_brand;
                            item.box_desc = $scope.selectedLine.box_desc;
                            item.box_hght = $scope.selectedLine.box_hght;
                            item.box_lngth = $scope.selectedLine.box_lngth;
                            item.box_wdth = $scope.selectedLine.box_wdth;
                            item.box_wght = $scope.selectedLine.box_wght;
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
            //console.log(item);
            modalInstance.result.then(function (item) {
                //console.log(item);
                boxesService.deleteBox(item.val)
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
                templateUrl: '../scripts/app/boxes/views/newBoxModal.html',
                controller: 'newBoxModalController',
                size: 'sm'
            });
            //console.log(item);
            modalInstance.result.then(function (item) {
                //console.log(item);
                boxesService.createBox(item)
                    .then(function (res) {
                        if (res.id > 0) {
                            //window.location.href = "/CostTypes";
                            getItems();
                        }
                    });
            }, function () {

            });
        }
    }

})();