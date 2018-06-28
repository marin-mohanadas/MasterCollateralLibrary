/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.core')
        .controller('categoryAddModalController', ['$scope', '$uibModalInstance', 'categoryService', 'item', categoryAddModalController]);

    function categoryAddModalController($scope, $uibModalInstance, categoryService, item) {

        $scope.item = JSON.parse(JSON.stringify(item)); // make a copy
        //console.log(item);

        $scope.ok = function () {            
            if ($scope.item.id === 0) {
                // create
                categoryService.create($scope.item)
                    .then(function (response) {
                        //console.log(response);
                        if (response !== '' && response.id > 0) {
                            $uibModalInstance.close(response);
                        }
                    });
            } else {
                // update
                categoryService.update($scope.item)
                    .then(function (response) {
                        if (response === true) {
                            $uibModalInstance.close($scope.item);
                        }
                    });
            }
            
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();