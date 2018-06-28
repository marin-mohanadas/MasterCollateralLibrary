
(function () {
    'use strict';

    angular
        .module('app.costTypes')
        .controller('costTypesController', ['$scope', '$uibModal', '$location', 'costTypesService', costTypesController]);

    function costTypesController($scope, $uibModal, $location, costTypesService) {

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
            cst_type_desc: '',
            cst_type_mu: ''
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
            costTypesService.getFind($scope.param)
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
                costTypesService.updateCostType($scope.selectedLine)
                    .then(function (res) {
                        if (res === true) {
                            item.cst_type_desc = $scope.selectedLine.cst_type_desc;
                            item.cst_type_mu = $scope.selectedLine.cst_type_mu;
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

                // soft delete
                item.val.cst_type_deleted = true;
                costTypesService.updateCostType(item.val)
                    .then(function (res) {
                        if (res === true) {
                            var index = $scope.items.indexOf(item.val);

                            if (index >= 0) {
                                $scope.items.splice(index, 1);
                            }
                        }
                    });

                //costTypesService.deleteCostType(item)
                //    .then(function (res) {
                //        if (res === true) {
                //            var index = $scope.items.indexOf(item);
                //            $scope.items.splice(index, 1);
                //        }
                //    });
            }, function () {

            });
        }

        $scope.newBtnClicked = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/costTypes/views/newCostTypeModal.html',
                controller: 'newCostTypeModalController',
                size: 'sm'
            });
            //console.log(item);
            modalInstance.result.then(function (item) {
                //console.log(item);
                costTypesService.createCostType(item)
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