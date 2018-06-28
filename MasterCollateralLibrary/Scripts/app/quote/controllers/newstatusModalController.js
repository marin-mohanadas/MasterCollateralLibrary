

(function () {
    'use strict'

    angular
        .module('app.quote')
        .controller('newstausModalController', ['$scope', '$uibModalInstance', newstausModalController]);

    function newstausModalController($scope, $uibModalInstance) {

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