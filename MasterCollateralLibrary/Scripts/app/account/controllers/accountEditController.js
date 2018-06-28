/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('accountEditController', ['$scope', '$window', '$location', '$uibModal', 'accountService', 'alertService', accountEditController]);

    function accountEditController($scope, $window, $location, $uibModal, accountService, alertService) {

        $scope.item = {
            Id: '',
            Email: '',
            Roles: [],
            Claims: []
        };

        var temp = window.location.pathname.split('/');        
        if (temp.length === 4) {
            $scope.item.Id = temp[3];

        }

        if ($scope.item.Id) {
            accountService.get($scope.item.Id)
                .then(function (response) {
                    $scope.item = response;
                    iniData();
                });
        } else {
            iniData();
        }

        $scope.roles = [];
        $scope.selectedAvailRole = null;
        $scope.selectedRole = null;

        $scope.claim = {
            Key: '',
            Value: ''
        }

        function iniData() {
            getRoles();
        }

        function getRoles() {
            accountService.roles()
                .then(function (response) {
                    $scope.roles = response;
                    if (!$scope.item.Id) return;
                    for (var i = 0; i < $scope.item.Roles.length; i++) {
                        $scope.roles.splice($scope.roles.indexOf($scope.item.Roles[i]), 1);
                    }
                });
        }
       
        $scope.setSelectedAvailRole = function (role) {
            $scope.selectedAvailRole = role;
        }

        $scope.setSelectedRole = function (role) {
            $scope.selectedRole = role;
        }

        $scope.addRole = function () {
            $scope.item.Roles.push($scope.selectedAvailRole);
            $scope.roles.splice($scope.roles.indexOf($scope.selectedAvailRole), 1);
            $scope.selectedAvailRole = null;
        }

        $scope.removeRole = function () {
            $scope.roles.push($scope.selectedRole);
            $scope.item.Roles.splice($scope.item.Roles.indexOf($scope.selectedRole), 1);
            $scope.selectedRole = null;
        }

        $scope.addClaim = function () {

            var found = null;
            for (var i = 0; i < $scope.item.Claims.length; i++) {
                if ($scope.item.Claims[i].Key == $scope.claim.Key) {
                    found = $scope.item.Claims[i];
                    break;
                }
            }

            var copy = angular.copy($scope.claim);

            if (found === null) {
                $scope.item.Claims.push(copy);
            } else {
                found.Value = copy.Value;
            }
            $scope.claim.Key = '';
            $scope.claim.Value = '';
            $scope.selectedClaim = null;
        }

        $scope.removeClaim = function () {
            if ($scope.selectedClaim === null) return;
            var index = $scope.item.Claims.indexOf($scope.selectedClaim);
            $scope.item.Claims.splice(index, 1);
            $scope.selectedClaim = null;
            $scope.claim.Key = '';
            $scope.claim.Value = '';
        }

        $scope.selectedClaim = null;

        $scope.setClaim = function (claim) {
            $scope.selectedClaim = claim;
            $scope.claim = angular.copy(claim);
        }

        $scope.saveBtnClicked = function () {
            var errors = [];
            if (!$scope.item.Email) {
                errors.push('Email is required');                
            }
            if (!$scope.item.Id
                && (!$scope.item.Password || $scope.item.Password !== $scope.item.ConfirmPassword)) {
                errors.push('Password and Confirmation Password do not match');
            }
            if ($scope.item.Id && $scope.item.Password
                && $scope.item.Password !== $scope.item.ConfirmPassword) {
                errors.push('Password and Confirmation Password do not match');
            }

            if (errors.length > 0) {
                for (var i = 0; i < errors.length; i++) {
                    alertService.error(errors[i]);
                }
                return;
            }

            if ($scope.item.Id) {
                // update
                accountService.update($scope.item)
                    .then(function (response) {
                        if (response.Errors.length > 0) {
                            for (var i = 0; i < response.Errors.length; i++) {
                                alertService.error(response.Errors[i]);
                            }
                        } else {
                            alertService.success('Saved');
                        }
                    }, function (err) {
                        alertService.error('Unable to update');
                    })
            } else {
                // create
                accountService.create($scope.item)
                    .then(function (response) {
                        if (response.Errors.length > 0) {
                            for (var i = 0; i < response.Errors.length; i++) {
                                alertService.error(response.Errors[i]);
                            }
                        } else {
                            $scope.item.Id = response.Result.Id;
                            alertService.success('Saved');
                        }
                    }, function (err) {
                        alertService.error('Unable to create');
                    });
            }
        }

        $scope.backBtnClicked = function () {
            window.location.href = '/Account';
        }
    }
})();