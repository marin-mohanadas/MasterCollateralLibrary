/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.core')
        .controller('componentRejectReasonModalController', ['$scope', '$uibModalInstance', 'item', componentRejectReasonModalController]);

    function componentRejectReasonModalController($scope, $uibModalInstance, item) {
        
        $scope.data = item;
        $scope.ok = function () {
            $uibModalInstance.close($scope.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();