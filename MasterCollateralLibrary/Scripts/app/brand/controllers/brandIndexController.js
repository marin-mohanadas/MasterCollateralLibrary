
(function () {
    'use strict';

    angular
        .module('app.brand')
        .controller('brandIndexController', ['$scope', '$location', '$uibModal', 'brandService', brandIndexController]);

    function brandIndexController($scope, $location, $uibModal, brandService) {

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
            brand_name: '',
            brand_city: '',
            brand_state: '',
            brand_zip: ''
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
            brandService.getFind($scope.param)
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
            window.location.href = "/ProductBrands/Edit/" + item.id;            
        } 

        $scope.newBtnClicked = function () {

            window.location.href = '/ProductBrands/Create/';

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
                item.val.brand_deleted = true;
                brandService.updateBrand(item.val)
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