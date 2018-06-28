/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.component')
        .controller('componentSetCategoryModalController', ['$scope', '$uibModalInstance', 'componentService', 'item', componentSetCategoryModalController]);

    function componentSetCategoryModalController($scope, $uibModalInstance, componentService, item) {

        $scope.busy = true;
        
        $scope.item = item;
        
        $scope.ok = function () {

            componentService.setCategoryId($scope.item)
                .then(function (response) {
                    if (response === true) {
                        $uibModalInstance.close($scope.item);
                    }
                });            
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();