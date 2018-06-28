/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.clientAccounts')
        .controller('clientAccountCreateModalController', ['$scope', '$uibModalInstance', 'clientAccountsService', clientAccountCreateModalController]);

    function clientAccountCreateModalController($scope, $uibModalInstance, clientAccountsService) {

        $scope.item = {
            id: 0,
            acct_name: '',
            acct_3code: ''
        };

        $scope.errors = [];

        $scope.ok = function () {

            // todo: validate account code
            if ($scope.item.acct_3code.length == 0) {
                $scope.errors.push('Account Code is required.');
            }

            if ($scope.errors.length > 0) {
                return;
            }

            //clientAccountsService.isAccountCodeExists($scope.item.acct_3code, $scope.item.id)
            //    .then(function (response) {
            //        if (response = true) {
            //            $scope.errors.push('Account Code already exists.');
            //            return;
            //        }

            //        clientAccountsService.createClientAccount($scope.item)
            //            .then(function (response) {
            //                if (response !== '' && response.id > 0) {
            //                    $uibModalInstance.close(response);
            //                }
            //            });
            //    }, function (error) {

            //    });            
            clientAccountsService.isAccountCodeExists($scope.item.acct_3code, $scope.item.id)
                .then(function (response) {
                    //console.log('val', response);
                    if (response == false) {
                            clientAccountsService.createClientAccount($scope.item)
                                .then(function (res) {
                                    if (res.id > 0) {
                                        $uibModalInstance.close(res);
                                    }
                                });                        
                    } else {
                        $scope.errors.push('Account Code already exists.');
                    }
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    }

})();