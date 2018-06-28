/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.vendor')
        .controller('vendorController', ['$scope', '$uibModal', 'vendorService', 'alertService', vendorController]);

    function vendorController($scope, $uibModal, vendorService, alertService) {

        $scope.item = {};
        reset();

        $scope.components = [];
        $scope.total = 0;
        $scope.numberPages = 0;
        $scope.maxSize = 10;

        $scope.param = {
            PageSize: 8,
            PageNumber: 1,
            SortBy: 'id',
            SortDir: 'asc',            
            includeDeleted: false            
        };       

        $scope.clear = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/core/views/clearModal.html',
                controller: 'clearModalController',
                size: 'lg',
                resolve: {
                    item: $scope.item
                }
            });

            modalInstance.result.then(function (quote) {
                reset();          

            }, function () {
                // cancel
            });
        }

        function reset() {
            $scope.item = {
                id: 0,
                vend_parent_name: '',
                vend_child_name: '',
                vend_label_name: '',
                vend_memo: '',
                vend_street1: '',
                vend_street2: '',
                vend_city: '',
                vend_state: '',
                vend_zip: '',
                vend_country: '',
                tbl_vendDtl: [{
                    id: 0,
                    vendDtl_vend_id: 0,
                    vendDtl_conct_lname: '',
                    vendDtl_conct_fname: '',
                    vendDtl_conct_email: '',
                    vendDtl_conct_phone: '',
                    vendDtl_conct_mobile: '',
                    vendDtl_conct_notes: ''
                }]
            };
        }

        $scope.save = function () {
            vendorService.save($scope.item)
                .then(function (response) {                    
                    if (response !== '') {
                        $scope.item = response;
                        getComponents();
                        alertService.success('Save');
                    } else {
                        alertService.error('Failed');
                    }
                }, function (error) {
                    alertService.error('Failed');
                });
        }

        $scope.openSearch = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/vendor/views/vendorSearchModal.html',
                controller: 'vendorSearchModalController',
                size: 'lg',
                resolve: {

                }
            });

            modalInstance.result.then(function (item) {
                
                if (item !== null) {
                    vendorService.getVendorDetail(item.id)
                        .then(function (res) {
                            reset();
                            if (res.tbl_vendDtl == null || res.tbl_vendDtl.length === 0) {
                                res.tbl_vendDtl = angular.copy($scope.item.tbl_vendDtl);
                            }
                            $scope.item = res;
                            console.log('item', res);
                            getComponents();
                        });
                }

            }, function () {
                // cancel
            });
        }

        $scope.pageChanged = function () {
            getComponents();
        }

        $scope.filterChanged = function () {
            $scope.param.PageNumber = 1;
            getComponents();
        }

        $scope.doSortBy = function (val) {
            if ($scope.param.SortBy === val) {
                $scope.param.SortDir = $scope.param.SortDir === "asc" ? "desc" : "asc";
            } else {
                $scope.param.SortBy = val;
                $scope.param.SortDir = "asc";
            }
            $scope.param.PageNumber = 1;
            getComponents();
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

        function getComponents() {            
            vendorService.getVendorComponents($scope.item.id, $scope.param)
                .then(function (response) {                    
                    $scope.components = response.Data;
                    $scope.total = response.Total;
                    $scope.numberPages = Math.ceil(response.Total / $scope.param.PageSize);                    
                    $scope.busy = false;
                });
        }

        //$scope.openSearchComponent = function () {

        //    var modalInstance = $uibModal.open({
        //        animation: true,
        //        templateUrl: 'scripts/app/component/views/componentSearchModal.html',
        //        controller: 'componentSearchModalController',
        //        size: 'lg',
        //        resolve: {

        //        }
        //    });

        //    modalInstance.result.then(function (selectedComponent) {

        //        $scope.components.push({ tbl_comp: selectedComponent });

        //    }, function () {

        //    });
        //}

        //$scope.removeComponent = function (component) {

        //    var modalInstance = $uibModal.open({
        //        animation: true,
        //        templateUrl: 'scripts/app/productGroup/views/productGroupRemoveComponentModal.html',
        //        controller: 'productGroupRemoveComponentModalController',
        //        size: 'lg',
        //        resolve: {
        //            component: component
        //        }
        //    });

        //    modalInstance.result.then(function (component) {
        //        var index = $scope.components.indexOf(component);
        //        $scope.components.splice(index, 1);
        //    }, function () {

        //    });
        //}

        //$scope.addFeature = function () {
        //    $scope.features.push({ grpFAB_Feat: '', grpFAB_Ben: '' });
        //}

        //$scope.removeFeature = function (feature) {
        //    var modalInstance = $uibModal.open({
        //        animation: true,
        //        templateUrl: 'scripts/app/core/views/confirmationModal.html',
        //        controller: 'confirmationModalController',
        //        size: 'lg',
        //        resolve: {
        //            item: feature
        //        }
        //    });

        //    modalInstance.result.then(function (item) {
        //        var index = $scope.features.indexOf(item);
        //        $scope.features.splice(index, 1);
        //    }, function () {

        //    });
        //}

        //$scope.addTechnical = function () {
        //    $scope.technicals.push({ grpFAB_Feat: '', grpFAB_Ben: '' });
        //}

        //$scope.removeTechnical = function (technical) {
        //    var modalInstance = $uibModal.open({
        //        animation: true,
        //        templateUrl: 'scripts/app/core/views/confirmationModal.html',
        //        controller: 'confirmationModalController',
        //        size: 'lg',
        //        resolve: {
        //            item: technical
        //        }
        //    });

        //    modalInstance.result.then(function (item) {
        //        var index = $scope.technicals.indexOf(item);
        //        $scope.technicals.splice(index, 1);
        //    }, function () {

        //    });
        //}
    }
})();