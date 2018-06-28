/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.component')
        .controller('componentIndexController', ['$scope', '$location', 'componentService', 'profileService', 'quoteService', componentIndexController]);

    function componentIndexController($scope, $location, componentService, profileService, quoteService) {

        $scope.busy = false;
        $scope.items = [];
        $scope.total = 0;
        $scope.numberPages = 0;
        //$scope.maxSize = 15;

        $scope.param = {
            PageSize: 20,
            PageNumber: 1,
            SortBy: 'desc',
            SortDir: 'asc',
            descOrg: '',
            vendor: '',
            vendorPart: '',
            equiv: '',
            desc: '',
            mfg: '',
            sterility: '',
            includeDeleted: false,
            WildcardSearch: '',
            id: null
        };

        $scope.profile = null;
        profileService.getUserProfile()
            .then(function (response) {
                $scope.profile = response;
            });

        getItems();

        $scope.pageChanged = function () {
            getItems();
        }

        $scope.filterChanged = function () {

            if ($scope.param.id && $scope.param.id.length > 0) {
                $scope.param.SortBy = 'id';
            } else if ($scope.param.descOrg.length > 0) {
                $scope.param.SortBy = 'descOrg';
            } else if ($scope.param.vendor.length > 0) {
                $scope.param.SortBy = 'vendor';
            } else if ($scope.param.vendorPart.length > 0) {
                $scope.param.SortBy = 'vendorPart';
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
            if ($scope.busy === true) return;
            $scope.busy = true;
            var clone = JSON.stringify($scope.param);

            componentService.getFind($scope.param)
                .then(function (response) {
                    if (JSON.stringify($scope.param) === clone) {
                        $scope.items = response.Data;
                        $scope.total = response.Total;
                        $scope.numberPages = Math.ceil($scope.total / $scope.param.PageSize);
                        //console.log('number pages', $scope.numberPages);                       
                    }
                    matchCurrencies();
                    $scope.busy = false;
                });
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
                        RMB_display = symbRMB + purch_aqsn_cost_each.toFixed(3) + '(' + codeRMB + ')';
                        //EUR_display = symbEUR + (purch_aqsn_cost_each * rateRMB).toFixed(2) + '(' + codeEUR + ')';
                        USD_display = symbUSD + (purch_aqsn_cost_each * rateRMB).toFixed(3) + '(' + codeUSD + ')';
                    }
                    //if (currency_id == 2) {
                    //    RMB_display = symbRMB + (purch_aqsn_cost_each * rateEUR).toFixed(2) + '(' + codeRMB + ')';
                    //    EUR_display = symbEUR + purch_aqsn_cost_each.toFixed(2) + '(' + codeEUR + ')';
                    //    USD_display = symbUSD + (purch_aqsn_cost_each * rateEUR).toFixed(2) + '(' + codeUSD + ')';
                    //}
                    if (currency_id == 3) {
                        RMB_display = symbRMB + (purch_aqsn_cost_each / rateRMB).toFixed(3) + '(' + codeRMB + ')';
                        //EUR_display = symbEUR + (purch_aqsn_cost_each * rateUSD).toFixed(2) + '(' + codeEUR + ')';
                        USD_display = symbUSD + purch_aqsn_cost_each.toFixed(3) + '(' + codeUSD + ')';
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

        $scope.editBtnClicked = function (item) {
            //window.location.href = '/ComponentList/Edit/' + item.id;    
            window.open('/ComponentList/Edit/' + item.id, '_blank');
        }

        $scope.newBtnClicked = function () {

            $scope.item = {
                id: 0,
                comp_vend_id: null,
                comp_mfgr_id: null,
                comp_vend_pn: null,
                comp_brand: null,
                comp_desc_orig: null,
                comp_desc_noun: null,
                comp_desc_attrbt: null,
                comp_desc_adj: null,
                comp_desc_alt: null,
                comp_desc_kywrd: null,
                comp_desc_color: null,
                comp_desc_side: null,
                comp_size_imp: null,
                comp_size_met: null,
                comp_coo_id: null,
                comp_strlty: null,
                comp_status_id: null,
                comp_HS_code: null,
                comp_moq: null,
                comp_ERP_PN: null,
                comp_npe: null,
                comp_pm: null,
                comp_source: null,
                x: null,
                comp_is_assembly: false,
                comp_pub_desc: '',
                comp_comments: '',
                comp_acl: null,
                comp_latex: null,

                tbl_purch: [],
                tbl_X_ref: [],
                tbl_X_cat: [],
                tbl_X_trait: [],
                tbl_X_material: [],
                tbl_X_spclty: [],
                tbl_lbl: [],
                tbl_pix: []
            };

            componentService.create($scope.item)
                .then(function (response) {
                    if (response !== '' && response.id) {
                        window.location.href = '/ComponentList/Edit/' + response.id;
                    }
                })
        }
    }

})();