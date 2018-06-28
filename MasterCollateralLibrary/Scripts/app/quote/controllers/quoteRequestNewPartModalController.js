/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.quote')
        .controller('quoteRequestNewPartModalController', ['$scope', 'item','$uibModalInstance', 'componentService',
            'vendorService', 'customerService', 'gpoService','distributorService', quoteRequestNewPartModalController]);

    function quoteRequestNewPartModalController($scope, item, $uibModalInstance, componentService, vendorService, customerService, gpoService, distributorService) {
        
        $scope.item = {
            id: 0,
            comp_vend_id: null,
            comp_mfgr_id: null,
            comp_vend_pn: '',            
            comp_desc_orig: '',            
            comp_status_id: null,            
            comp_is_assembly: false,
            comp_pub_desc: '',
            comp_comments: '',
            quantity: 1,
            level: 'Pack',
            comp_temp_item: true,
        };        

        customerService.getCustomerByid(item)
                .then(function (response) {
                    $scope.account = response; 
                    if (response !== undefined) {
                        get_auth_dist(response.acct_auth_dist_id);
                        getGPO(response.acct_gpo_id);
                    }
                    
            });

        function getGPO(id) {
            gpoService.getGPO(id)
                .then(function (response) {                 
                    $scope.account.gpo = response.gpo_name;              
                });
        }
        function get_auth_dist(id) {
            distributorService.getDistributor(id)
                .then(function (response) {
                    $scope.account.auth_dist = response.dist_name;
                });
        }

        $scope.errors = [];
        $scope.levels = ['Case', 'Pack'];

        $scope.selectedVendor = null;
        $scope.selectedMfg = null;
        $scope.vendors = [];
        
        vendorService.getVendors()
            .then(function (res) {
                $scope.vendors = res;            
                if (res.length > 0) {
                    $scope.selectedVendor = res[0];
                    $scope.item.comp_vend_id = res[0].id;
                    $scope.selectedMfg = res[0];
                    $scope.item.comp_mfgr_id = res[0].id;
                }
            });
        

        $scope.selectedStat = null;
        $scope.stats = [];
        
        componentService.getStats()
            .then(function (res) {
                $scope.stats = res;                    
                for (var i = 0; i < res.length; i++) {
                    if (res[i].stat_desc === 'Temp') {
                        $scope.selectedStat = res[i];
                        $scope.item.comp_status_id = res[i].id;
                        break;
                    }
                }
                $scope.item.comp_status_id = 6;
            });
        

        $scope.ok = function () {
            $scope.errors = [];
            //if ($scope.selectedStat !== null) {
            //    $scope.item.comp_status_id = $scope.selectedStat.id;
            //} else {
            //    $scope.item.comp_status_id = 6;
            //    $scope.errors.push('status is required');
            //}
            //if ($scope.selectedVendor !== null) {
            //    $scope.item.comp_vend_id = $scope.selectedVendor.id;
            //} else {
            //    $scope.errors.push('vendor is required');
            //}

            if ($scope.selectedMfg !== null) {
                $scope.item.comp_mfgr_id = $scope.selectedMfg.id;
               // $scope.item.comp_vend_id = $scope.selectedMfg.id;
            } else {
                $scope.errors.push('mfg is required');
            }

            if ($scope.item.comp_vend_pn.length == 0) {
                $scope.errors.push('Vendor Part Number is required')
            }

            if ($scope.item.comp_desc_orig.length == 0) {
                $scope.errors.push('Description is required')
            }

            if ($scope.errors.length > 0) {
                return;
            }

            // check dup
            componentService.isExist($scope.item)
                .then(function (response) {
                    if (response === true) {
                        $scope.errors.push('Vendor and Vendor Part Number already exist');
                    } else if (response === false) {                        
                        //componentService.create($scope.item)
                        componentService.requestNewItem($scope.item)
                            .then(function (res) {
                                if (res !== '' && res.id > 0) {
                                    res.quantity = $scope.item.quantity;
                                    res.level = $scope.item.level;
                                    $uibModalInstance.close(res);                                    
                                }
                            });   
                    }
                });    
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };        
       
    }

})();