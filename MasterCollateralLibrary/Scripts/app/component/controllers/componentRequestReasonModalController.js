/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.core')
        .controller('componentRequestReasonModalController', ['$scope', '$uibModalInstance', 'item', componentRequestReasonModalController]);

    function componentRequestReasonModalController($scope, $uibModalInstance, item) {
        
        $scope.data = item;
        $scope.ok = function () {
            $uibModalInstance.close($scope.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();