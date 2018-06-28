/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.quote')
        .controller('quoteAssemblyModalController', ['$scope', '$uibModalInstance', 'quoteService', 'item', quoteAssemblyModalController]);

    function quoteAssemblyModalController($scope, $uibModalInstance, quoteService, item) {

        //$scope.busy = true;        
              
        $scope.item = item;        
        //console.log($scope.item);
        $scope.availableItems = [];
        $scope.selectedItems = [];  

        quoteService.getAssemblyTypes()
            .then(function (response) {
                $scope.types = response;
            });

        quoteService.getAssemblyBuilds()
            .then(function (response) {
                $scope.builds = response;
            });       

        quoteService.getAssemblyComponents(item.id)
            .then(function (response) {
                if (response !== '' && response.length > 0) {
                    $scope.selectedItems = response;
                }    
            });

        quoteService.getTopLevelItems(item.qtdtl_qthdr_qn)
            .then(function (response) {
                if (response !== '' && response.length > 0) {
                    //console.log(item);
                    //console.log(response);
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].id !== item.id) {
                            $scope.availableItems.push(response[i]);
                        }                        
                    }
                }
            });

        $scope.ok = function () {        

            quoteService.updateAssemblyLine($scope.item, $scope.selectedItems)
                .then(function (response) {           
                    //console.log(response);
                    if (response !== null) {
                        $uibModalInstance.close(response);
                    }
                });            
        };        

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.select = null;
        $scope.setSelect = function (val) {
            $scope.select = val;            
        }

        $scope.deselect = null;
        $scope.setDeselect = function (val) {
            $scope.deselect = val;
        }

        $scope.btnSelectClicked = function () {
            if ($scope.select !== null) {
                $scope.selectedItems.push(angular.copy($scope.select));
                var index = $scope.availableItems.indexOf($scope.select);
                $scope.availableItems.splice(index, 1);
                $scope.select = null;
            }
        }

        $scope.btnDeselectClicked = function () {
            if ($scope.deselect !== null) {
                $scope.availableItems.push(angular.copy($scope.deselect));
                var index = $scope.selectedItems.indexOf($scope.deselect);
                $scope.selectedItems.splice(index, 1);
                $scope.deselect = null;
            }
        }
    }

})();