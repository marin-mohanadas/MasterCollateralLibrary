

(function () {
    'use strict'

    angular
        .module('app.boxes')
        .controller('newBoxModalController', ['$scope', '$uibModalInstance', newBoxModalController]);

    function newBoxModalController($scope, $uibModalInstance) {

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