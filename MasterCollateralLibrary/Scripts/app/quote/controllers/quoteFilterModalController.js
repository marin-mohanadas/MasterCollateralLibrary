/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.quote')
        .controller('quoteFilterModalController', ['$scope', '$uibModalInstance', 'quoteService', quoteFilterModalController]);

    function quoteFilterModalController($scope, $uibModalInstance, quoteService) {

        $scope.busy = true;
        $scope.accounts = null;
        $scope.filterAccount = null;

        quoteService.getCustomerAccounts()
            .then(function (response) {
                $scope.accounts = response;

                if (response.length > 0) {
                    $scope.filterAccount = response[0];
                }

                $scope.busy = false;
            });

        $scope.ok = function () {
            $uibModalInstance.close($scope.filterAccount);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();