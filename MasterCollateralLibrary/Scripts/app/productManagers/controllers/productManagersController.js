
(function () {
    'use strict';

    angular
        .module('app.productManagers')
        .controller('productManagersController', ['$scope', '$uibModal', '$location', 'productManagersService', productManagersController]);

    function productManagersController($scope, $uibModal, $location, productManagersService) {

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
            prodmgr_Fname: '',
            prodmgr_Lname: '',
            IsDeleted: false,
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
            productManagersService.getFind($scope.param)
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
                productManagersService.updateproductManagers($scope.selectedLine)
                    .then(function (res) {
                        if (res === true) {
                            item.prodmgr_Fname = $scope.selectedLine.prodmgr_Fname;
                            item.prodmgr_Lname = $scope.selectedLine.prodmgr_Lname;
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
                    item: {msg: "Some components may still have this manager assigned!"  , val: item }
                }
            });
            modalInstance.result.then(function (item) {
                productManagersService.deleteproductManagers(item.val)
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
                templateUrl: '../scripts/app/productManagers/views/newproductManagersModal.html',
                controller: 'newproductManagersModalController',
                size: 'sm'
            });
            modalInstance.result.then(function (item) {
                productManagersService.createproductManagers(item)
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