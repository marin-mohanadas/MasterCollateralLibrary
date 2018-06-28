/*
 * Copyright 2018 MindHarbor
 * Author: Trinity Hinton
 * Replace generic modal "Are you sure?" on component delete click
 */

(function () {
    'use strict'

    angular
        .module('app.component')
        .controller('componentDeleteModalController', ['$scope', '$uibModalInstance', 'item', 'componentService', 'profileService', componentDeleteModalController]);

    function componentDeleteModalController($scope, $uibModalInstance, item, componentService, profileService) {
       // $scope.busy = true;
        $scope.param = item.val; 
        $scope.msg = item.msg;
        $scope.QuotesByCompID = [];
       console.log($scope.param);
       $scope.total = 0;
       getItems();
       $scope.pageChanged = function () {
           getItems();
       }

       function getItems() { 
           componentService.getCompByQuote($scope.param)
               .then(function (response) {
                   $scope.QuotesByCompID = response.Data;
                   $scope.total = response.Total;
                   console.log($scope.QuotesByCompID);
                   $scope.busy = false;
               });
       }
     
        $scope.ok = function () {
            $uibModalInstance.close($scope.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
      
})();