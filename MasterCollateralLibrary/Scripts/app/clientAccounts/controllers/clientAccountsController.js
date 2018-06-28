

(function () {
    'use strict';

    angular
        .module('app.clientAccounts')
        .controller('clientAccountsController', ['$scope', '$q', '$location', 'clientAccountsService',
            'quoteService', 'distributorService', 'gpoService', 'alertService', clientAccountsController]);

    function clientAccountsController($scope, $q, $location, clientAccountsService,
        quoteService, distributorService, gpoService, alertService) {

        $scope.clientAccount = {
            id: 0,
            acct_name: '',
            acct_city: '',
            acct_state: '',
            acct_cntry: '',
            acct_3code: '',
            acct_whrhs: '',
            acct_frght: '',
            acct_misc: '',
            acct_logstcs: '',
            acct_admin: '',
            acct_contract_start: null,
            acct_contract_end: null,
            acct_assoc: null,
            acct_gpo_id: null,
            acct_auth_dist_id: null,
            acct_cat_id: null,
            acct_marketing_percent_fee: null,
            acct_gpo_percent_fee: null,
            acct_spif_percent_fee: null,
            acct_dist_street1: '',
            acct_dist_street2: '',
            acct_dist_city: '',
            acct_dist_state: '',
            acct_dist_zip: '',
            acct_dist_country: '',
            acct_rep_id: null,
            acct_address: '',
            acct_zip: '',
            acct_primary_contact_name: '',
            acct_primary_contact_dept: '',
            acct_primary_contact_phone: '',
            acct_primary_contact_email: '',
            acct_secondary_contact_name: '',
            acct_secondary_contact_dept: '',
            acct_secondary_contact_phone: '',
            acct_secondary_contact_email: ''
        };

        $scope.errors = [];

        var temp = window.location.pathname.split('/');
        var id = 0;
        if (temp.length === 4) {
            id = temp[3];
        }

        if (id > 0) {
            clientAccountsService.getClientAccountEdit(id)
                .then(function(response) {
                    if (response !== "" && response !== undefined) {
                        if (response.acct_contract_start !== null) {
                            response.acct_contract_start = new Date(parseInt(response.acct_contract_start.substr(6)));
                        }
                        if (response.acct_contract_end !== null) {
                            response.acct_contract_end = new Date(parseInt(response.acct_contract_end.substr(6)));
                        }
                        $scope.clientAccount = response;
                        getDropDownListData();
                    }
                });
        } else {
            getDropDownListData();
        }

        
        function getDropDownListData() {
            $scope.selectedCompany = null;
            getBrands();
            getCategories();
            getDistributors();
            getGPOs();
            getReps();
        }

        $scope.brands = [];
        $scope.selectedCompany = null;        
        function getBrands() {
            quoteService.getBrands()
                .then(function (res) {
                    $scope.brands = res;
                    //console.log(res);
                    if ($scope.clientAccount === undefined) return;
                    var brandFound = false;

                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.clientAccount.acct_assoc) {
                            $scope.selectedCompany = res[i];
                            brandFound = true;
                        }
                        if (brandFound === true) break;
                    }
                });
        }

        $scope.categories = [];
        $scope.selectedCategory = null;
        function getCategories() {
            clientAccountsService.getAccountCategories()
                .then(function (response) {
                    $scope.categories = response;
                    if (!$scope.clientAccount
                        || $scope.clientAccount.id < 1
                        || $scope.clientAccount.acct_cat_id === null) {
                        return;
                    }
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].id === $scope.clientAccount.acct_cat_id) {
                            $scope.selectedCategory = response[i];
                            break;
                        }                        
                    }
                });
        }

        $scope.distributors = [];
        $scope.selectedDistributor = null;
        function getDistributors() {
            distributorService.getDistributors()
                .then(function (response) {
                    $scope.distributors = response;
                    if ($scope.clientAccount.id === 0
                        || $scope.clientAccount.acct_auth_dist_id === null) {
                        return;
                    }
                    for (var i = 0; i < response.length; i++) {
                        if ($scope.clientAccount.acct_auth_dist_id === response[i].id) {
                            $scope.selectedDistributor = response[i];                            
                            break;
                        }
                    }
                });
        }

        $scope.gpos = [];
        $scope.selectedGPO = null;
        function getGPOs() {
            gpoService.getGPOs()
                .then(function (response) {
                    $scope.gpos = response;
                    if ($scope.clientAccount.id === 0
                        || $scope.clientAccount.acct_gpo_id === null) {
                        return;
                    }
                    for (var i = 0; i < response.length; i++) {
                        if ($scope.clientAccount.acct_gpo_id === response[i].id) {
                            $scope.selectedGPO = response[i];
                            break;
                        }
                    }
                });
        }

        $scope.reps = [];
        $scope.selectedRep = null;
        function getReps() {
            quoteService.getSalesReps()
                .then(function (response) {
                    $scope.reps = response;
                    if ($scope.clientAccount.id < 1) return;
                    for (var i = 0; i < response.length; i++) {
                        if (response[i].id === $scope.clientAccount.acct_rep_id) {
                            $scope.selectedRep = response[i];
                            break;
                        }
                    }
                });
        }

        $scope.save = function () {
            if ($scope.selectedCompany !== null) {
                $scope.clientAccount.acct_assoc = $scope.selectedCompany.id;
            }
            if ($scope.selectedCategory !== null) {
                $scope.clientAccount.acct_cat_id = $scope.selectedCategory.id;
            }
            if ($scope.selectedDistributor !== null) {
                $scope.clientAccount.acct_auth_dist_id = $scope.selectedDistributor.id;
            }
            if ($scope.selectedGPO !== null) {
                $scope.clientAccount.acct_gpo_id = $scope.selectedGPO.id;
            }
            if ($scope.selectedRep !== null) {
                $scope.clientAccount.acct_rep_id = $scope.selectedRep.id;
            }
            if ($scope.clientAccount.acct_address !== null) {
                $scope.clientAccount.acct_address = $scope.clientAccount.acct_address;
            }
            if ($scope.clientAccount.acct_zip !== null) {
                $scope.clientAccount.acct_zip = $scope.clientAccount.acct_zip;
            }
            // validation
            $scope.errors = [];
            if ($scope.clientAccount.acct_3code.length < 1) {
                $scope.errors.push('Account Code is required.');
                return;
            }

            if ($scope.errors.length > 0) {
                return;
            }

            // validate dup acct code
            clientAccountsService.isAccountCodeExists($scope.clientAccount.acct_3code, $scope.clientAccount.id)
                .then(function (response) {
                    console.log('val', response);
                    if (response === false) {
                        // update
                        if ($scope.clientAccount.id > 0) {
                            clientAccountsService.updateClientAccount($scope.clientAccount)
                                .then(function (res) {
                                    if (res === true) {
                                        //Show result notification
                                        window.location.href = "/ClientAccounts/";
                                    }
                                });
                        } else { // create
                            clientAccountsService.createClientAccount($scope.clientAccount)
                                .then(function (res) {
                                    if (res.id > 0) {
                                        window.location.href = "/ClientAccounts/Edit/" + res.id;
                                    }
                                });
                        }                        
                    } else {
                        $scope.errors.push('Account Code already exists.');
                    }
                });
        }

        $scope.cancel = function () {

            window.location = window.location.href = "/ClientAccounts/";
        }        
    }
    

})();