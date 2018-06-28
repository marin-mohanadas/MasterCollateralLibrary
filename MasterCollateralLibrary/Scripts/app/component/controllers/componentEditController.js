/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.component')
        .controller('componentEditController', ['$scope', '$window', '$location', '$uibModal', 'componentService', 'quoteService',
            'vendorService', 'categoryService', 'Upload', 'constants', 'alertService', 'profileService', componentEditController]);

    function componentEditController($scope, $window, $location, $uibModal, componentService,
        quoteService, vendorService, categoryService, Upload, constants, alertService, profileService) {

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
            comp_cat_id: null,
            comp_deleted: false,
            comp_latex: null,
            comp_acl: null,
            comp_ship_size_uom: '',
            comp_ship_weight_uom: '',

            tbl_purch: [],
            tbl_X_ref: [],
            //tbl_X_cat: [],
            tbl_X_trait: [],
            tbl_X_material: [],
            tbl_X_spclty: [],
            tbl_lbl: [],
            tbl_pix: []
        };

        $scope.param = {
            PageSize: 200,
            PageNumber: 10,
            rep: '',
            id: null,
            IsDeleted: false,
            Status_Id: null
        };

        $scope.strlty_cb = false;

        $scope.measurementUomFilter = function (uom) {
            return uom.uom_code == 'CM' || uom.uom_code == 'IN';
        };
        $scope.weightUomFilter = function (uom) {
            return uom.uom_code == 'KG' || uom.uom_code == 'LB';
        };

        $scope.selectedPurchase = { id: 0 };
        $scope.selectedShipping = { id: 0 };
        $scope.ExchangeRates = '';
        $scope.IPAKSExchangeRatesEUR = '';
        $scope.IPAKSExchangeRatesRMB = '';
        var temp = window.location.pathname.split('/');

        if (temp.length === 4) {
            $scope.item.id = temp[3];
        }

        if (window.location.search && window.location.search.startsWith('?callbackMethod=')) {
            $scope.callbackMethod = window.location.search.replace('?callbackMethod=', '');
        }
        //console.log($scope.callbackMethod);

        $scope.profile = null;
        profileService.getUserProfile()
            .then(function (response) {
                $scope.profile = response;
            });

        componentService.getComponentEdit($scope.item.id)
            .then(function (response) {
                if (response !== "" && response !== undefined) {
                    $scope.item = response;

                    if (response.tbl_purch.length > 0) {
                        var purchase = JSON.parse(JSON.stringify(response.tbl_purch[0]));

                        if (purchase.purch_date_create !== null) {
                            purchase.purch_date_create = response.tbl_purch[0].purch_date_create;
                        }
                        if (purchase.purch_date_expry !== null) {
                            purchase.purch_date_expry = response.tbl_purch[0].purch_date_expry;
                        }
                        if (response.comp_strlty != 0) {
                            $scope.strlty_cb = true;
                        }
                        if (response.comp_strlty == 0 || response.comp_strlty == null) {
                            $scope.strlty_cb = false;
                        }
                        $scope.selectedPurchase = angular.copy(purchase);
                        getDropDownListData();
                    }
                    else {
                        $scope.selectedPurchase = {};
                        getDropDownListData();
                    }
                } else {
                    getDropDownListData();
                }
            });

        function getDropDownListData() {
            $scope.selectedVendor = null;
            $scope.selectedMfg = null;
            $scope.selectedCountry = null;
            $scope.selectedSterility = null;
            $scope.selectedStat = null;
            $scope.selectedProdMgr = null;

            $scope.selectedPurchase.selectedCurrency = null;
            $scope.selectedPurchase.selectedPlant = null;
            $scope.selectedPurchase.selectedCostType = null;
            $scope.selectedPurchase.selectedPurchaseUom = null;
            $scope.selectedPurchase.selectedSellingUom = null;
            $scope.selectedPurchase.selectedUsageUom = null;

            $scope.selectedShipping.selectedShippingMeasurementUom = null;
            $scope.selectedShipping.selectedShippingWeightUom = null;

            getVendors();
            getCountries();
            getSterilities();
            getStats();
            getProdMgrs();
            getCurrencies();
            getPlants();
            getCostTypes();
            getUoms();
            //getLifeCycles();      
            getCrossRefTree();
            getCategories();
            getTraits();
            getMaterials();
            getSpecialties();
            getLanguages();
        }

        $scope.selectedVendor = null;
        $scope.selectedMfg = null;
        $scope.selectedShipping.selectedShippingMeasurementUom = null;
        $scope.selectedShipping.selectedShippingWeightUom = null;
        $scope.vendors = [];
        function getVendors() {
            vendorService.getVendors()
                .then(function (res) {
                    $scope.vendors = res;
                    //console.log(res);
                    if ($scope.item === undefined) return;
                    var vendorFound = false;
                    var mfgFound = false
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.item.comp_vend_id) {
                            $scope.selectedVendor = res[i];
                            vendorFound = true;
                        }
                        if (res[i].id === $scope.item.comp_mfgr_id) {
                            $scope.selectedMfg = res[i];
                            mfgFound = true;
                        }
                        if (vendorFound === true && mfgFound === true) break;
                    }
                });
        }

        $scope.selectedCountry = null;
        $scope.countries = [];
        function getCountries() {
            componentService.getCountries()
                .then(function (res) {
                    $scope.countries = res;
                    if ($scope.item === undefined) return;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.item.comp_coo_id) {
                            $scope.selectedCountry = res[i];
                            break;
                        }
                    }
                });
        }

        componentService.getExchangeRate()
            .then(function (res) {
                var d = new Date(res.RateDate);
                $scope.ExchangeRates = ' EUR: ' + res.EUR.toFixed(4) + ' RMB: ' + res.RMB.toFixed(4);
            });

        $scope.selectedSterility = null;
        $scope.sterilities = [];
        function getSterilities() {
            componentService.getSterilities()
                .then(function (res) {
                    $scope.sterilities = res;
                    if ($scope.item === undefined) return;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.item.comp_strlty) {
                            $scope.selectedSterility = res[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedStat = null;
        $scope.stats = [];
        function getStats() {
            componentService.getStats()
                .then(function (res) {
                    $scope.stats = res;
                    if ($scope.item === undefined) return;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.item.comp_status_id) {
                            $scope.selectedStat = res[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedProdMgr = null;
        $scope.prodMgrs = [];
        function getProdMgrs() {
            componentService.getProdMgrs()
                .then(function (res) {
                    $scope.prodMgrs = res;
                    if ($scope.item === undefined) return;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.item.comp_pm) {
                            $scope.selectedProdMgr = res[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedPurchase.selectedCurrency = null;
        $scope.currencies = [];
        function getCurrencies() {
            quoteService.getSellCurrency()
                .then(function (res) {
                    $scope.currencies = res;
                    if ($scope.item === undefined) return;
                    for (var e = 0; e < res.length; e++) {
                        if (res[e].currncy_code == "EUR") { $scope.IPAKSExchangeRatesEUR = res[e].currncy_code + ": " + (1 / res[e].currncy_rate).toFixed(4) }
                        if (res[e].currncy_code == "RMB") { $scope.IPAKSExchangeRatesRMB = res[e].currncy_code + ": " + (1 / res[e].currncy_rate).toFixed(4) }
                    }
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.selectedPurchase.purch_currncy_id) {
                            $scope.selectedPurchase.selectedCurrency = res[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedPurchase.selectedPlant = null;
        $scope.plants = [];
        function getPlants() {
            quoteService.getMfgPlants()
                .then(function (res) {
                    $scope.plants = res;
                    if ($scope.item === undefined) return;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.selectedPurchase.purch_plant_id) {
                            $scope.selectedPurchase.selectedPlant = res[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedPurchase.selectedCostType = null;
        $scope.costTypes = [];
        function getCostTypes() {
            componentService.getCostTypes()
                .then(function (res) {
                    $scope.costTypes = res;
                    if ($scope.item === undefined) return;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.selectedPurchase.purch_cost_type_id) {
                            $scope.selectedPurchase.selectedCostType = res[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedPurchase.selectedPurchaseUom = null;
        $scope.selectedPurchase.selectedSellingUom = null;
        $scope.selectedPurchase.selectedUsageUom = null;
        $scope.uoms = [];
        function getUoms() {
            componentService.getUoms()
                .then(function (res) {
                    $scope.uoms = res;
                    if ($scope.item === undefined) return;

                    var foundPurchaseUom = false;
                    var foundSellingUom = false;
                    var foundUsageUom = false;
                    var foundShipMeasureUom = false;
                    var foundShipWeightUom = false;


                    for (var i = 0; i < res.length; i++) {
                        if (res[i].uom_code === $scope.selectedPurchase.purch_puom) {
                            $scope.selectedPurchase.selectedPurchaseUom = res[i];
                            foundPurchaseUom = true;
                        }
                        if (res[i].uom_code === $scope.selectedPurchase.purch_suom) {
                            $scope.selectedPurchase.selectedSellingUom = res[i];
                            foundSellingUom = true;
                        }
                        if (res[i].uom_code === $scope.selectedPurchase.purch_uuom) {
                            $scope.selectedPurchase.selectedUsageUom = res[i];
                            foundUsageUom = true;
                        }
                        if (res[i].uom_code === $scope.item.comp_ship_size_uom) {
                            $scope.selectedShipping.selectedShippingMeasurementUom = res[i];
                            foundShipMeasureUom = true;
                        }
                        if (res[i].uom_code === $scope.item.comp_ship_weight_uom) {
                            $scope.selectedShipping.selectedShippingWeightUom = res[i];
                            foundShipWeightUom = true;
                        }
                        if (foundPurchaseUom === true
                            && foundSellingUom === true
                            && foundUsageUom === true
                            && foundShipMeasureUom === true
                            && foundShipWeightUom === true) {
                            break;
                        }
                    }
                });
        }

        $scope.categories = [];
        function getCategories() {
            categoryService.getParentTreeNodes()
                .then(function (response) {
                    $scope.categories = response;

                    if ($scope.item.id > 0 && $scope.item.comp_cat_id !== null) {
                        categoryService.getCatFullPath($scope.item.comp_cat_id)
                            .then(function (res) {
                                $scope.selectedCatFullPath = res;
                            });
                    }

                });
        }

        $scope.traits = [];
        function getTraits() {
            componentService.getTraits()
                .then(function (res) {
                    $scope.traits = res;
                    if ($scope.item === undefined || $scope.item.tbl_X_trait === undefined) return;
                    for (var i = 0; i < $scope.item.tbl_X_trait.length; i++) {
                        for (var j = 0; j < res.length; j++) {
                            if ($scope.item.tbl_X_trait[i].trait_trait_id === res[j].id) {
                                $scope.item.tbl_X_trait[i].selectedTrait = res[j];
                                break;
                            }
                        }
                    }
                });
        }

        $scope.materials = [];
        function getMaterials() {
            componentService.getMaterials()
                .then(function (res) {
                    $scope.materials = res;
                    if ($scope.item === undefined || $scope.item.tbl_X_material === undefined) return;
                    for (var i = 0; i < $scope.item.tbl_X_material.length; i++) {
                        for (var j = 0; j < res.length; j++) {
                            if ($scope.item.tbl_X_material[i].material_material_id === res[j].id) {
                                $scope.item.tbl_X_material[i].selectedMaterial = res[j];
                                break;
                            }
                        }
                    }
                });
        }

        $scope.specialties = [];
        function getSpecialties() {
            componentService.getSpecialties()
                .then(function (res) {
                    $scope.specialties = res;
                    if ($scope.item === undefined || $scope.item.tbl_X_spclty === undefined) return;
                    for (var i = 0; i < $scope.item.tbl_X_spclty.length; i++) {
                        for (var j = 0; j < res.length; j++) {
                            if ($scope.item.tbl_X_spclty[i].spclty_spclty_id === res[j].id) {
                                $scope.item.tbl_X_spclty[i].selectedSpecialty = res[j];
                                break;
                            }
                        }
                    }
                });
        }

        $scope.languages = [];
        function getLanguages() {
            quoteService.getLanguages()
                .then(function (res) {
                    $scope.languages = res;
                    if ($scope.item === undefined || $scope.item.tbl_lbl === undefined) return;
                    for (var i = 0; i < $scope.item.tbl_lbl.length; i++) {
                        for (var j = 0; j < res.length; j++) {
                            if ($scope.item.tbl_lbl[i].lbl_lang_id === res[j].id) {
                                $scope.item.tbl_lbl[i].selectedLanguage = res[j];
                                break;
                            }
                        }
                    }
                });
        }

        // purchase        
        $scope.editPurchaseBtnClicked = function (val) {
            $scope.selectedPurchase = angular.copy(val);
            getDropDownListData();
        }

        $scope.editPurchaseOkBtnClicked = function (val) {
            if (val.selectedCurrency !== null
                && val.selectedCurrency.id !== undefined) {
                val.purch_currncy_id = val.selectedCurrency.id;
            }
            if (val.selectedPlant !== null
                && val.selectedPlant.id !== undefined) {
                val.purch_plant_id = val.selectedPlant.id;
            }
            if (val.selectedCostType !== null
                && val.selectedCostType.id !== undefined) {
                val.purch_cost_type_id = val.selectedCostType.id;
            }
            if (val.selectedPurchaseUom !== null
                && val.selectedPurchaseUom.uom_code !== undefined) {
                val.purch_puom = val.selectedPurchaseUom.uom_code;
            }
            if (val.selectedSellingUom !== null
                && val.selectedSellingUom.uom_code !== undefined) {
                val.purch_suom = val.selectedSellingUom.uom_code;
            }
            if (val.selectedUsageUom !== null
                && val.selectedUsageUom.uom_code !== undefined) {
                val.purch_uuom = val.selectedUsageUom.uom_code;
            }

            if (val.id === undefined || val.id == 0) {
                // add
                val.purch_comp_id = $scope.item.id;
                componentService.addPurchase(val)
                    .then(function (response) {
                        if (response !== '' && response.id > 0) {
                            $scope.item.tbl_purch.push(response);
                            $scope.selectedPurchase = angular.copy(response);
                            getDropDownListData();
                        }
                    });
            } else {
                // update
                componentService.updatePurchase(val)
                    .then(function (response) {
                        if (response.id !== undefined) {
                            for (var i = 0; i < $scope.item.tbl_purch.length; i++) {
                                if ($scope.item.tbl_purch[i].id === response.id) {
                                    var purchase = JSON.parse(JSON.stringify(val));
                                    if (purchase.purch_date_create !== null) {
                                        purchase.purch_date_create = val.purch_date_create;
                                    }
                                    if (purchase.purch_date_expry !== null) {
                                        purchase.purch_date_expry = val.purch_date_expry;
                                    }
                                    $scope.item.tbl_purch[i] = purchase;
                                    break;
                                }
                            }
                            getDropDownListData();
                        }
                    });
            }
        }

        $scope.editPurchaseCancelBtnClicked = function (val) {

            for (var i = 0; i < $scope.item.tbl_purch.length; i++) {
                if ($scope.selectedPurchase.id === $scope.item.tbl_purch[i].id) {
                    var purchase = JSON.parse(JSON.stringify($scope.item.tbl_purch[i]));
                    if (purchase.purch_date_create !== null) {
                        purchase.purch_date_create = $scope.item.tbl_purch[i].purch_date_create;
                    }
                    if (purchase.purch_date_expry !== null) {
                        purchase.purch_date_expry = $scope.item.tbl_purch[i].purch_date_expry;
                    }
                    $scope.selectedPurchase = purchase;
                    getDropDownListData();
                    break;
                }
            }
        }
        $scope.editShippingOkBtnClicked = function (val) {

            if (val.selectedShippingMeasurementUom !== null
                && val.selectedShippingMeasurementUom.uom_code !== undefined) {
                val.comp_ship_size_uom = val.selectedShippingMeasurementUom.uom_code;
            }
            if (val.selectedShippingWeightUom !== null
                && val.selectedShippingWeightUom.uom_code !== undefined) {
                val.comp_ship_weight_uom = val.selectedShippingWeightUom.uom_code;
            }
        }
        $scope.removePurchase = function (val) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: val }
                }
            });

            modalInstance.result.then(function (item) {

                componentService.removePurchase(item.val)
                    .then(function (response) {
                        if (response === true) {
                            var index = $scope.item.tbl_purch.indexOf(item.val);
                            $scope.item.tbl_purch.splice(index, 1);

                            if ($scope.item.tbl_purch.length > 0) {
                                var purchase = JSON.parse(JSON.stringify($scope.item.tbl_purch[0]));
                                if (purchase.purch_date_create !== null) {
                                    purchase.purch_date_create = $scope.item.tbl_purch[0].purch_date_create;
                                }
                                if (purchase.purch_date_expry !== null) {
                                    purchase.purch_date_expry = $scope.item.tbl_purch[0].purch_date_expry;
                                }
                                $scope.selectedPurchase = purchase;
                            } else {

                            }
                        }
                    });
            }, function () {

            });
        }

        $scope.btnDupPurchaseClicked = function () {
            if ($scope.selectedPurchase === undefined
                || $scope.selectedPurchase.id === undefined) {
                return;
            }

            componentService.duplicatePurchase($scope.selectedPurchase)
                .then(function (response) {
                    if (response !== null
                        && response.id !== undefined
                        && response.id > 0) {

                        if (response.purch_date_create !== null) {
                            response.purch_date_create = new Date(parseInt(response.purch_date_create.substr(6)));
                        }
                        if (response.purch_date_expry !== null) {
                            response.purch_date_expry = new Date(parseInt(response.purch_date_expry.substr(6)));
                        }
                        $scope.item.tbl_purch.push(response);
                        var purchase = JSON.parse(JSON.stringify(response));
                        if (purchase.purch_date_create !== null) {
                            purchase.purch_date_create = response.purch_date_create;
                        }
                        if (purchase.purch_date_expry !== null) {
                            purchase.purch_date_expry = response.purch_date_expry;
                        }
                        $scope.selectedPurchase = purchase;
                        getDropDownListData();
                    }
                });
        }

        $scope.recalcAcquisitionCost = function (val) {
            //console.log(val);
            if (val === null || val === undefined) return;
            val.purch_aqsn_cost_each = 0;
            if (val.purch_aqsn_cost > 0 && val.purch_puom_qty > 0) {
                val.purch_aqsn_cost_each = val.purch_aqsn_cost / val.purch_puom_qty;
            }
        }
        // end purchase        

        // cross ref
        $scope.crossRefTree = [];
        function getCrossRefTree() {
            if ($scope.item.id > 0 && $scope.item.comp_cat_id !== null) {
                categoryService.getCrossRefTree($scope.item.comp_cat_id)
                    .then(function (response) {
                        $scope.crossRefTree = response;
                        //console.log(response);
                    });
            }
        }

        $scope.openCrossRef = function (val) {
            //console.log(val);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/component/views/componentSetCrossRefModal.html',
                controller: 'componentSetCrossRefModalController',
                size: 'sm',
                resolve: {
                    item: {
                        parent: $scope.item,
                        equiv: val
                    }
                }
            });

            modalInstance.result.then(function (item) {

                var foundIndex = -1;
                for (var i = 0; i < $scope.item.tbl_X_ref.length; i++) {
                    if ($scope.item.tbl_X_ref[i].ID == item.data.ID) {
                        foundIndex = i;
                        if (item.stat === 'updated') {
                            $scope.item.tbl_X_ref[i].xref_FE_priority = item.data.xref_FE_priority;
                            $scope.item.tbl_X_ref[i].xref_exact = item.data.xref_exact;
                            $scope.item.tbl_X_ref[i].xref_life_cycle_id = item.data.xref_life_cycle_id;
                            $scope.item.tbl_X_ref[i].xref_notes = item.data.xref_notes;
                        } else if (item.stat === 'removed') {
                            $scope.item.tbl_X_ref.splice(foundIndex, 1);
                        }
                        break;
                    }
                }
                if (foundIndex < 0 && item.stat === 'updated') {
                    $scope.item.tbl_X_ref.push(item.data);
                }
            }, function () {

            });
        };

        $scope.openCrossRefFromGrid = function (val) {
            var data = {
                CatId: val.ID,
                Children: [],
                HasChildren: false,
                HasItem: false,
                Id: val.tbl_comp_equiv.id,
                IsItem: true,
                Name: val.tbl_comp_equiv.comp_desc_orig
            }
            $scope.openCrossRef(data);
        }

        // end cross ref

        // catagory

        $scope.catTreeOptions = {
            toggle: function (collapsed, sourceNodeScope) {
                //console.log('callapsed', collapsed);
                //console.log('sourceNodeScope', sourceNodeScope);

                if (!collapsed && sourceNodeScope.$modelValue != null) {
                    var cat = sourceNodeScope.$modelValue;
                    categoryService.getChildrenTreeNodes(cat.Id)
                        .then(function (response) {
                            // make sure current comp is not in the list
                            for (var i = 0; i < response.length; i++) {
                                if (!response[i].IsItem ||
                                    (response[i].IsItem && response[i].Id != $scope.item.id)) {
                                    cat.Children.push(response[i]);
                                }
                            }
                        });
                }
            }
        };

        $scope.openEquivComp = function (val) {
            $window.open(constants.baseUri + 'ComponentList/Edit/' + val.Id, '_blank');
        };

        $scope.setCategory = function (val) {

            var data = angular.copy($scope.item);
            data.comp_cat_id = val.Id;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/component/views/componentSetCategoryModal.html',
                controller: 'componentSetCategoryModalController',
                size: 'sm',
                resolve: {
                    item: data
                }
            });

            modalInstance.result.then(function (item) {
                $scope.item.comp_cat_id = item.comp_cat_id;
                // reset cat full path
                categoryService.getCatFullPath($scope.item.comp_cat_id)
                    .then(function (res) {
                        $scope.selectedCatFullPath = res;
                    });

                // clear tbl_x_ref
                $scope.item.tbl_X_ref = [];

            }, function () {

            });
        };

        // end category

        // trait
        $scope.addTrait = function () {

            var trait = {
                ID: 0,
                trait_comp_id: $scope.item.id,
                trait_trait_id: 0,
                tbl_trait: {}
            }

            if ($scope.traits.length > 0) {
                trait.trait_trait_id = $scope.traits[0].id;
                trait.tbl_trait = $scope.traits[0];
            }

            $scope.selectedCompTrait = trait;
            $scope.item.tbl_X_trait.push(trait);
        }

        $scope.editTraitBtnClicked = function (val) {
            $scope.selectedCompTrait = JSON.parse(JSON.stringify(val)); // make a copy      
        }

        $scope.editTraitBtnOkClicked = function (val) {

            $scope.selectedCompTrait.trait_trait_id = $scope.selectedCompTrait.selectedTrait.id;
            $scope.selectedCompTrait.tbl_trait = $scope.selectedCompTrait.selectedTrait;

            if (val.ID === 0) {
                // create               
                componentService.addTrait($scope.selectedCompTrait)
                    .then(function (response) {
                        if (response !== null && response.ID > 0) {
                            $scope.selectedCompTrait.ID = response.ID;
                            val = JSON.parse(JSON.stringify($scope.selectedCompTrait));
                            $scope.selectedCompTrait = {};
                        }
                    });
            } else {
                // update
                componentService.updateTrait($scope.selectedCompTrait)
                    .then(function (response) {
                        val = JSON.parse(JSON.stringify($scope.selectedCompTrait));
                        $scope.selectedCompTrait = {};
                    });
            }
        }

        $scope.editTraitBtnCancelClicked = function (val) {

            // remove from list if newly added to UI
            if ($scope.selectedCompTrait.ID === 0) {
                var index = $scope.item.tbl_X_trait.indexOf($scope.selectedCompTrait);
                $scope.item.tbl_X_trait.splice(index, 1);
            }

            $scope.selectedCompTrait = {};
        }

        $scope.removeTrait = function (val) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: val }
                }
            });

            modalInstance.result.then(function (item) {

                // todo: delete

                var index = $scope.item.tbl_X_trait.indexOf(item.val);
                $scope.item.tbl_X_trait.splice(index, 1);
            }, function () {

            });


        }
        // end trait

        // material
        $scope.addMaterial = function () {

            var material = {
                ID: 0,
                material_comp_id: $scope.item.id,
                material_material_id: $scope.materials[0].id,
                selectedMaterial: $scope.materials[0],
                material_primary: false
            };

            $scope.selectedCompMaterial = material;
            $scope.item.tbl_X_material.push(material);
        }

        $scope.editMaterialBtnClicked = function (val) {
            $scope.selectedCompMaterial = JSON.parse(JSON.stringify(val)); // make a copy      
        }

        $scope.editMaterialBtnOkClicked = function (val) {

            $scope.selectedCompMaterial.material_material_id = $scope.selectedCompMaterial.selectedMaterial.id;
            $scope.selectedCompMaterial.tbl_material = $scope.selectedCompMaterial.selectedMaterial;

            if (val.ID === 0) {
                // create               
                componentService.addMaterial($scope.selectedCompMaterial)
                    .then(function (response) {
                        if (response !== null && response.ID > 0) {
                            $scope.selectedCompMaterial.ID = response.ID;
                            val = JSON.parse(JSON.stringify($scope.selectedCompMaterial));
                            $scope.selectedCompMaterial = {};
                        }
                    });
            } else {
                // update
                componentService.updateMaterial($scope.selectedCompMaterial)
                    .then(function (response) {
                        if (response !== null) {
                            for (var i = 0; i < $scope.item.tbl_X_material.length; i++) {
                                if ($scope.item.tbl_X_material[i].ID === $scope.selectedCompMaterial.ID) {
                                    $scope.item.tbl_X_material[i] = JSON.parse(JSON.stringify($scope.selectedCompMaterial));
                                    break;
                                }
                            }
                            $scope.selectedCompMaterial = {};
                        }
                    });
            }
        }

        $scope.editMaterialBtnCancelClicked = function (val) {

            // remove from list if newly added to UI
            if ($scope.selectedCompMaterial.ID === 0) {
                var index = $scope.item.tbl_X_material.indexOf($scope.selectedCompMaterial);
                $scope.item.tbl_X_material.splice(index, 1);
            }

            $scope.selectedCompMaterial = {};
        }

        $scope.removeMaterial = function (val) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: val }
                }
            });

            modalInstance.result.then(function (item) {

                componentService.removeMaterial(item.val)
                    .then(function (response) {
                        if (response === true) {
                            var index = $scope.item.tbl_X_material.indexOf(item.val);
                            $scope.item.tbl_X_material.splice(index, 1);
                        }
                    });
            }, function () {

            });


        }
        // end material

        // specialty
        $scope.addSpecialty = function () {

            var specialty = {
                ID: 0,
                spclty_comp_id: $scope.item.id,
                spclty_spclty_id: $scope.specialties[0].id,
                selectedSpecialty: $scope.specialties[0]
            };

            $scope.selectedCompSpecialty = specialty;
            $scope.item.tbl_X_spclty.push(specialty);
        }

        $scope.editSpecialtyBtnClicked = function (val) {
            $scope.selectedCompSpecialty = JSON.parse(JSON.stringify(val)); // make a copy      
        }

        $scope.editSpecialtyBtnOkClicked = function (val) {

            $scope.selectedCompSpecialty.spclty_spclty_id = $scope.selectedCompSpecialty.selectedSpecialty.id;
            $scope.selectedCompSpecialty.tbl_spclty = $scope.selectedCompSpecialty.selectedSpecialty;

            if (val.ID === 0) {
                // create               
                componentService.addSpecialty($scope.selectedCompSpecialty)
                    .then(function (response) {
                        if (response !== null && response.ID > 0) {
                            $scope.selectedCompSpecialty.ID = response.ID;
                            val = JSON.parse(JSON.stringify($scope.selectedCompSpecialty));
                            $scope.selectedCompSpecialty = {};
                        }
                    });
            } else {
                // update
                componentService.updateSpecialty($scope.selectedCompSpecialty)
                    .then(function (response) {
                        if (response !== null) {
                            for (var i = 0; i < $scope.item.tbl_X_spclty.length; i++) {
                                if ($scope.item.tbl_X_spclty[i].ID === $scope.selectedCompSpecialty.ID) {
                                    $scope.item.tbl_X_spclty[i] = JSON.parse(JSON.stringify($scope.selectedCompSpecialty));
                                    break;
                                }
                            }
                            $scope.selectedCompSpecialty = {};
                        }
                    });
            }
        }

        $scope.editSpecialtyBtnCancelClicked = function (val) {

            // remove from list if newly added to UI
            if ($scope.selectedCompSpecialty.ID === 0) {
                var index = $scope.item.tbl_X_spclty.indexOf($scope.selectedCompSpecialty);
                $scope.item.tbl_X_spclty.splice(index, 1);
            }

            $scope.selectedCompSpecialty = {};
        }

        $scope.removeSpecialty = function (val) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: val }
                }
            });

            modalInstance.result.then(function (item) {
                componentService.removeSpecialty(item.val)
                    .then(function (response) {
                        if (response === true) {
                            var index = $scope.item.tbl_X_spclty.indexOf(item.val);
                            $scope.item.tbl_X_spclty.splice(index, 1);
                        }
                    });

            }, function () {

            });


        }
        // end specialty

        // label
        $scope.addLabel = function () {

            var label = {
                id: 0,
                lbl_comp_id: $scope.item.id,
                lbl_lang_id: $scope.languages[0].id,
                selectedLanguage: $scope.languages[0],
                lbl_desc: ''
            };

            $scope.selectedCompLabel = label;
            $scope.item.tbl_lbl.push(label);
        }

        $scope.editLabelBtnClicked = function (val) {
            $scope.selectedCompLabel = JSON.parse(JSON.stringify(val)); // make a copy      
        }

        $scope.editLabelBtnOkClicked = function (val) {

            $scope.selectedCompLabel.lbl_lang_id = $scope.selectedCompLabel.selectedLanguage.id;
            $scope.selectedCompLabel.tbl_lang = $scope.selectedCompLabel.selectedLanguage;

            if (val.id === 0) {
                // create               
                componentService.addLabel($scope.selectedCompLabel)
                    .then(function (response) {
                        if (response !== null && response.id > 0) {
                            $scope.selectedCompLabel.id = response.id;
                            val = JSON.parse(JSON.stringify($scope.selectedCompLabel));
                            $scope.selectedCompLabel = {};
                        }
                    });
            } else {
                // update
                componentService.updateLabel($scope.selectedCompLabel)
                    .then(function (response) {
                        if (response !== null) {
                            for (var i = 0; i < $scope.item.tbl_lbl.length; i++) {
                                if ($scope.item.tbl_lbl[i].id === $scope.selectedCompLabel.id) {
                                    $scope.item.tbl_lbl[i] = JSON.parse(JSON.stringify($scope.selectedCompLabel));
                                    break;
                                }
                            }
                            $scope.selectedCompLabel = {};
                        }
                    });
            }
        }

        $scope.editLabelBtnCancelClicked = function (val) {

            // remove from list if newly added to UI
            if ($scope.selectedCompLabel.id === 0) {
                var index = $scope.item.tbl_lbl.indexOf($scope.selectedCompLabel);
                $scope.item.tbl_lbl.splice(index, 1);
            }

            $scope.selectedCompLabel = {};
        }

        $scope.removeLabel = function (val) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: val }
                }
            });

            modalInstance.result.then(function (item) {
                //console.log(item);
                componentService.removeLabel(item.val)
                    .then(function (response) {
                        if (response === true) {
                            var index = $scope.item.tbl_lbl.indexOf(item.val);
                            $scope.item.tbl_lbl.splice(index, 1);
                        }
                    });
            }, function () {

            });


        }
        // end label

        // pix
        $scope.addPix = function () {

            var pix = {
                id: 0,
                pix_com_id: $scope.item.id,
                pix_desc: '',
                pix_pix: ''
            };

            $scope.selectedPix = pix;
            $scope.item.tbl_pix.push(pix);
        }

        $scope.editPixBtnClicked = function (val) {
            $scope.selectedPix = JSON.parse(JSON.stringify(val)); // make a copy      
        }

        $scope.editPixBtnOkClicked = function (val) {

            Upload.upload({
                url: constants.baseUri + 'ComponentList/UploadPix',
                data: { file: $scope.selectedPix.file, dto: $scope.selectedPix }
            }).then(function (res) {

                if (res.status === 200 && res.data !== "") {
                    if ($scope.selectedPix.id > 0) {
                        // updated
                        for (var i = 0; i < $scope.item.tbl_pix.length; i++) {
                            if ($scope.item.tbl_pix[i].id === res.data.id) {
                                $scope.item.tbl_pix[i] = JSON.parse(JSON.stringify(res.data));
                            }
                        }
                    } else if ($scope.selectedPix.id === 0) {
                        // created
                        console.log(res.data);
                        $scope.selectedPix.id = res.data.id;
                        $scope.selectedPix.pix_pix = res.data.pix_pix;
                        val = JSON.parse(JSON.stringify(res.data));
                    }

                    $scope.selectedPix = {};
                }

            }, function (res) {
                console.log('Error status: ' + res.status);
            }, function (evt) {
                //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });

        }

        $scope.editPixBtnCancelClicked = function (val) {

            // remove from list if newly added to UI
            if ($scope.selectedPix.id === 0) {
                var index = $scope.item.tbl_pix.indexOf($scope.selectedPix);
                $scope.item.tbl_pix.splice(index, 1);
            }

            $scope.selectedPix = {};
        }

        $scope.removePix = function (val) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: val }
                }
            });

            modalInstance.result.then(function (item) {
                //console.log(item);
                componentService.removePix(item.val)
                    .then(function (response) {
                        if (response === true) {
                            var index = $scope.item.tbl_pix.indexOf(item.val);
                            $scope.item.tbl_pix.splice(index, 1);
                        }
                    });
            }, function () {

            });
        }

        $scope.save = function () {
            //var item = JSON.parse(JSON.stringify($scope.item)); // make a copy    

            if ($scope.selectedVendor !== null) {
                $scope.item.comp_vend_id = $scope.selectedVendor.id;
            }
            if ($scope.selectedMfg !== null) {
                $scope.item.comp_mfgr_id = $scope.selectedMfg.id
                //console.log(item);
            }
            if ($scope.selectedCountry !== null) {
                $scope.item.comp_coo_id = $scope.selectedCountry.id;
            }
            if ($scope.selectedSterility !== null) {
                $scope.item.comp_strlty = $scope.selectedSterility.id;
                if ($scope.selectedSterility.id != 0) {
                    $scope.strlty_cb = true;
                }
                else {
                    $scope.strlty_cb = false;
                }
            }
            if ($scope.selectedStat !== null) {
                $scope.item.comp_status_id = $scope.selectedStat.id;
                if ($scope.selectedStat.id != 6) {
                    $scope.item.comp_temp_item = false;
                }
            }
            if ($scope.selectedProdMgr !== null) {
                $scope.item.comp_pm = $scope.selectedProdMgr.id;
            }
            if ($scope.selectedPurchase !== null) {
                $scope.editPurchaseOkBtnClicked($scope.selectedPurchase);
            }
            if ($scope.item.comp_latex !== null) {
                $scope.item.comp_latex = $scope.item.comp_latex;
            }
            if ($scope.item.comp_strlty !== null) {
                $scope.item.comp_strlty = $scope.item.comp_strlty;

            }
            if ($scope.item.comp_acl !== null) {
                $scope.item.comp_acl = $scope.item.comp_acl;
            }
            if ($scope.item.comp_deleted !== null) {
                $scope.item.comp_deleted = $scope.item.comp_deleted;
            }
            if ($scope.selectedShipping !== null) {
                $scope.editShippingOkBtnClicked($scope.selectedShipping);
            }
            if ($scope.selectedShipping.selectedShippingMeasurementUom !== null) {
                $scope.item.comp_ship_size_uom = $scope.selectedShipping.selectedShippingMeasurementUom.uom_code
            }
            if ($scope.selectedShipping.selectedShippingWeightUom !== null) {
                $scope.item.comp_ship_weight_uom = $scope.selectedShipping.selectedShippingWeightUom.uom_code
            }
            // check dup vendor + vendor part
            var checkExistModel = {
                comp_vend_id: $scope.item.comp_vend_id,
                comp_vend_pn: $scope.item.comp_vend_pn,
                id: $scope.item.id
            };

            componentService.isExist(checkExistModel)
                .then(function (response) {
                    if (response === false) {
                        var copy = angular.copy($scope.item);
                        copy.tbl_X_ref = null;
                        componentService.update($scope.item.id, copy)
                            .then(function (response) {
                                if ($scope.callbackMethod !== undefined) {
                                    window.location.href = $scope.callbackMethod;
                                }
                                if (response == true) {
                                    alertService.success('Saved');
                                    var requester = getQueryString('requester', window.location.href);
                                    var quoteID = getQueryString('quoteID', window.location.href);
                                    var quoteQN = getQueryString('quoteQN', window.location.href);
                                    if ($scope.item.comp_acl == true && requester != null) {
                                        $scope.sendACLApprovalNotification(requester, quoteID, quoteQN);
                                    }                                    
                                } else {
                                    alertService.error('Unable to save');
                                }
                            });
                    } else {
                        alertService.error('Same Vendor and Vendor PN exists');
                    }
                });
        }

        $scope.remove = function () {
            // getCompQuotes();
            var itemId = parseInt($scope.item.id);
            var params = { PageSize: 10, PageNumber: 1, Id: itemId, Status_Id: $scope.param.Status_Id };
            var modalInstance = $uibModal.open({
                animation: true,
                // templateUrl: '../../scripts/app/core/views/confirmationModal.html',
                // controller: 'confirmationModalController',
                templateUrl: '../../scripts/app/component/views/componentDeleteModal.html',
                controller: 'componentDeleteModalController',
                size: 'sm',
                resolve: {
                    item: {
                        msg: "Are you sure? Any Active Quotes and Finished Goods are shown below:",
                        val: params /*$scope.item.id*/
                    } //pass getCompQuotes response.Data instead of id 
                }
            });

            modalInstance.result.then(function (item) {
                //console.log(item);
                componentService.remove(item.val)
                    .then(function (response) {
                        if (response === true) {
                            window.location.href = '/ComponentList';
                        }
                    });
            }, function () {

            });
        }

        getTrays();

        function getTrays() {
            var params = { PageSize: 10000, PageNumber: 1, id: $scope.item.id, qthdr_status_id: 6 };
            $scope.busy = true;
            // $scope.param.id = $scope.item.id;
            var clone = JSON.stringify(params);
            // $scope.param.Status_Id = 6;

            if (clone === JSON.stringify(params)) {
                //componentService.getCompTrays($scope.param)
                componentService.getCompByQuote(params)
                    .then(function (response) {
                        $scope.Trays = response.Data;
                        $scope.amuTotal = response.Total;
                        $scope.Total = response.Data.length;
                        $scope.numberPages = Math.ceil(response.Total / params.PageSize)
                        $scope.busy = false;
                    });
            }
        }

        $scope.requestACLApproval = function () {
            var quoteID = getQueryString('quoteID', window.location.href);
            var quoteQN = getQueryString('quoteQN', window.location.href);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/component/views/componentRequestReasonModal.html',
                controller: 'componentRequestReasonModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: null }
                }
            });

            modalInstance.result.then(function (item) {                
                $scope.sendACLRequestReason = item.requestReason;
                componentService.sendACLApprovalRequest(angular.copy($scope.item), quoteID, quoteQN, angular.copy($scope.sendACLRequestReason))
                    .then(function (response) { alertService.success('Request Sent!'); });
            });

        }

        var getQueryString = function (field, url) {
            var href = url ? url : window.location.href;
            var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
            var string = reg.exec(href);
            return string ? string[1] : null;
        };

        $scope.sendACLApprovalNotification = function (requester, quoteID, quoteQN) {
            var compID = $scope.item.id;
            var requesterEmail = requester;
            var quoteID = quoteID;
            var quoteQN = quoteQN;
            componentService.sendACLApprovalNotification(compID, requesterEmail, quoteID, quoteQN)
                .then(function (response) { alertService.success('ACL Notification Sent'); });
        }
        var requester = getQueryString('requester', window.location.href);
        if (requester != null) {
            $scope.activeACLApprovalProcess = true;
        }

        $scope.rejectACLApproval = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/component/views/componentRejectReasonModal.html',
                controller: 'componentRejectReasonModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: null }
                }
            });

            modalInstance.result.then(function (item) {                                
                $scope.sendACLRejectionNotification(item.rejectReason);
            });
        }

        $scope.sendACLRejectionNotification = function (reason) {
            var compID = $scope.item.id;
            var requester = getQueryString('requester', window.location.href);
            var quoteID = getQueryString('quoteID', window.location.href);
            var quoteQN = getQueryString('quoteQN', window.location.href);
            var rejectReason = encodeURI(reason);
            componentService.sendACLRejectionNotification(compID, requester, quoteID, quoteQN, rejectReason)
                .then(function (response) { alertService.success('Rejection Notification Sent'); });
        }

        $scope.getACLAccountExeptions = function () {
            $scope.busy = true;
            getACLAccountExeptions();
            $scope.busy = false;
        }
        function getACLAccountExeptions() {
            var compID = $scope.item.id;
            componentService.getACLAccountExeptions(compID)
                .then(function (response) {
                    $scope.ACLAccountExeptions = response;
                    for (var i = 0; i < response.length; i++) {
                        $scope.ACLAccountExeptions[i].expiration_date = new Date(parseInt(response[i].expiration_date.substr(6)));
                    }                   
                });
        }

        $scope.addACLException = function () {
            addACLException();
        }
        function addACLException() {
            //console.log($scope.ACLAccountExeptions);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/component/views/componentAddACLExceptionModal.html',
                controller: 'componentAddACLExceptionModalController',
                size: 'lg',
                resolve: {
                    item: { msg: null, val: $scope.ACLAccountExeptions }
                }
            });

            modalInstance.result.then(function (data) {
                var newLines = [];                
                for (var i = 0; i < data.length; i++) { 
                    var newLine = {
                        comp_id: $scope.item.id,
                        account_id: data[i].id,
                        expiration_date: data[i].expiration_date
                    }
                    newLines.push(newLine);
                }
                componentService.addACLAccountExeptions(newLines)                
                    .then(function (response) {
                        //console.log(response);
                        if (response) {
                            alertService.success('Exceptions added.');
                            getACLAccountExeptions();
                        }
                    });
            });            
        };

        $scope.removeACLException = function (exception) {
            removeACLException(exception);            
        }
        function removeACLException(exception) {
            componentService.removeACLAccountExeptions(exception.id)
                .then(function (response) {
                    alertService.success('Exception Removed');
                    getACLAccountExeptions();
                });            
        }

        $scope.updateACLException = function (exception) {            
            updateACLException(exception);
        }
        function updateACLException(data) {
            //console.log(data);
            var lines = [];
            //console.log(data.length);
            for (var i = 0; i < data.length; i++) {
                var line = {
                    comp_id: $scope.item.id,
                    account_id: data[i].id,
                    expiration_date: data[i].expiration_date                   
                }
                //console.log([i]);
                lines.push(line);
            }
            //console.log(lines);
            componentService.updateACLAccountExeptions(data)
                .then(function (response) {
                    alertService.success('Exception Updated');
                    getACLAccountExeptions();
                });
        }
    }
})();