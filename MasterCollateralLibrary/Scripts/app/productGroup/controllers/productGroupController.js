/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.productGroup')
        .controller('productGroupController', ['$scope', '$uibModal', 'productGroupService', productGroupController]);

    function productGroupController($scope, $uibModal, productGroupService) {
        
        $scope.item = {};
        $scope.components = [];
        $scope.features = [];
        $scope.technicals = [];
        $scope.pictures = [];
        $scope.label = {}
        

        // get technical dropdownlist
        productGroupService.getTechnicalHeadings()
            .then(function (res) {
                $scope.technicalHeadings = res;
            });

        // get CE Class dropdownlist
        productGroupService.getCeClasses()
            .then(function (res) {
                $scope.ceClasses = res;
            });

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
                $scope.item = {};
                $scope.components = [];
                $scope.features = [];
                $scope.technicals = [];
                $scope.pictures = [];
                $scope.label = {}
                

            }, function () {
                // cancel
            });
        }

        $scope.openSearch = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/productGroup/views/productGroupSearchModal.html',
                controller: 'productGroupSearchModalController',
                size: 'lg',
                resolve: {

                }
            });

            modalInstance.result.then(function (item) {
                $scope.item = item;
                //console.log(item);
                if (item !== null) {
                    
                    productGroupService.getProductGroupDetail(item.id)
                        .then(function (res) {
                            console.log(res);
                            $scope.components = res.tbl_X_grpcomp;
                            $scope.features = res.tbl_grpFAB;
                            $scope.technicals = res.tbl_tech;
                            $scope.pictures = res.tbl_grppix;
                            $scope.label = res.tbl_grpLbl[0];

                            if ($scope.technicals !== null) {
                                for (var i = 0; i < $scope.technicals.length; i++) {
                                    for (var j = 0; i < $scope.technicalHeadings.length; j++) {
                                        if ($scope.technicals[i].tech_hdng === $scope.technicalHeadings[j].id) {
                                            $scope.technicals[i].selectedTechnicalHeading = $scope.technicalHeadings[j];
                                            break;
                                        }
                                    }
                                }
                            }

                            if ($scope.label !== null) {
                                for (var i = 0; i < $scope.ceClasses.length; i++) {
                                    if ($scope.label.grpLbl_CEclass === $scope.ceClasses[i].CEclass_ID) {
                                        $scope.label.selectedCeClass = $scope.ceClasses[i];
                                    }
                                }
                            }
                        });
                }
                
            }, function () {
                // cancel
            });
        }

        $scope.openSearchComponent = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/component/views/componentSearchModal.html',
                controller: 'componentSearchModalController',
                size: 'lg',
                resolve: {

                }
            });

            modalInstance.result.then(function (selectedComponent) {

                $scope.components.push({tbl_comp: selectedComponent});
                
            }, function () {

            });
        }

        $scope.removeComponent = function (component) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/productGroup/views/productGroupRemoveComponentModal.html',
                controller: 'productGroupRemoveComponentModalController',
                size: 'lg',
                resolve: {
                    component: component
                }
            });

            modalInstance.result.then(function (component) {
                var index = $scope.components.indexOf(component);
                $scope.components.splice(index, 1);
            }, function () {

            });            
        }

        $scope.addFeature = function () {
            $scope.features.push({ grpFAB_Feat: '', grpFAB_Ben: ''});
        }

        $scope.removeFeature = function (feature) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: feature }
                }
            });

            modalInstance.result.then(function (item) {
                var index = $scope.features.indexOf(item.val);
                $scope.features.splice(index, 1);
            }, function () {

            });
        }

        $scope.addTechnical = function () {
            $scope.technicals.push({ grpFAB_Feat: '', grpFAB_Ben: '' });
        }

        $scope.removeTechnical = function (technical) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: technical }
                }
            });

            modalInstance.result.then(function (item) {
                var index = $scope.technicals.indexOf(item.val);
                $scope.technicals.splice(index, 1);
            }, function () {

            });
        }
    }
})();