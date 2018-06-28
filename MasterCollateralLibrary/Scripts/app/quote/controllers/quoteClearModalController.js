/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.quote')
        .controller('quoteClearModalController', ['$scope', '$uibModalInstance', 'quote', quoteClearModalController]);

    function quoteClearModalController($scope, $uibModalInstance, quote) {

        $scope.item = quote;

        $scope.ok = function () {
            $uibModalInstance.close($scope.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();