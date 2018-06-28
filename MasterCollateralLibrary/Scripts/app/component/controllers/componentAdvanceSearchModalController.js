/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.component')
        .controller('componentAdvanceSearchModalController', ['$scope', '$uibModalInstance', 'item', 'componentService', 'profileService', 'quoteService', componentAdvanceSearchModalController]);

    function componentAdvanceSearchModalController($scope, $uibModalInstance, item, componentService, profileService, quoteService) {

        $scope.busy = true;

        $scope.profile = null;
        profileService.getUserProfile()
            .then(function (response) {
                $scope.profile = response;
            });

        $scope.exists = [];

        if (item !== null && item.items.length > 0) {
            for (var i = 0; i < item.items.length; i++) {
                $scope.exists.push(item.items[i]);
            }
        }

        $scope.items = [];
        $scope.selectedItems = [];
        $scope.total = 0;
        //$scope.sterilities = [];         
        //console.log(item);
        $scope.param = {
            PageSize: 6,
            PageNumber: 1,
            SortBy: 'desc',
            SortDir: 'asc',
            desc: '',
            vendor: '',
            equiv: '',
            sterility: '',
            id: null,
            acl: null,
            latex: null,
            acct_id: item.acct_id
        };


        $scope.complevels = ['Pack', 'Case']

        $scope.dup = null;

        clearSearchFields();
        getItems();

        $scope.pageChanged = function () {
            getItems();
        }

        $scope.filterChanged = function () {
            if ($scope.param.id && $scope.param.id.length > 0) {
                $scope.param.SortBy = 'id';
            } else if ($scope.param.desc && $scope.param.desc.length > 0) {
                $scope.param.SortBy = 'desc';
            } else if ($scope.param.vendor && $scope.param.vendor.length > 0) {
                $scope.param.SortBy = 'vendor';
            } else if ($scope.param.vendorPart && $scope.param.vendorPart.length > 0) {
                $scope.param.SortBy = 'vendorPart';
            } else if ($scope.param.strlty_desc && $scope.param.strlty_desc.length > 0) {
                $scope.param.SortBy = 'strlty_desc';
            } else if ($scope.param.comp_acl && $scope.param.comp_acl.length > 0) {
                $scope.param.SortBy = 'comp_acl';
            } else if ($scope.param.comp_latex && $scope.param.comp_latex.length > 0) {
                $scope.param.SortBy = 'comp_latex';
            }
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
            getSellCurrencies();
            //getSterilities();            
            //console.log($scope);
            componentService.getFind($scope.param)
                .then(function (response) {
                    $scope.items = response.Data;
                    for (var i = 0; i < $scope.items.length; i++) {
                        //$scope.items[i].acl_cb = $scope.items[i].comp_acl;
                        //$scope.items[i].latex_cb = $scope.items[i].comp_latex;
                        //if ($scope.items[i].comp_strlty > 0) {
                        //    $scope.items[i].strlty_cb = true;
                        //}

                        $scope.items[i].MonthlyAMU = 0;
                        getTrays($scope.items[i]);
                        //for (var j = 0; j < $scope.sterilities.length; j++) {     
                        //    if ($scope.items[i].comp_strlty === $scope.sterilities[j].id) {
                        //        $scope.items[i].comp_strlty_desc = $scope.sterilities[j].strlty_desc;
                        //    }
                        //}
                    }
                    $scope.total = response.Total;
                    matchCurrencies();
                    $scope.busy = false;
                });
        }

        $scope.removeSelectedItem = function (item) {
            var index = $scope.selectedItems.indexOf(item);
            $scope.selectedItems.splice(index, 1);
        }

        $scope.setSelected = function (item) {
            var found = null;
            for (var i = 0; i < $scope.selectedItems.length; i++) {
                if ($scope.selectedItems[i].id === item.id) {
                    found = $scope.selectedItems[i];
                    break;
                }
            }

            if (found === null) {
                for (var i = 0; i < $scope.exists.length; i++) {
                    if ($scope.exists[i].id === item.id) {
                        found = $scope.exists[i];
                        break;
                    }
                }
            }

            if (found === null) {
                item.quantity = 1;
                item.level = 'Pack';
                $scope.selectedItems.push(angular.copy(item));

                clearSearchFields();

            } else {
                $scope.dup = angular.copy(found);
            }
        }

        $scope.addDupClicked = function () {
            $scope.dup.quantity = 1;
            $scope.dup.level = 'Pack';
            $scope.selectedItems.push(angular.copy($scope.dup));
            $scope.dup = null;

            clearSearchFields();
        }

        function clearSearchFields() {
            $scope.param.desc = '';
            $scope.param.vendor = '';
            $scope.param.vendorPart = '';
            $scope.param.equiv = '';
            $scope.param.strlty_desc = '';
            $scope.param.id = null;
            $scope.param.comp_acl = '';
            $scope.param.comp_latex = '';
            //$scope.param.PageNumber = 1;
        }

        $scope.cancelDupClicked = function () {
            $scope.dup = null;
        }

        $scope.ok = function () {

            //console.log($scope.selectedItems[0]);
            $uibModalInstance.close({
                selectedItems: $scope.selectedItems,
                addNewItem: false
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.btnAddNewClicked = function () {
            $uibModalInstance.close({
                selectedItems: [],
                addNewItem: true
            });
        }

        //function getSterilities() {
        //    $scope.currencies = [];
        //    componentService.getSterilities()
        //        .then(function (res) {
        //            $scope.sterilities = res;
        //        });
        //}

        function getTrays(item) {
            $scope.busy = true;
            var params = { PageSize: 1, PageNumber: 1, id: item.id, qthdr_status_id: 6 };
            var clone = JSON.stringify(params);
            var returnAMU = 0;
            if (clone === JSON.stringify(params)) {
                //componentService.getCompTrays(params)
                componentService.getCompByQuote(params)
                    .then(function (response) {
                        if (response != null || response != undefined) {
                            returnAMU = returnAMU + response.Total;
                        }
                        item.MonthlyAMU = returnAMU;
                    });
            }
        }
        function matchCurrencies() {
            var rateRMB = 0;
            var symbRMB = '';
            var codeRMB = '';
            //var rateEUR = 0;
            //var symbEUR = '';
            //var codeEUR = '';
            var rateUSD = 0;
            var symbUSD = '';
            var codeUSD = '';
            for (var j = 0; j < $scope.sellCurrencies.length; j++) {
                if ($scope.sellCurrencies[j].id == 1) { rateRMB = $scope.sellCurrencies[j].currncy_rate; symbRMB = $scope.sellCurrencies[j].currncy_symb; codeRMB = $scope.sellCurrencies[j].currncy_code; }
                //if ($scope.sellCurrencies[j].id == 2) { rateEUR = $scope.sellCurrencies[j].currncy_rate; symbEUR = $scope.sellCurrencies[j].currncy_symb; codeEUR = $scope.sellCurrencies[j].currncy_code; }
                if ($scope.sellCurrencies[j].id == 3) { rateUSD = $scope.sellCurrencies[j].currncy_rate; symbUSD = $scope.sellCurrencies[j].currncy_symb; codeUSD = $scope.sellCurrencies[j].currncy_code; }
            }
            for (var i = 0; i < $scope.items.length; i++) {
                var cost_display = '';
                var RMB_display = '';
                //var EUR_display = '';
                var USD_display = '';

                if ($scope.items[i].tbl_purch[0].purch_aqsn_cost_each != null) {
                    //if ($scope.sellCurrencies[j].id == $scope.items[i].tbl_purch[0].purch_currncy_id && $scope.items[i].tbl_purch[0].purch_aqsn_cost_each != null) {
                    //console.log($scope.items[i].id, $scope.sellCurrencies[j].id, $scope.items[i].tbl_purch[0].purch_aqsn_cost_each);
                    var currency_id = $scope.items[i].tbl_purch[0].purch_currncy_id;
                    var purch_aqsn_cost_each = $scope.items[i].tbl_purch[0].purch_aqsn_cost_each;
                    if (currency_id == 1) {
                        RMB_display = symbRMB + purch_aqsn_cost_each.toFixed(2) + '(' + codeRMB + ')';
                        //EUR_display = symbEUR + (purch_aqsn_cost_each * rateRMB).toFixed(2) + '(' + codeEUR + ')';
                        USD_display = symbUSD + (purch_aqsn_cost_each * rateRMB).toFixed(2) + '(' + codeUSD + ')';
                    }
                    //if (currency_id == 2) {
                    //    RMB_display = symbRMB + (purch_aqsn_cost_each * rateEUR).toFixed(2) + '(' + codeRMB + ')';
                    //    EUR_display = symbEUR + purch_aqsn_cost_each.toFixed(2) + '(' + codeEUR + ')';
                    //    USD_display = symbUSD + (purch_aqsn_cost_each * rateEUR).toFixed(2) + '(' + codeUSD + ')';
                    //}
                    if (currency_id == 3) {
                        RMB_display = symbRMB + (purch_aqsn_cost_each / rateRMB).toFixed(2) + '(' + codeRMB + ')';
                        //EUR_display = symbEUR + (purch_aqsn_cost_each * rateUSD).toFixed(2) + '(' + codeEUR + ')';
                        USD_display = symbUSD + purch_aqsn_cost_each.toFixed(2) + '(' + codeUSD + ')';
                    }

                    cost_display = USD_display + ' - ' + RMB_display; // + ' - ' + EUR_display;
                    $scope.items[i].cost_display = cost_display;
                }
            }

        }

        function getSellCurrencies() {
            quoteService.getSellCurrency()
                .then(function (res) {
                    $scope.sellCurrencies = res;
                });
        }
    }

})();