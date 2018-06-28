/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.quote')
        .controller('quoteApprovalController', ['$scope', '$location', 'quoteService', quoteApprovalController]);

    function quoteApprovalController($scope, $location, quoteService) {

        $scope.busy = true;
        $scope.items = [];
        $scope.total = 0;
        $scope.numberPages = 0;
        $scope.maxSize = 15;
        $scope.ApprovalQuotesTicker = 999;

        $scope.param = {
            PageSize: 20,
            PageNumber: 1,
            SortBy: 'desc',
            SortDir: 'asc',
            name: '',
            acct_name: '',
            rev: '',
            includeDeleted: false,
            WildcardSearch: '',
            rep: '',
            id: null,
            tray_no: '',
            qcApproval: true
        };

        $scope.keywords = '';

        $scope.selectedSearchBy = { display: 'Sales Rep', value: 'rep' };
        $scope.searchByList = [
            { display: 'Sales Rep', value: 'rep' }
        ];

        getItems();
        $scope.pageChanged = function () {
            getItems();
        }

        $scope.filterChanged = function () {
            $scope.param.PageNumber = 1;
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
            if ($scope.selectedSearchBy !== null) {
                if ($scope.selectedSearchBy.value === 'rep') {
                    $scope.param.rep = $scope.keywords;
                }
            }            

            $scope.ApprovalQuotesTotal = 1;
            var clone = JSON.stringify($scope.param);
            
            if (clone === JSON.stringify($scope.param)) {
                quoteService.getFindQcApprovals($scope.param)
                    .then(function (response) {
                        $scope.items = response.Data;
                        $scope.total = response.Total;
                        $scope.ApprovalQuotesTicker = response.Total;
                        $scope.numberPages = Math.ceil(response.Total / $scope.param.PageSize);
                        $scope.busy = false;
                    });
            }
        }

        function getRep() {
            quoteService.getSalesRep('19')
                .then(function (rep_response) {
                    $scope.rep = rep_response;

                    for (var i = 0; i < rep_response.length; i++) {
                        if (rep_response[i].id === $scope.quote.qthdr_rep_id) {
                            $scope.selectedRep = rep_response[i];
                            break;
                        }
                    }
                });
        }


        $scope.editBtnClicked = function (item) {
            window.location.href = '/QuoteMaster/Edit/' + item.id;
        }

        $scope.newBtnClicked = function () {
            window.location.href = '/QuoteMaster/Edit/0';
        }
    }   
})();