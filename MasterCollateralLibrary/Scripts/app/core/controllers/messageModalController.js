/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.core', ['ngSanitize'])
        .controller('messageModalController', ['$scope', '$sce', '$uibModalInstance', 'item', messageModalController]);

    function messageModalController($scope, $sce, $uibModalInstance, item) {

        $scope.item = item;
        
        $scope.ok = function () {
            $uibModalInstance.close($scope.item);
        };        
    }

})();