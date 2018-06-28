/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.quote')
        .controller('quoteIndexController', ['$scope', '$location', 'quoteService', quoteIndexController]);

    function quoteIndexController($scope, $location, quoteService) {

        $scope.busy = true;
        $scope.items = [];
        $scope.total = 0;
        $scope.numberPages = 0;
        $scope.maxSize = 15;

        $scope.param = {
            PageSize: 20,
            PageNumber: 1,
            SortBy: 'qn_basis',
            SortDir: 'asc',
            name: '',
            acct_name: '',
            rev: '',
            includeDeleted: false,
            WildcardSearch: '',
            rep: '',
            id: null,
            tray_no: '',
            qn_basis: '',
            fg_num: ''
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

            var clone = JSON.stringify($scope.param);
            
            if (clone === JSON.stringify($scope.param)) {
                quoteService.getFind($scope.param)
                    .then(function (response) {
                        $scope.items = response.Data;
                        $scope.total = response.Total;                        
                        $scope.numberPages = Math.ceil(response.Total / $scope.param.PageSize)                        
                        $scope.busy = false;
                    });            
            }   
        }

        $scope.editBtnClicked = function (item) {
            //window.location.href = '/QuoteMaster/Edit/' + item.id;
            window.open('/QuoteMaster/Edit/' + item.id, '_blank');
        }

        $scope.newBtnClicked = function () {
            window.location.href = '/QuoteMaster/Create';
        }
    }

})();