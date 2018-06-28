/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.quote')
        .controller('quoteNewAwardModalController', ['$scope', '$uibModalInstance', 'item', 'quoteService', quoteNewAwardModalController]);

    function quoteNewAwardModalController($scope, $uibModalInstance, item, quoteService) {

        console.log(item);
        var quoteId = item.id;
        var acctId = item.acct_id;
        $scope.qthdr_fg_num = item.qthdr_fg_num;
        $scope.prefix = '';
        $scope.suffix = '';
        $scope.rev = '';
        $scope.errors = [];
        $scope.recommends = [];

        $scope.fgnumChanged = function () {
            $scope.errors = [];            
            $scope.recommends = [];
            if ($scope.qthdr_fg_num.length < 3) return;
            quoteService.disassembleFinishedGood($scope.qthdr_fg_num)
                .then(function (response) {                    
                    $scope.prefix = response[0];
                    $scope.suffix = response[1];
                    $scope.rev = response[2];

                    if ($scope.rev.length > 0) {
                        // suggest suffix
                        quoteService.validateFinishedGood($scope.qthdr_fg_num, quoteId, acctId)
                            .then(function (response) {   
                                if (response.Errors !== null && response.Errors.length > 0) {
                                    $scope.errors = response.Errors;
                                }
                                if (response.Result !== null && response.Result.length > 0) {
                                    $scope.recommends = response.Result;
                                }                                
                            }, function (error) {
                                $scope.error = 'Unable to validate finished good number';
                            });    
                    }
                }, function (error) {
                    $scope.error = 'Unable to disassemble finished good';
                });
        }

        $scope.ok = function () {
            quoteService.validateFinishedGood($scope.qthdr_fg_num, quoteId, acctId)
                .then(function (response) {                    
                    if (response.Errors.length > 0) {
                        $scope.errors = response.Errors;                        
                    }
                    if (response.Result.length > 0) {
                        $scope.recommends = response.Result;
                    }
                    if ($scope.errors.length > 0) {
                        return;
                    }                    
                    $uibModalInstance.close($scope.qthdr_fg_num);                    
                }, function (error) {
                    $scope.error = 'Unable to validate finished good number';
                });            
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();