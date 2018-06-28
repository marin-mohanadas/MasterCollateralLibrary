/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.quote')
        .controller('quoteProposalController', ['$scope', '$window', '$location', 'quoteService', 'customerService', 'constants', quoteProposalController]);

    function quoteProposalController($scope, $window, $location, quoteService, customerService, constants) {

        $scope.busy = true;
        $scope.items = [];
        $scope.total = 0;
        $scope.numberPages = 0;
        $scope.maxSize = 20;

        $scope.selectedItems = [];
        $scope.selectedQuoteStatus = null;

        $scope.param = {
            PageSize: 8,
            PageNumber: 1,
            SortBy: 'desc',
            SortDir: 'asc',
            name: '',
            acct_name: '',
            rev: '',
            includeDeleted: false,
            WildcardSearch: '',
            rep: '',
            acct_id: null,
            tray_no: '',
            qtstatus_desc: ''
        };

        $scope.selectedAccount = null;
        $scope.accounts = [];        
        customerService.getCustomers()
            .then(function (response) {
                $scope.accounts = response;
                if (response.length > 0) {                   
                    $scope.selectedAccount = response[0];         
                    $scope.param.acct_id = response[0].id;
                }
                getItems();
                getQuoteStatuses();
            });

        $scope.accountChanged = function () {
            $scope.param.acct_id = $scope.selectedAccount !== null ? $scope.selectedAccount.id : null;
            getItems();
        }


        $scope.pageChanged = function () {
            getItems();
        }

        $scope.filterChanged = function () {
            $scope.param.PageNumber = 1;
            $scope.param.qtstatus_desc = $scope.selectedQuoteStatus.qtstatus_desc;
            getItems();
        }

        $scope.doSortBy = function (val) {
            if ($scope.param.SortBy === val) {
                $scope.param.SortDir = $scope.param.SortDir === "asc" ? "desc" : "asc";
            } else {
                $scope.param.SortBy = val;
                $scope.param.SortDir = "asc";
            }
            $scope.param.PageNumber = 1;
            getItems();
        }

        $scope.sortIcon = function (val) {
            if ($scope.param.SortBy === val) {
                if ($scope.param.SortDir === 'asc')
                    return 'glyphicon glyphicon-arrow-up';
                else if ($scope.param.SortDir === 'desc')
                    return 'glyphicon glyphicon-arrow-down';
                return '';
            }
        };

        function getItems() {
            $scope.busy = true;            

            var clone = JSON.stringify($scope.param);
            quoteService.getFind($scope.param)
                .then(function (response) {
                    if (clone == JSON.stringify($scope.param)) {
                        $scope.items = response.Data;
                        $scope.total = response.Total;
                        $scope.numberPages = Math.ceil(response.Total / $scope.param.PageSize)                        
                    }   
                    $scope.busy = false;
                });
           
        }

        $scope.editBtnClicked = function (item) {            
            $window.open(constants.baseUri + 'QuoteMaster/Edit/' + item.id, '_blank');
        }

        $scope.setSelected = function (item) {
            var index = $scope.selectedItems.indexOf(item);
            
            if (index >= 0) return;

            $scope.selectedItems.push(item);
        }        

        $scope.removeSelectedItem = function (item) {
            var index = $scope.selectedItems.indexOf(item);
            if (index >= 0) {
                $scope.selectedItems.splice(index, 1);
            }
        }

        function buildProposalId() {
            var str = "";
            for (var i = 0; i < $scope.selectedItems.length; i++) {
                if (i > 0) {
                    str += ","
                }
                str += $scope.selectedItems[i].id;
            }
            return str;
        }

        $scope.exportInternalExcel = function () {
            var str = buildProposalId();
            $window.open(constants.baseUri + 'QuoteMaster/ExportProposal?id=' + str + '&external=false', '_blank');
        }

        $scope.exportExternalExcel = function () {
            var str = buildProposalId();
            $window.open(constants.baseUri + 'QuoteMaster/ExportProposal?id=' + str + '&external=true', '_blank');
        }

        $scope.quoteStatuses = [];
        function getQuoteStatuses() {
            quoteService.getQuoteStatuses()
                .then(function (response) {
                    $scope.quoteStatuses = response;
                });
        }
    }

})();