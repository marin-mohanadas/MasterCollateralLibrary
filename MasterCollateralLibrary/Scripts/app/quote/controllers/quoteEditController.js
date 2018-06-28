/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.quote')
        .controller('quoteEditController', ['$scope', '$rootScope', '$uibModal', '$window', 'quoteService',
            'customerService', 'componentService', 'Upload', 'constants', 'alertService', 'profileService', quoteEditController])
        .directive('expand', function () {
            function link(scope, element, attrs) {
                scope.$on('onExpandAll', function (event, args) {
                    scope.item.expanded = args.expanded;
                });
            }
            return {
                link: link
            };
        });

    function quoteEditController($scope, $rootScope, $uibModal, $window, quoteService, customerService,
        componentService, Upload, constants, alertService, profileService) {

        var self = this;
        self.expandAll = function (expanded) {
            $scope.$broadcast('onExpandAll', { expanded: expanded });
        };

        $scope.quote = {
            id: 0,
            qthdr_name: '',
            qthdr_acct_id: '',
            qthdr_rev: 'A',
            qthdr_tray_no: '',
            tbl_qtdtl: []
        };
        $scope.HistoryParam = {
            PageSize: 50,
            PageNumber: 1,
            total: 0,
            QuoteNo: '',
        }
        $scope.isTrayExist = false;
        $scope.selectedLine = {};
        $scope.complevels = ['Pack', 'Case']
        $scope.temp_count = 0;
        $scope.Total_PurchInfoIncomplete = 0;
        $scope.CompErrors = '';

        $scope.orderByField = 'qtdtl_comp_id';
        $scope.reverseSort = true;        

        var temp = window.location.pathname.split('/');        
        if (temp.length === 4) {
            $scope.quote.id = temp[3];
        }        

        if (window.location.search && window.location.search.startsWith('?add=')) {
            var addCompId = window.location.search.replace('?add=', '');
            console.log('addCompId', $scope.addCompId);
            
            if ($scope.quote.id < 1 || addCompId < 1) {
                return;
            }

            var newLines =[{
                qtdtl_qthdr_qn: $scope.quote.id,
                qtdtl_comp_id: addCompId,
                qtdtl_comp_qty: 1,
                qtdtl_comp_case: $scope.complevels[0],
                qtdtl_sub: true                
            }];

            quoteService.addLines(newLines)
                .then(function (res) {
                    if (res !== null && res.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            $scope.quote.tbl_qtdtl.push(res[i]);                            
                            alertService.success('Added Component ID ' + res[i].qtdtl_comp_id);                            
                        }
                    }
                    
                    window.location.search = '';
                    console.log('window.location', window.location);
                });            
        }

        $scope.profile = null;
        profileService.getUserProfile()
            .then(function (response) {
                $scope.profile = response;                
            });      

        if ($scope.quote.id > 0) {
            loadQuote($scope.quote.id);
        } else {
            getDropDownListData();
        }
        
        function loadQuote(id) {
            $scope.busy = true;   
            quoteService.getQuoteEdit(id)
                .then(function (response) {
                    if (response !== "" && response !== undefined) {
                        $scope.quote = response;
                        getDropDownListData();                        
                        getPackQuoteReport();                        
                    }
                    $scope.busy = false;
                });
        }

        function reset() {
            $scope.quote = {
                id: 0,
                qthdr_name: '',
                qthdr_acct_id: '',
                qthdr_rev: '0',
                tbl_qtdtl: []
            };

            $scope.packOption = 'new';
            $scope.selectedLine = {};
            $scope.packOptionChanged();
            $scope.selectedQuoteStatus = null;

            if ($scope.accounts.length > 0) {
                $scope.selectedAccount = $scope.accounts[0];
                $scope.quote_acct_id = $scope.accounts[0].id;
            }
            $scope.selectedAccountChanged();
        }
        
        function getDropDownListData() {
            getCustomerAccounts();
            //getComponentSources();
            getQuoteStatuses();
            getReps();
            getPlants();
            //getFormulas();
            getSterilizationMethods();
            getSellCurrency();
            getBoxes();
            getBrands();
        }

        $scope.selectedAccount = {};
        $scope.accounts = [];
        function getCustomerAccounts() {
            customerService.getCustomers()
                .then(function (response) {
                    $scope.accounts = response;
                    if (response.length > 0) {
                        $scope.quote.qthdr_acct_id = response[0].id;
                        $scope.selectedAccount = response[0];
                        $rootScope.selectedAccountid = response[0].id;
                        if ($scope.mode === 'edit') {
                            $scope.selectedAccountChanged();
                        }
                    }
                });
        }

        //$scope.btnAddAccountClicked = function () {
        //    var modalInstance = $uibModal.open({
        //        animation: true,
        //        templateUrl: '../../scripts/app/clientAccounts/views/clientAccountCreateModal.html',
        //        controller: 'clientAccountCreateModalController',
        //        size: 'sm',
        //        resolve: {
                    
        //        }
        //    });

        //    modalInstance.result.then(function (item) {
        //        getCustomerAccounts();
        //    }, function () {

        //    });
        //}

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
            checkForTempItems();
        }

        $scope.selectedRep = null;
        $scope.reps = [];
        function getReps() {
            quoteService.getSalesReps()
                .then(function (response) {
                    $scope.reps = response;
                    if ($scope.quote.id < 1) {                        
                        return; // no need to load current user salesrep
                    }
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].id === $scope.quote.qthdr_rep_id) {
                            $scope.selectedRep = response[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedPlant = null;
        $scope.plants = [];
        function getPlants() {
            quoteService.getMfgPlants()
                .then(function (response) {
                    $scope.plants = response;
                    if ($scope.quote === null) return;
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].id === $scope.quote.qthdr_plant_id) {
                            $scope.selectedPlant = response[i];
                            $scope.selectedPlantChanged();
                            break;
                        }
                    }
                });
        }

        $scope.selectedPlantChanged = function () {
            quoteService.getFormulasByPlantId($scope.selectedPlant.id)
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
        $scope.selectedStatusChange = function () {           
            $scope.quote.qthdr_qcApproval = angular.equals(false);            
        }
        $scope.qcApprovalChange = function () {
            $scope.selectedQuoteStatus.id = 2;
        }    
        
        $scope.selectedFormula = null;
        $scope.formulas = [];

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

        $scope.selectedSellCurrency = null;
        $scope.initalSellCurrency = null;
        $scope.sellCurrencies = [];
        function getSellCurrency() {
            quoteService.getSellCurrency()
                .then(function (response) {
                    $scope.sellCurrencies = response;
                    if ($scope.quote === null) return;
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].id === $scope.quote.qthdr_sell_crncy) {
                            $scope.selectedSellCurrency = response[i];
                            if ($scope.initalSellCurrency == null) {
                                $scope.initalSellCurrency = response[i];
                            }
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

        $scope.selectedBrand = null;
        $scope.brands = [];
        function getBrands() {
            quoteService.getBrands()
                .then(function (response) {
                    $scope.brands = response;
                    if ($scope.quote.id < 1) return;
                    for (var i = 0; i < $scope.brands.length; i++) {
                        if ($scope.brands[i].id == $scope.quote.qthdr_brand_id) {
                            $scope.selectedBrand = $scope.brands[i];
                            break;
                        }
                    }
                });
        }

        function getPackQuoteReport() {
            checkForTempItems();            
            if ($scope.temp_count > 0) {
                alertService.info("Cannot calculate quote correctly due to new component requested!");
                return;
            }

            if ($scope.quote.id <= 0) {
                return;
            }

            $scope.quotePrice = null;
            for (var i = 0; i < $scope.quote.tbl_qtdtl.length; i++) {                
                $scope.quote.tbl_qtdtl[i].cost = null;
                $scope.quote.tbl_qtdtl[i].extCost = null;
                $scope.quote.tbl_qtdtl[i].uom = null;                                
            }

            quoteService.getPackQuoteReport($scope.quote.id)
                .then(function (response) {                    
                    //for (var i = 0; i < response.Errors.length; i++) {
                    //    alertService.error(response.Errors[i]);
                    //}

                    if (response.Result === null || response.Result === '') {
                        return;
                    }
                    
                    $scope.quotePrice = response.Result;

                    $scope.quote.qthdr_sell_price = $scope.quotePrice.SellPrice; //Get sales price from calculation, if 0 pulls finalMFGcost

                    if (!$scope.quotePrice.Lines || $scope.quotePrice.Lines.length == 0) {
                        alertService.info("Cannot calculate quote correctly due to incomplete component data!");
                    };

                    var alertflag = false;   
                    var alertassemblys =[];
                    for (var i = 0; i < $scope.quotePrice.Lines.length; i++) {
                        $scope.quote.tbl_qtdtl[i].MonthlyAMU = 0;

                        getTrays($scope.quote.tbl_qtdtl[i]);

                        if ($scope.quote.tbl_qtdtl[i].tbl_comp.comp_strlty != 0) {
                            $scope.quote.tbl_qtdtl[i].tbl_comp.strlty_cb = true;
                        }
                        if ($scope.quote.tbl_qtdtl[i].tbl_comp.comp_strlty == 0 || $scope.quote.tbl_qtdtl[i].tbl_comp.comp_strlty == null) {
                            $scope.quote.tbl_qtdtl[i].tbl_comp.strlty_cb = false;
                        }

                        //console.log($scope.quote.tbl_qtdtl[i]);
                        for (var j = 0; j < $scope.quote.tbl_qtdtl.length; j++) {
                            if ($scope.quotePrice.Lines[i].QtDtlId === $scope.quote.tbl_qtdtl[j].id) {                                
                                $scope.quote.tbl_qtdtl[j].cost = $scope.quotePrice.Lines[i].Cost;
                                $scope.quote.tbl_qtdtl[j].extCost = $scope.quotePrice.Lines[i].ExtCost;
                                $scope.quote.tbl_qtdtl[j].uom = $scope.quotePrice.Lines[i].Uom;
                                $scope.quote.tbl_qtdtl[j].PurchInfoComplete = $scope.quotePrice.Lines[i].PurchInfoComplete;
                                if ($scope.quote.tbl_qtdtl[j].qtdtl_assembly_name != null) {
                                    $scope.quote.tbl_qtdtl[j].PurchInfoComplete = true;
                                }                                
                                if ($scope.quote.tbl_qtdtl[j].PurchInfoComplete == false)
                                {
                                    alertassemblys.push($scope.quote.tbl_qtdtl[j].qtdtl_parent_id);
                                }
                                $scope.quotePrice.Lines[i].CompErrors.forEach(function (entry) {
                                    if (!$scope.quote.tbl_qtdtl[j].CompErrors) {
                                        $scope.quote.tbl_qtdtl[j].CompErrors = entry;
                                    }
                                    else {
                                        $scope.quote.tbl_qtdtl[j].CompErrors = $scope.quote.tbl_qtdtl[j].CompErrors + "</br>" + entry;
                                    }
                                });                                
                                //if ($scope.quote.tbl_qtdtl[j].PurchInfoComplete === false && $scope.quote.tbl_qtdtl[j].CompErrors == null) {
                                //    $scope.quote.tbl_qtdtl[j].CompErrors = "<b>Sub-Assembly is missing some component values</b>";
                                //}
                                if (!$scope.quote.tbl_qtdtl[j].PurchInfoComplete){                                    
                                    //alertService.error("Cannot calculate quote correctly due to incomplete component data!");
                                    alertflag = true;
                                }
                                break;
                            }
                        }
                    }
                    
                    for (var e = 0; e < $scope.quote.tbl_qtdtl.length; e++) {
                        if (alertassemblys.includes($scope.quote.tbl_qtdtl[e].id)) {
                            $scope.quote.tbl_qtdtl[e].CompErrors = "<b>Sub-Assembly is missing some component values</b>";
                            $scope.quote.tbl_qtdtl[e].PurchInfoComplete = false;
                        }                        
                    }
                    if (alertflag) {
                        alertService.info("Cannot calculate quote correctly due to incomplete component data!");
                    }
                    for (var z = 0; z < $scope.quote.tbl_qtdtl.length; z++) {
                        if ($scope.quote.tbl_qtdtl[z].qtdtl_parent_id != null) {
                            for (var y = 0; y < $scope.quote.tbl_qtdtl.length; y++) {
                                if ($scope.quote.tbl_qtdtl[z].qtdtl_parent_id == $scope.quote.tbl_qtdtl[y].id) {
                                    if ($scope.quote.tbl_qtdtl[z].CompErrors != null){
                                        $scope.quote.tbl_qtdtl[y].CompErrors = $scope.quote.tbl_qtdtl[y].CompErrors + "</br> <a href=/ComponentList/Edit/" + $scope.quote.tbl_qtdtl[z].qtdtl_comp_id + " target=_blank> Sub-" + $scope.quote.tbl_qtdtl[z].CompErrors + "</a>";
                                    }
                                }
                            }
                        }
                    }
                });
        }               

        $scope.addLineBtnClicked = function () {

            var param = { items: [] };

            for (var i = 0; i < $scope.quote.tbl_qtdtl.length; i++) {
                if ($scope.quote.tbl_qtdtl[i].qtdtl_parent_id === null) {
                    param.items.push(angular.copy($scope.quote.tbl_qtdtl[i].tbl_comp));
                }
            }
            param.acct_id = $scope.quote.tbl_acct.id;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/component/views/componentAdvanceSearchModal.html',
                controller: 'componentAdvanceSearchModalController',
                size: 'lg',
                resolve: {
                    item: param
                }
            });

            modalInstance.result.then(function (result) {                
                if (result.addNewItem === true) {
                    // save quote
                    $scope.save();
                    // create new comp and redirect to component edit page with callbackUrl
                    var newItem = {
                        id: 0,
                        comp_is_assembly: false,
                        comp_pub_desc: '',
                        comp_comments: ''
                    }

                    componentService.create(newItem)
                        .then(function (response) {
                            if (response !== '') {
                                window.location.href = '/ComponentList/Edit/' + response.id + '?callbackMethod=/QuoteMaster/Edit/' + $scope.quote.id + '?add=' + response.id;
                            }
                        })
                } else {

                    var newLines = [];

                    for (var i = 0; i < result.selectedItems.length; i++) {
                        var newLine = {
                            qtdtl_qthdr_qn: $scope.quote.id,
                            qtdtl_comp_id: result.selectedItems[i].id,
                            qtdtl_comp_qty: result.selectedItems[i].quantity,
                            qtdtl_comp_case: result.selectedItems[i].level,
                            qtdtl_sub: true,
                            //tbl_comp: result.selectedItems[i],
                        };
                        //newLine.tbl_comp = null; // workaround json payload size issue
                        newLines.push(newLine);
                    }
                    
                    quoteService.addLines(newLines)
                        .then(function (res) {
                            if (res !== null && res.length > 0) {
                                for (var i = 0; i < res.length; i++) {
                                    $scope.quote.tbl_qtdtl.push(res[i]);
                                    //console.log(res[i]);
                                    alertService.success('Added Component ID ' + res[i].qtdtl_comp_id);
                                    getPackQuoteReport();
                                }
                            }
                        });
                }

            }, function () {

            });
        }

        $scope.lineDeleteBtnClicked = function (item) {
            if ($scope.quote.qthdr_status_id === 6) return;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: '', val: item } // item
                }
            });
            //console.log(item);
            modalInstance.result.then(function (item) {
                //console.log(item);
                quoteService.deleteLine(item.val)
                    .then(function (res) {
                        if (res === true) {
                            var index = $scope.quote.tbl_qtdtl.indexOf(item.val);
                            $scope.quote.tbl_qtdtl.splice(index, 1);
                            getPackQuoteReport();

                            // if item is sub-assembly then reload quote
                            if (item.val.qtdtl_assembly_name) {
                                loadQuote($scope.quote.id);
                            }
                        }
                    });
            }, function () {

            });
        }

        $scope.lineEditBtnEditClicked = function (item) {
            if ($scope.quote.qthdr_status_id === 6) return;
            $scope.selectedLine = JSON.parse(JSON.stringify(item)); // make a copy
        }

        $scope.lineEditBtnOkClicked = function (item) {
            if (item.qtdtl_comp_id === $scope.selectedLine.qtdtl_comp_id) {    
                quoteService.updateLine($scope.selectedLine)
                    .then(function (res) {
                        if (res === true) {
                            item.qtdtl_comp_qty = $scope.selectedLine.qtdtl_comp_qty;
                            item.qtdtl_comp_case = $scope.selectedLine.qtdtl_comp_case;
                            item.tbl_comp.comp_acl = $scope.selectedLine.tbl_comp.comp_acl;
                            item.tbl_comp.comp_latex = $scope.selectedLine.tbl_comp.comp_latex;
                            item.tbl_comp.comp_strlty = $scope.selectedLine.tbl_comp.comp_strlty;
                            $scope.selectedLine = {};
                            getPackQuoteReport();
                        }
                    });
            }
        }

        $scope.lineEditBtnCancelClicked = function (item) {
            $scope.selectedLine = {};
        }

        $scope.lineSwitchItemBtnClicked = function (item) {
            if ($scope.quote.qthdr_status_id === 6) return;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/component/views/componentRefModal.html',
                controller: 'componentRefModalController',
                size: 'lg',
                resolve: {
                    item: item
                }
            });

            modalInstance.result.then(function (selectedItem) {

                var equiv = angular.copy(selectedItem.tbl_comp_equiv);
                equiv.tbl_X_ref = null; // avoid json request was too large to deserialized error
                //console.log('equiv', equiv);
                var cur = angular.copy(item);
                cur.tbl_comp = null; // avoid json request was too large to deserialized error
                //console.log('cur', cur);

                quoteService.switchComponent(cur, equiv)
                    .then(function (res) {
                        if (res === true) {
                            item.qtdtl_comp_id = equiv.id;
                            item.tbl_comp = selectedItem.tbl_comp_equiv;
                            getPackQuoteReport();
                        }
                    });
            }, function () {

            });
        }
        
        $scope.addAssemblyBtnClicked = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/quote/views/quoteAddAssemblyModal.html',
                controller: 'quoteAddAssemblyModalController',
                size: 'lg',
                resolve: {
                    item: $scope.quote
                }
            });

            modalInstance.result.then(function (assembly) {
                var subassembly = {
                    qtdtl_qthdr_qn: $scope.quote.id,
                    qtdtl_comp_id: assembly.id,
                    qtdtl_comp_qty: 1,
                    qtdtl_comp_case: 'Pack',
                    qtdtl_sub: true,
                    qtdtl_assembly_name: assembly.name,
                    qtdtl_assembly_type: assembly.type,
                    qtdtl_assembly_build: assembly.build,
                    //tbl_comp: assembly.name                    
                    SubComponents: []
                };
                
                for (var i = 0; i < assembly.components.length; i++) {

                    var subComponent = {
                        id: assembly.components[i].id,
                        qtdtl_comp_id: assembly.components[i].qtdtl_comp_id,
                        original_qty: assembly.components[i].qtdtl_comp_qty,
                        new_qty: assembly.components[i].new_qty
                    };
                    subassembly.SubComponents.push(subComponent);
                }
                
                quoteService.addAssemblyLine(subassembly)
                    .then(function (res) {
                        if (res == null && res == 'undefined') {
                            alertService.error('unable to add subassembly');
                            return;
                        }

                        // reload quote due to issue with expand sub-assembly
                        loadQuote($scope.quote.id);

                        //res.Key.components = res.Value;
                        //$scope.quote.tbl_qtdtl.push(res.Key); // add subassembly to ui
                        
                        // update qtdtl ui
                        //for (var i = 0; i < res.Value.length; i++) {
                        //    for (var j = 0; j < $scope.quote.tbl_qtdtl.length; j++) {
                        //        if (res.Value[i].id != $scope.quote.tbl_qtdtl[j].id) {
                        //            continue;
                        //        }
                        //        if (res.Value[i].original_qty == res.Value[i].new_qty) {
                        //            // hide
                        //            $scope.quote.tbl_qtdtl.splice(j, 1);
                        //        } else {
                        //            // update qty
                        //            $scope.quote.tbl_qtdtl[j].qtdtl_comp_qty = res.Value[i].original_qty - res.Value[i].new_qty;
                        //        }
                        //        break;
                        //    }
                        //}
                    }, function (err) {
                        alertService.error('unable to add subassembly');
                    })

            }, function () {
                // cancel
            });
        }

        $scope.showAssemblyBtnClicked = function (item) {
            var confirmModalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: 'Please be sure to save any changes before proceeding. Continue?', val: item } // item
                }
            });
            //console.log(item);
            confirmModalInstance.result.then(function () {

                // Save quote
                $scope.save();

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '../../scripts/app/quote/views/quoteAssemblyModal.html',
                    controller: 'quoteAssemblyModalController',
                    size: 'lg',
                    resolve: {
                        item: angular.copy(item)
                    }
                });

                modalInstance.result.then(function (response) {

                    //item.qtdtl_assembly_name = response.key.qtdtl_assembly_name;
                    //item.qtdtl_assembly_type = response.key.qtdtl_assembly_type;
                    //item.qtdtl_assembly_build = response.key.qtdtl_assembly_build;

                    //console.log($scope.quote.tbl_qtdtl);

                    // add to ui - worked
                    //for (var i = 0; i < response.removes.length; i++) {
                    //    $scope.quote.tbl_qtdtl.push(response.removes[i]);
                    //}

                    // get indexes to remove from ui
                    //var toRemoves = []
                    //for (var i = 0; i < response.adds.length; i++) {
                    //    for (var j = 0; j < $scope.quote.tbl_qtdtl.length; j++) {
                    //        if (response.adds[i].id === $scope.quote.tbl_qtdtl[j].id) {
                    //            toRemoves.push(j);
                    //            break;
                    //        }
                    //    }
                    //}

                    // remove from ui
                    //for (var i = 0; i < toRemoves.length; i++) {
                    //    $scope.quote.tbl_qtdtl.splice(toRemoves[i], 1);
                    //}

                    // dn20180321: reload quote so no need to update ui code above
                    loadQuote($scope.quote.id);
                    //getPackQuoteReport();

                }, function () {
                    // cancel
                });

            }, function () {

            });
        }        

        $scope.save = function () {
            //Reload init currency for UI
            $scope.initalSellCurrency = null;
            getSellCurrency();
            //
            checkForTempItems();
            if ($scope.temp_count > 0) {
                alertService.error('Pack item has not been approved or rejected!');
            }
            if ($scope.selectedPlant !== null) {                
                $scope.quote.qthdr_plant_id = $scope.selectedPlant.id;
            }

            if ($scope.selectedFormula !== null) {                
                $scope.quote.qthdr_formula_id = $scope.selectedFormula.id;
            }

            //if ($scope.selectedSterilizationMethod !== null) {
            //    console.log('method', $scope.selectedSterilizationMethod);
            //    $scope.quote.qthdr_sterility_mthd = $scope.selectedSterilizationMethod;
            //}

            if ($scope.selectedQuoteStatus !== null) {
                $scope.quote.qthdr_status_id = $scope.selectedQuoteStatus.id;
            }
            if ($scope.selectedRep !== null) {
                $scope.quote.qthdr_rep_id = $scope.selectedRep.id;
            }
            if ($scope.selectedSellCurrency !== null) {
                $scope.quote.qthdr_sell_crncy = $scope.selectedSellCurrency.id;                
            }            
            if ($scope.selectedBox !== null) {
                $scope.quote.qthdr_box_id = $scope.selectedBox.id;                
            }
            //if ($scope.quote.qthdr_status_id === 6 && ($scope.quote.qthdr_fg_num === null || $scope.quote.qthdr_fg_num.length === 0)) {
            //    alertService.error('Finished Good # is required for New Award');
            //    return;
            //}
            if ($scope.selectedBrand !== null) {
                $scope.quote.qthdr_brand_id = $scope.selectedBrand.id;
            }

            var item = JSON.parse(JSON.stringify($scope.quote)); // make a copy    
            //console.log($scope.quote);
            item.tbl_qtdtl = null;
            //update margin based off of calc sell price
            //item.qthdr_margin = $scope.quotePrice.Margin;
            //console.log($scope.quote.qthdr_margin);
            if ($scope.quote.qthdr_margin != 0) {
                item.qthdr_margin = $scope.quotePrice.Margin;
            }
            quoteService.update(item.id, item)
                .then(function (response) {

                    if (response === true) {
                        alertService.success('Saved');
                        getPackQuoteReport();
                    } else {
                        alertService.error('Unable to save');
                    }                      
                });
            //if (selectedQuoteStatus.id == 2){
            //    //email rep
            //}
        }

        $scope.remove = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: 'Are you sure you want to remove this quote?', val: $scope.quote }
                }
            });

            modalInstance.result.then(function (item) {                
                quoteService.remove(item.val)
                    .then(function (response) {
                        if (response === true) {
                            window.location.href = '/QuoteMaster';
                        }
                    });
            }, function () {

            });
        }

        $scope.requestNewPartBtnClicked = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/quote/views/quoteRequestNewPartModal.html',
                controller: 'quoteRequestNewPartModalController',
                size: 'lg',
                resolve: {
                    item: $scope.quote.qthdr_acct_id
                }
            });

            modalInstance.result.then(function (val) {
                var newLine = {
                    qtdtl_qthdr_qn: $scope.quote.id,
                    qtdtl_comp_id: val.id,
                    qtdtl_comp_qty: val.quantity,
                    qtdtl_comp_case: val.level,
                    qtdtl_sub: true,
                    tbl_comp: val,
                };    

                quoteService.addLines([newLine])
                    .then(function (res) {
                        if (res !== null && res.length > 0) {
                            for (var i = 0; i < res.length; i++) {
                                $scope.quote.tbl_qtdtl.push(res[i]);
                                getPackQuoteReport();
                            }
                        }
                    });                

            }, function () {

            });
        }

        $scope.exportCostedExcel = function () {            
            $window.open(constants.baseUri + 'QuoteMaster/ExportCostedExcel/' + $scope.quote.id, '_blank');
        }

        $scope.exportCustomerExcel = function () {
            $window.open(constants.baseUri + 'QuoteMaster/ExportCustomerExcel/' + $scope.quote.id, '_blank');
        }
        
        function checkForTempItems()
        {            
            $scope.temp_count = 0;
            $scope.quote.tbl_qtdtl.forEach(function (line) {                          
                if (line.tbl_comp !== null && line.tbl_comp.comp_temp_item == true) {
                    $scope.temp_count = $scope.temp_count + 1;
                }
            });
        }
       
        $scope.btnNewRevClicked = function () {
            if ($scope.quote.id < 1) {
                return;
            }

            // confirmation popup
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: 'Are you sure you want to create a new Rev?', val: null }
                }
            });

            modalInstance.result.then(function (item) {
                quoteService.createNewRevFromId($scope.quote.id)
                    .then(function (response) {
                        if (response > 0) {
                            // todo: reload quote and calc cost
                            window.location.href = '/QuoteMaster/Edit/' + response;
                        }
                        else {
                            alertService.error('Unable to create new Rev');
                        }
                    }, function (error) {
                        alertService.error('Unable to create new Rev');
                    });
            }, function () {

            });            
        }

        $scope.btnNewAwardClicked = function () {
            if ($scope.quote.id < 1) {
                return;
            }
            // prompt user to enter finished good #
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/quote/views/quoteNewAwardModal.html',
                controller: 'quoteNewAwardModalController',
                size: 'md',
                resolve: {
                    item: {
                        qthdr_fg_num: angular.copy($scope.quote.qthdr_fg_num),
                        id: $scope.quote.id,
                        acct_id: $scope.quote.tbl_acct.id
                    }
                }
            });

            modalInstance.result.then(function (item) {
                var awardModel = {
                    id: $scope.quote.id,
                    qthdr_fg_num: item,
                    qthdr_finalMfgCost: $scope.quotePrice.FinalMfgCost
                };

                quoteService.createNewAwardFromId(awardModel)
                    .then(function (response) {
                        if (response > 0) {
                            // todo: reload quote and calc cost
                            window.location.href = '/QuoteMaster/Edit/' + response;
                        }
                        else {
                            alertService.error('Unable to create New Award');
                        }
                    }, function (error) {
                        alertService.error('Unable to create New Award');
                    });
            }, function () {

            });            
        }

        //$scope.marginChanged = function () {
        //    $scope.quotePrice.FinalPrice = $scope.quotePrice.FinalMfgCost / (1 - ($scope.quote.qthdr_margin / 100));
        //    $scope.quotePrice.FinalPriceCS = $scope.quotePrice.FinalMfgCostCS / (1 - ($scope.quote.qthdr_margin / 100));
        //}
        $scope.sellpriceChanged = function () {
            $scope.quotePrice.Margin = (($scope.quote.qthdr_sell_price - $scope.quotePrice.FinalRebatedMfgCostAndFees) / $scope.quote.qthdr_sell_price);
            $scope.quotePrice.FinalPrice = $scope.quotePrice.FinalRebatedMfgCostAndFees / (1 - ($scope.quotePrice.Margin));
            $scope.quotePrice.FinalPriceCS = $scope.quotePrice.FinalRebatedMfgCostAndFeesCS / (1 - ($scope.quotePrice.Margin));
        }

        $scope.saveAsTemplate = function () {
            if ($scope.quote.id < 1) {
                return;
            }
            
            // confirmation popup
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: 'Are you sure you want to save this as a Template?', val: null }
                }
            });

            modalInstance.result.then(function (item) {

                var model = {
                    id: $scope.quote.id
                };

                quoteService.createTemplateFromId(model)
                    .then(function (response) {
                        if (response > 0) {
                            // todo: reload quote and calc cost
                            window.location.href = '/QuoteMaster/Edit/' + response;
                        }
                        else {
                            alertService.error('Unable to create new Rev');
                        }
                    }, function (error) {
                        alertService.error('Unable to create new Rev');
                    });
            }, function () {

            });                   
        }

        $scope.messageModalPopup = function (title, msg) {
                var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/core/views/messageModal.html',
                controller: 'messageModalController',
                size: 'sm',
                resolve: {
                    item: { title: title, body: msg } // msg
                }
            });
            modalInstance.result.then(function (item) {              

            }, function () {

            });
        }

        function getTrays(item) {  
            $scope.busy = true;
            var params = { PageSize: 1, PageNumber: 1, Id: item.qtdtl_comp_id, qthdr_status_id: 6 };
            var clone = JSON.stringify(params);
            var returnAMU = 0;
            //console.log(item); 
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
            $scope.busy = false;
        }

        $scope.historyPageChanged = function () {
            getQuoteHistory();
        }
        function getQuoteHistory() {    
            $scope.HistoryParam.QuoteNo = $scope.quote.qthdr_qn_basis;
            var clone = JSON.stringify($scope.HistoryParam);
            if (clone === JSON.stringify($scope.HistoryParam)) {
                quoteService.getQuoteHistory($scope.HistoryParam)
                    .then(function (response) {                        
                        if (response != null || response != undefined) {
                            $scope.HistoryParam.total = response.Total;  
                            $scope.quote_history = response.Data;
                        }                        
                    });
            }            
        }
        $scope.loadQuoteHistory = function () {
            $scope.busy = true;
            getQuoteHistory();
            $scope.busy = false;
        }
        $scope.convertJsonDate = function (jsondate,format)
        {
            var date = new Date(parseInt(jsondate.substr(6)));
            // default date format
            if (angular.isUndefined(format))
                format = "MM/DD/YYYY";

            format = format.replace("DD", (date.getDate() < 10 ? '0' : '') + date.getDate()); // Pad with '0' if needed
            format = format.replace("MM", (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)); // Months are zero-based
            format = format.replace("YYYY", date.getFullYear());

            return format;
        }
    }
})();