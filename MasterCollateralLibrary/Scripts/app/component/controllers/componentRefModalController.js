/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.component')
        .controller('componentRefModalController', ['$scope', '$uibModalInstance', 'componentService', 'item', componentRefModalController]);

    function componentRefModalController($scope, $uibModalInstance, componentService, item) {

        $scope.busy = true;        
        $scope.items = [];
        $scope.selectedItem = {}

        for (var i = 0; i < item.tbl_comp.tbl_X_ref.length; i++) {
            $scope.items.push(item.tbl_comp.tbl_X_ref[i]);
        }

        $scope.setSelected = function (item) {
            $scope.selectedItem = item
        }

        $scope.ok = function () {
            $uibModalInstance.close($scope.selectedItem);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();