

(function () {
    'use strict'

    angular
        .module('app.costTypes')
        .controller('newCostTypeModalController', ['$scope', '$uibModalInstance', newCostTypeModalController]);

    function newCostTypeModalController($scope, $uibModalInstance) {

        $scope.busy = true;
        $scope.newItem = null;

        $scope.save = function () {
            $uibModalInstance.close($scope.newItem);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();