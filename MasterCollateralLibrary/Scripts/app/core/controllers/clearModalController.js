/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.core')
        .controller('clearModalController', ['$scope', '$uibModalInstance', 'item', clearModalController]);

    function clearModalController($scope, $uibModalInstance, item) {

        $scope.item = item;

        $scope.ok = function () {
            $uibModalInstance.close($scope.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();