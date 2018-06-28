/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.quote')
        .controller('quotesController', ['$scope', '$uibModal', 'quoteService', 'customerService', quotesController]);

    function quotesController($scope, $uibModal, quoteService, customerService) {

        //$scope.filterAccount = null
        $scope.quote = null;
        $scope.lines = [];
        //$scope.next = false;
        //$scope.previous = false;
        //$scope.total = 0;
        //$scope.currentIndex = 0;
        $scope.complevels = [ 'Pack', 'Case' ]
        
        //getNextQuote(); // load first record

        getDropDownListData();

        function getDropDownListData() {            
            $scope.selectedAccount = null;
            $scope.selectedLanguage = null;
            $scope.selectedFormula = null;
            $scope.selectedPlant = null;
            $scope.selectedBrand = null;
            $scope.selectedHSCode = null;
            $scope.selectedSellCurrency = null;
            $scope.selectedSalesRep = null;
            $scope.selectedBox = null;
            $scope.selectedSterilizationMethod = null;
            $scope.selectedQuoteStatus = null;

            getCustomerAccounts();
            getLanguages();
            getFormulas();
            getMfgPlants();
            getBrands();
            getHsCodes();
            getSellCurrency();
            getSalesReps();
            getBoxes();
            getSterilizationMethods();
            getQuoteStatuses();
        }

        $scope.selectedAccount = null;
        $scope.accounts = [];        
        function getCustomerAccounts() {
            customerService.getCustomers()
                .then(function (response) {
                    $scope.accounts = response;                           
                    if ($scope.quote === null) return;                    
                    for (var i = 0; i < response.length; i++) {                        
                        if (response[i].id === $scope.quote.qthdr_acct_id) {
                            $scope.selectedAccount = response[i];                              
                            break;
                        }
                    }
                });
        }

        $scope.selectedLanguage = null;
        $scope.languages = [];        
        function getLanguages() {
            quoteService.getLanguages()
                .then(function (response) {
                    $scope.languages = response;

                    if ($scope.quote === null) return;
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].id === $scope.quote.qthdr_lang_id) {
                            $scope.selectedLanguage = response[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedFormula = null;
        $scope.formulas = [];        
        function getFormulas() {
            quoteService.getFormulas()
                .then(function (response) {
                    $scope.formulas = response;
                    if ($scope.quote === null) return;
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].id === $scope.quote.qthdr_formula_id) {
                            $scope.selectedFormula = response[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedPlant = null;
        $scope.plants = [];        
        function getMfgPlants() {
            quoteService.getMfgPlants()
                .then(function (response) {
                    $scope.plants = response;
                    if ($scope.quote === null) return;
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].id === $scope.quote.qthdr_plant_id) {
                            $scope.selectedPlant = response[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedBrand = null;
        $scope.brands = [];         
        function getBrands() {
            quoteService.getBrands()
                .then(function (response) {
                    $scope.brands = response;
                    if ($scope.quote === null) return;
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].id === $scope.quote.qthdr_brand_id) {
                            $scope.selectedBrand = response[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedHSCode = null;
        $scope.HSCodes = [];        
        function getHsCodes() {
            quoteService.getHsCodes()
                .then(function (response) {
                    $scope.HSCodes = response;
                    if ($scope.quote === null) return;
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].HS_code === $scope.quote.qthdr_HS_code) {
                            $scope.selectedHSCode = response[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedSellCurrency = null;
        $scope.sellCurrencies = [];        
        function getSellCurrency() {
            quoteService.getSellCurrency()
                .then(function (response) {
                    $scope.sellCurrencies = response;
                    if ($scope.quote === null) return;                    
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].id === $scope.quote.qthdr_sell_crncy) {
                            $scope.selectedSellCurrency = response[i];                            
                            break;
                        }
                    }
                });
        }

        $scope.selectedSalesRep = null;
        $scope.salesReps = [];        
        function getSalesReps() {
            quoteService.getSalesReps()
                .then(function (response) {
                    $scope.salesReps = response;
                    if ($scope.quote === null) return;
                    for (var i = 0; i < response.length; i++) {                        
                        if (response[i].id === $scope.quote.qthdr_rep_id) {
                            $scope.selectedSalesRep = response[i];                            
                            break;
                        }
                    }
                });
        }

        $scope.selectedBox = null;
        $scope.boxes = [];         
        function getBoxes() {
            quoteService.getBoxes()
                .then(function (response) {
                    $scope.boxes = response;
                    if ($scope.quote === null) return;
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].id === $scope.quote.qthdr_box_id) {
                            $scope.selectedBox = response[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedSterilizationMethod = null;
        $scope.sterilizationMethods = [];         
        function getSterilizationMethods() {
            quoteService.getSterilizationMethods()
                .then(function (response) {
                    $scope.sterilizationMethods = response;
                    if ($scope.quote === null) return;
                    for (var i = 0; i < response.length; i++) {
                        if (response[i] === $scope.quote.qthdr_sterility_mthd) {
                            $scope.selectedSterilizationMethod = response[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedQuoteStatus = null;
        $scope.quoteStatuses = [];         
        function getQuoteStatuses() {
            quoteService.getQuoteStatuses()
                .then(function (response) {
                    $scope.quoteStatuses = response;
                    if ($scope.quote === null) return;
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].id === $scope.quote.qthdr_status_id) {
                            $scope.selectedQuoteStatus = response[i];
                            break;
                        }
                    }
                });
        }        

        $scope.clear = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/quote/views/quoteClearModal.html',
                controller: 'quoteClearModalController',
                size: 'lg',
                resolve: {
                    quote: $scope.quote
                }
            });

            modalInstance.result.then(function (quote) {
                $scope.quote = null;
                $scope.lines = [];
                getDropDownListData();

            }, function () {
                // cancel
            });
        }

        $scope.openSearch = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/quote/views/quoteSearchModal.html',
                controller: 'quoteSearchModalController',
                size: 'lg',
                resolve: {

                }
            });

            modalInstance.result.then(function (quote) {                
                $scope.quote = quote;
                if (quote !== null) {
                    //console.log(quote);
                    quoteService.getQuoteDetails(quote.id)
                        .then(function (res) {
                            $scope.lines = res;
                    });
                }
                getDropDownListData();

            }, function () {
                // cancel
            });
        }

        $scope.openSearchComponent = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/component/views/componentSearchModal.html',
                controller: 'componentSearchModalController',
                size: 'lg',
                resolve: {

                }
            });

            modalInstance.result.then(function (selectedComponent) {
                // todo: add to $scope.lines
                //console.log(selectedComponent);
                var newLine = {
                    qtdtl_comp_qty: 1,
                    qtdtl_comp_case: 'Pack',
                    qtdtl_sub: true,
                    tbl_comp: selectedComponent,                    
                };

                $scope.lines.push(newLine);

                //console.log(selectedComponent);
            }, function () {

            });
        }

        $scope.removeComponent = function (component) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/quote/views/quoteRemoveComponentModal.html',
                controller: 'quoteRemoveComponentModalController',
                size: 'lg',
                resolve: {
                    component: component
                }
            });

            modalInstance.result.then(function (component) {
                var index = $scope.lines.indexOf(component);
                $scope.lines.splice(index, 1);    
            }, function () {

            });

            
        }        

        $scope.openNewAccount = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/customer/views/customerNewModal.html',
                controller: 'customerNewModalController',
                size: 'lg',
                resolve: {

                }
            });

            modalInstance.result.then(function (quote) {
                
                getDropDownListData();
            }, function () {
                // cancel
            });
        }
    }
})();