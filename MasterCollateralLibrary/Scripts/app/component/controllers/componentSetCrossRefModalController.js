/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.component')
        .controller('componentSetCrossRefModalController', ['$scope', '$uibModalInstance', 'componentService', 'item', componentSetCrossRefModalController]);

    function componentSetCrossRefModalController($scope, $uibModalInstance, componentService, item) {

        $scope.busy = true;
        $scope.parent = item.parent
        $scope.item = {
            xref_comp_id: item.parent.id,
            xref_equiv_compid: item.equiv.Id
        };
        $scope.selectedLifeCycle = null;
        $scope.lifeCycles = [];
        $scope.equiv = {};
                
        componentService.getLifeCycles()
            .then(function (response) {
                $scope.lifeCycles = response;
                
                for (var i = 0; i < $scope.parent.tbl_X_ref.length; i++) {
                    if ($scope.parent.tbl_X_ref[i].xref_equiv_compid === item.equiv.Id) {
                        $scope.item = angular.copy($scope.parent.tbl_X_ref[i]);

                        for (var j = 0; j < $scope.lifeCycles.length; j++) {
                            if ($scope.lifeCycles[j].id === $scope.item.xref_life_cycle_id) {
                                $scope.selectedLifeCycle = $scope.lifeCycles[j];
                            }
                        }
                    }
                }

                componentService.getComponentEdit(item.equiv.Id)
                    .then(function (res) {
                        $scope.equiv = res;
                    });
            });
        
        $scope.ok = function () {

            if ($scope.selectedLifeCycle !== null) {
                $scope.item.xref_life_cycle_id = $scope.selectedLifeCycle.id;
            }

            //console.log($scope.item);

            //if ($scope.item.xref_exact === false) {
            //    $scope.item.xref_notes = ''; // clear note
            //}

            componentService.setCrossRef($scope.item)
                .then(function (response) {
                    if (response !== '') {                        
                        $uibModalInstance.close({ stat: 'updated', data: response });
                    }
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.remove = function () {            
            componentService.removeCrossRef($scope.item)
                .then(function (response) {
                    if (response === true) {
                        $uibModalInstance.close({ stat: 'removed', data: $scope.item });
                    }
                });
        }
    }

})();