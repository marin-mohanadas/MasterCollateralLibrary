/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.core')
        .controller('confirmationModalController', ['$scope', '$uibModalInstance', 'item', confirmationModalController]);

    function confirmationModalController($scope, $uibModalInstance, item) {
        
        $scope.data = item;
                
        $scope.ok = function () {
            $uibModalInstance.close($scope.data);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();