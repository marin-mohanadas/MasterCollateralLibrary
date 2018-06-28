/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.productGroup')
        .controller('productGroupRemoveComponentModalController', ['$scope', '$uibModalInstance', 'component', productGroupRemoveComponentModalController]);

    function productGroupRemoveComponentModalController($scope, $uibModalInstance, component) {

        $scope.component = component;
        //console.log($scope.component);
        $scope.ok = function () {
            $uibModalInstance.close($scope.component);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();