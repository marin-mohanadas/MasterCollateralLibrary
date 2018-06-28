

(function () {
    'use strict'

    angular
        .module('app.materials')
        .controller('newMaterialModalController', ['$scope', '$uibModalInstance', newMaterialModalController]);

    function newMaterialModalController($scope, $uibModalInstance) {

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