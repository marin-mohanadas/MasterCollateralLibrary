/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.component')
        .controller('componentController', ['$scope', '$uibModal', 'componentService', 'quoteService', 'vendorService', 'categoryService', componentController]);

    function componentController($scope, $uibModal, componentService,
        quoteService, vendorService, categoryService) {

        $scope.item = {
            tbl_purch: [],
            tbl_X_ref: [],
            tbl_X_cat: [],
            tbl_X_trait: [],
            tbl_X_material: [],
            tbl_X_spclty: [],
            tbl_lbl: []
        };
        $scope.selectedPurchase = {};

        $scope.lbPurchasePage = '0 of 0';        

        getDropDownListData();

        function getDropDownListData() {
            $scope.selectedVendor = null;
            $scope.selectedMfg = null;
            $scope.selectedCountry = null;
            $scope.selectedSterility = null;            
            $scope.selectedStat = null;
            $scope.selectedProdMgr = null;
            $scope.selectedCurrency = null;
            $scope.selectedPlant = null;
            $scope.selectedCostType = null;
            $scope.selectedPurchaseUom = null;
            $scope.selectedSellingUom = null;
            $scope.selectedUsageUom = null;
            
            getVendors();
            getCountries();
            getSterilities();            
            getStats();
            getProdMgrs();
            getCurrencies();
            getPlants();
            getCostTypes();
            getUoms();
            getLifeCycles();
            getProduct1Categories();            
            getTraits();
            getMaterials();
            getSpecialties();
            getLanguages();
        }

        $scope.selectedVendor = null;
        $scope.selectedMfg = null;
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
                        else if (res[i].id === $scope.item.comp_mfgr_id) {
                            $scope.selectedMfg = rest[i];
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

        $scope.selectedCurrency = null;
        $scope.currencies = [];
        function getCurrencies() {
            quoteService.getSellCurrency()
                .then(function (res) {
                    $scope.currencies = res;
                    if ($scope.item === undefined) return;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.selectedPurchase.purch_currncy_id) {
                            $scope.selectedCurrency = res[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedPlant = null;
        $scope.plants = [];
        function getPlants() {
            quoteService.getMfgPlants()
                .then(function (res) {
                    $scope.plants = res;
                    if ($scope.item === undefined) return;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.selectedPurchase.purch_plant_id) {
                            $scope.selectedPlant = res[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedCostType = null;
        $scope.costTypes = [];
        function getCostTypes() {
            componentService.getCostTypes()
                .then(function (res) {
                    $scope.costTypes = res;
                    if ($scope.item === undefined) return;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.selectedPurchase.purch_cost_type_id) {
                            $scope.selectedCostType = res[i];
                            break;
                        }
                    }
                });
        }

        $scope.selectedPurchaseUom = null;
        $scope.selectedSellingUom = null;
        $scope.selectedUsageUom = null;
        $scope.uoms = [];
        function getUoms() {
            componentService.getUoms()
                .then(function (res) {
                    $scope.uoms = res;
                    if ($scope.item === undefined) return;

                    var foundPurchaseUom = false;
                    var foundSellingUom = false;
                    var foundUsageUom = false;

                    for (var i = 0; i < res.length; i++) {
                        if (res[i].uom_code === $scope.selectedPurchase.purch_puom) {
                            $scope.selectedPurchaseUom = res[i];                            
                            foundPurchaseUom = true;
                        }
                        else if (res[i].uom_code === $scope.selectedPurchase.purch_suom) {
                            $scope.selectedSellingUom = res[i];
                            foundSellingUom = true;
                        }
                        else if (res[i].uom_code === $scope.selectedPurchase.purch_uuom) {
                            $scope.selectedUsageUom = res[i];
                            foundUsageUom = true;
                        }

                        if (foundPurchaseUom === true
                            && foundSellingUom === true
                            && foundUsageUom === true) {
                            break;
                        }
                    }
                });
        }

        $scope.lifeCycles = [];
        function getLifeCycles() {
            componentService.getLifeCycles()
                .then(function (res) {
                    $scope.lifeCycles = res;                    
                });
        }

        $scope.product1Categories = [];
        function getProduct1Categories() {
            categoryService.getProduct1Categories()
                .then(function (res) {
                    $scope.product1Categories = res;                                        
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
                    if($scope.item === undefined || $scope.item.tbl_lbl === undefined) return;
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

        $scope.selectedCat1Changed = function (cat) {            
            cat.cat_cat1_id = cat.selectedProduct1Cat.id;
            cat.tbl_cat1 = cat.selectedProduct1Cat;
            cat.cat_cat2_id = null;
            getProduct2CategoriesByCat1Id(cat.selectedProduct1Cat);
        }

        $scope.product2Categories = [];
        function getProduct2CategoriesByCat1Id(cat1) {
            categoryService.getProduct2CategoriesByCat1Id(cat1.id)
                .then(function (res) {
                    $scope.product2Categories = res;                    
                    //console.log(res);
                    if ($scope.selectedCat.cat_cat2_id === undefined
                        || $scope.selectedCat.cat_cat2_id === null
                        || $scope.selectedCat.cat_cat2_id === 0) {
                        $scope.selectedCat.cat_cat2_id = res[0].id;
                        $scope.selectedCat.selectedProduct2Cat = res[0];
                    }
                    else {
                        for (var i = 0; i < res.length; i++) {
                            if ($scope.selectedCat.cat_cat2_id === res[i].id) {
                                $scope.selectedCat.selectedProduct2Cat = res[i];
                            }
                        }
                    }

                    for (var i = 0; i < $scope.item.tbl_X_cat.length; i++) {
                        if ($scope.selectedCat.ID == $scope.item.tbl_X_cat[i].ID) {
                            $scope.item.tbl_X_cat[i].tbl_cat2 = $scope.selectedCat.selectedProduct2Cat;
                            break;
                        }
                    }
                });
        }
                
        $scope.clear = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/core/views/clearModal.html',
                controller: 'clearModalController',
                size: 'lg',
                resolve: {
                    item: $scope.item
                }
            });

            modalInstance.result.then(function (quote) {
                $scope.item = {
                    tbl_purch: [],
                    tbl_X_ref_equiv: [],
                    tbl_X_cat: [],
                    tbl_X_trait: [],
                    tbl_X_material: [],
                    tbl_X_spclty: [],
                    tbl_lbl: []
                };
                $scope.selectedPurchase = {};
                getDropDownListData();

            }, function () {
                // cancel
            });
        }

        $scope.openSearch = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/component/views/componentSearchModal.html',
                controller: 'componentSearchModalController',
                size: 'lg',
                resolve: {

                }
            });

            modalInstance.result.then(function (item) {

                if (item !== null) {
                    componentService.getComponentEdit(item.id)
                        .then(function (res) {                            
                            $scope.item = res;     
                            //console.log(res);
                            if (res !== undefined && res.tbl_purch.length > 0) {
                                $scope.selectedPurchase = res.tbl_purch[0];                                
                                getDropDownListData();
                                $scope.lbPurchasePage = '1 of ' + res.tbl_purch.length;
                            }                            
                        });
                }

            }, function () {
                // cancel
            });
        }        

        // purchase
        $scope.btnPurchasePreviousClicked = function () {
            var index = 0;
            for (var i = 0; i < $scope.item.tbl_purch.length; i++) {
                if ($scope.item.tbl_purch[i] === $scope.selectedPurchase) {
                    index = i;
                }
            }
            
            if (index > 0) {
                $scope.selectedPurchase = $scope.item.tbl_purch[--index];
                $scope.lbPurchasePage = (index + 1) + ' of ' + $scope.item.tbl_purch.length;
                getDropDownListData();
            }            
        }

        $scope.btnPurchaseNextClicked = function () {
            var index = 0;
            for (var i = 0; i < $scope.item.tbl_purch.length; i++) {
                if ($scope.item.tbl_purch[i] === $scope.selectedPurchase) {
                    index = i;
                }
            }

            if (index < ($scope.item.tbl_purch.length - 1)) {
                $scope.selectedPurchase = $scope.item.tbl_purch[++index];
                $scope.lbPurchasePage = (index + 1) + ' of ' + $scope.item.tbl_purch.length;
                getDropDownListData();
            }            
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
                        $scope.selectedPurchase = response;
                        $scope.lbPurchasePage = $scope.item.tbl_purch.length + ' of ' + $scope.item.tbl_purch.length;
                    }
                });
        }
        // end purchase

        // cross ref
        $scope.addRef = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/component/views/componentSearchModal.html',
                controller: 'componentSearchModalController',
                size: 'lg',
                resolve: {

                }
            });

            modalInstance.result.then(function (item) {

                if (item !== null) {
                    var model = {
                        xref_comp_id: $scope.item.id,
                        xref_equiv_compid: item.id,
                        xref_FE_priority: 1,
                        xref_exact: true,
                        xref_life_cycle_id: $scope.lifeCycles[0].id,
                        selectedLifeCycle: $scope.lifeCycles[0],
                        tbl_life_cycle: $scope.lifeCycles[0],
                        ID: 0,
                        tbl_comp_equiv: item
                    }

                    // todo: need to make sure comp exist if not must create first

                    componentService.addCrossRef(model)
                        .then(function (response) {
                            if (response !== null && response.ID > 0) {
                                model.ID = response.ID;
                                $scope.item.tbl_X_ref.push(model);
                            }                            
                        });                    
                }

            }, function () {
                // cancel
            });
        }

        $scope.editRefBtnClicked = function (val) {
            $scope.selectedCrossRef = JSON.parse(JSON.stringify(val)); // make a copy  
            //console.log($scope.selectedCrossRef);
            for (var i = 0; i < $scope.lifeCycles.length; i++) {
                if ($scope.selectedCrossRef.xref_life_cycle_id === $scope.lifeCycles[i].id) {
                    $scope.selectedCrossRef.selectedLifeCycle = $scope.lifeCycles[i];
                    break;
                }
            }
        }

        $scope.editRefBtnOkClicked = function (val) {

            $scope.selectedCrossRef.xref_life_cycle_id = $scope.selectedCrossRef.selectedLifeCycle.id;
            $scope.selectedCrossRef.tbl_life_cycle = $scope.selectedCrossRef.selectedLifeCycle;            

            componentService.updateCrossRef($scope.selectedCrossRef)
                .then(function (response) {
                    if (response !== null && response.ID > 0) {
                        for (var i = 0; i < $scope.item.tbl_X_ref.length; i++) {
                            if ($scope.item.tbl_X_ref[i].ID === response.ID) {
                                $scope.item.tbl_X_ref[i] = JSON.parse(JSON.stringify($scope.selectedCrossRef));
                                $scope.selectedCrossRef = {};
                                break;
                            }
                        }
                    }
                });
            
        }

        $scope.editRefBtnCancelClicked = function (val) {            
            $scope.selectedCrossRef = {};
        }

        $scope.removeRef = function (val) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: val }
                }
            });

            modalInstance.result.then(function (item) {

                componentService.removeCrossRef(item.val)
                    .then(function (response) {
                        //console.log(response);
                        if (response === true) {
                            var index = $scope.item.tbl_X_ref.indexOf(item.val);
                            $scope.item.tbl_X_ref.splice(index, 1);
                        }
                    });                
            }, function () {

            });


        }
        // end cross ref

        // catagory
        $scope.addCat = function () {

            var cat = {
                cat_comp_id: $scope.item.id,
                cat_cat1_id: $scope.product1Categories[0].id,
                selectedProduct1Cat: $scope.product1Categories[0],           
                cat_cat2_id: 0,
                ID: 0
            };

            $scope.selectedCat = cat;
            $scope.item.tbl_X_cat.push(cat);
            getProduct2CategoriesByCat1Id(cat.selectedProduct1Cat);                                          
        }

        $scope.editCatBtnClicked = function (val) {
            $scope.selectedCat = JSON.parse(JSON.stringify(val)); // make a copy            
            
            for (var i = 0; i < $scope.product1Categories.length; i++) {
                if ($scope.product1Categories[i].id === $scope.selectedCat.cat_cat1_id) {
                    $scope.selectedCat.selectedProduct1Cat = $scope.product1Categories[i];                    
                    getProduct2CategoriesByCat1Id($scope.product1Categories[i]);
                    break;
                }
            }            
        }

        $scope.editCatBtnOkClicked = function (val) {

            $scope.selectedCat.cat_cat2_id = $scope.selectedCat.selectedProduct2Cat.id;
            $scope.selectedCat.tbl_cat2 = $scope.selectedCat.selectedProduct2Cat;

            if (val.ID == 0) {
                // create               
                componentService.addCategory($scope.selectedCat)
                    .then(function (response) {
                        if (response !== null && response.ID > 0) {
                            $scope.selectedCat.ID = response.ID;
                            val = JSON.parse(JSON.stringify($scope.selectedCat));
                            $scope.selectedCat = {};
                        }
                    });
            } else {
                // update
                componentService.updateCategory($scope.selectedCat)
                    .then(function (response) {

                        for (var i = 0; i < $scope.item.tbl_X_cat.length; i++) {
                            if ($scope.item.tbl_X_cat[i].ID == response.ID) {
                                $scope.item.tbl_X_cat[i] = JSON.parse(JSON.stringify($scope.selectedCat));
                                break;
                            }
                        }
                        
                        $scope.selectedCat = {};
                    });
            }
        }

        $scope.editCatBtnCancelClicked = function (val) {

            // remove from list if newly added cat UI
            if ($scope.selectedCat.ID === 0) {                
                var index = $scope.item.tbl_X_cat.indexOf($scope.selectedCat);                
                $scope.item.tbl_X_cat.splice(index, 1);
            }

            $scope.selectedCat = {};
        }

        $scope.removeCat = function (cat) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: cat }
                }
            });

            modalInstance.result.then(function (item) {
                componentService.removeCategory(item.val)
                    .then(function (response) {
                        if (response === true) {
                            var index = $scope.item.tbl_X_cat.indexOf(item.val);
                            $scope.item.tbl_X_cat.splice(index, 1);
                        }
                    });                
            }, function () {

            });


        }   
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
            
            if (val.ID == 0) {
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
                templateUrl: 'scripts/app/core/views/confirmationModal.html',
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

            if (val.ID == 0) {
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
                templateUrl: 'scripts/app/core/views/confirmationModal.html',
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

            if (val.ID == 0) {
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
                templateUrl: 'scripts/app/core/views/confirmationModal.html',
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
            
            if (val.id == 0) {
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
                templateUrl: 'scripts/app/core/views/confirmationModal.html',
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
    }
})();