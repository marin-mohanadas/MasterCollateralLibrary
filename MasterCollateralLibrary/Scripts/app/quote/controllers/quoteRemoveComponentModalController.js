/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.quote')
        .controller('quoteRemoveComponentModalController', ['$scope', '$uibModalInstance', 'component', quoteRemoveComponentModalController]);

    function quoteRemoveComponentModalController($scope, $uibModalInstance, component) {

        $scope.component = component;
        
        $scope.ok = function () {
            $uibModalInstance.close($scope.component);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();