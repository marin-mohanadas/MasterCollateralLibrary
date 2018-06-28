
(function () {
    'use strict';

    angular
        .module('app.packFormulas')
        .controller('packFormulasIndexController', ['$scope', '$location', '$uibModal', 'packFormulasService', packFormulasIndexController]);

    function packFormulasIndexController($scope, $location, $uibModal, packFormulasService) {

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
            formula_name: '',
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
            packFormulasService.getFind($scope.param)
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
            window.location.href = "/PackFormulas/Edit/" + item.id;            
        }

        $scope.newBtnClicked = function () {
            window.location.href = "/PackFormulas/Create/";
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
            
                // soft delete
                item.val.formula_deleted = true;
                packFormulasService.updateFormula(item.val)
                    .then(function (res) {
                        if (res === true) {
                            var index = $scope.items.indexOf(item.val);

                            if (index >= 0) {
                                $scope.items.splice(index, 1);
                            }
                        }
                    });
               
            }, function () {

            });
        }

    }

})();