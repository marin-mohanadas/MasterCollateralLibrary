

(function () {
    'use strict'

    angular
        .module('app.productManagers')
        .controller('newproductManagersModalController', ['$scope', '$uibModalInstance', newproductManagersModalController]);

    function newproductManagersModalController($scope, $uibModalInstance) {

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