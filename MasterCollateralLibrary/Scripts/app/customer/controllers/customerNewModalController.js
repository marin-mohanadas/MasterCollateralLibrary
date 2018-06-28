/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.customer')
        .controller('customerNewModalController', ['$scope', '$uibModalInstance', 'customerService', customerNewModalController]);

    function customerNewModalController($scope, $uibModalInstance, customerService) {

        $scope.busy = true;
        $scope.item = {};

        $scope.ok = function () {
            // todo: add account
            $uibModalInstance.close($scope.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();