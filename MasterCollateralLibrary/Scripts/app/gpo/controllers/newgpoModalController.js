

(function () {
    'use strict'

    angular
        .module('app.gpo')
        .controller('newgpoModalController', ['$scope', '$uibModalInstance', newgpoModalController]);

    function newgpoModalController($scope, $uibModalInstance) {

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