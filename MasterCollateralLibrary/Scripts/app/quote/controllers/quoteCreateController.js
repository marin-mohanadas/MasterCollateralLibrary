/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.quote')
        .controller('quoteCreateController', ['$scope', '$uibModal', '$window', 'profileService', 'quoteService', 'customerService', 'Upload', 'constants', quoteCreateController]);

    function quoteCreateController($scope, $uibModal, $window, profileService, quoteService, customerService, Upload, constants ) {
        
        $scope.quote = {
            id: 0,
            qthdr_name: '',
            qthdr_acct_id: -1,
            qthdr_rev: 'A',
            qthdr_tray_no: '',
            tbl_qtdtl: []
        };

        getDropDownListData();

        $scope.orginalQuotes = [];
        $scope.quoteRevs = [];

        $scope.isTrayExist = false;

        function getDropDownListData() {
            getCustomerAccounts();         
            getReps();            
        }

        $scope.selectedAccount = {};
        $scope.accounts = [];
        function getCustomerAccounts() {
            customerService.getCustomers()
                .then(function (response) {
                    $scope.accounts = response;
                    if (response.length > 0) {
                        if ($scope.quote.qthdr_acct_id < 1) {
                            $scope.quote.qthdr_acct_id = response[0].id;
                            $scope.selectedAccount = response[0];
                        } else {
                            for (var i = 0; i < $scope.accounts.length; i++) {
                                if ($scope.accounts[i].id == $scope.quote.qthdr_acct_id) {
                                    $scope.selectedAccount = $scope.accounts[i];
                                    break;
                                }
                            }
                        }                        
                    }
                });
        }

        $scope.selectedAccountChanged = function () {            
            //console.log('account', $scope.selectedAccount);
            if (!$scope.selectedAccount || !$scope.selectedAccount.acct_rep_id) {
                return;
            }
            $scope.selectedRep = null;
            
            for (var i = 0; i < $scope.reps.length; i++) {
                if ($scope.reps[i].id === $scope.selectedAccount.acct_rep_id) {
                    $scope.selectedRep = $scope.reps[i];

                    // set company
                    $scope.quote.qthdr_brand_id = $scope.reps[i].rep_company;

                    if ($scope.quote.qthdr_brand_id == 1) { // IPS
                        $scope.quote.qthdr_sell_crncy = 3; // US
                        $scope.quote.qthdr_sterility = true;
                        $scope.quote.qthdr_sterility_mthd = 'ETO';
                    } else {
                        $scope.quote.qthdr_sell_crncy = null;
                        $scope.quote.qthdr_sterility = null;
                        $scope.quote.qthdr_sterility_mthd = null;
                    }
                    break;
                }
            }

            console.log($scope.quote);
        }

        $scope.btnAddAccountClicked = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../../scripts/app/clientAccounts/views/clientAccountCreateModal.html',
                controller: 'clientAccountCreateModalController',
                size: 'sm',
                resolve: {

                }
            });

            modalInstance.result.then(function (item) {
                //console.log('created account', item);
                $scope.quote.qthdr_acct_id = item.id;
                getCustomerAccounts();
            }, function () {

            });
        }        

        $scope.selectedRep = null;
        $scope.reps = [];
        function getReps() {
            quoteService.getSalesReps()
                .then(function (response) {
                    $scope.reps = response;

                    // get current salesrep                    
                    profileService.getSalesRepId()
                        .then(function (salesrepId) {
                            if (salesrepId > 0) {
                                $scope.quote.qthdr_rep_id = salesrepId;
                                for (var i = 0; i < $scope.reps.length; i++) {
                                    if ($scope.reps[i].id == salesrepId) {                                        
                                        $scope.selectedRep = $scope.reps[i];
                                        break;
                                    }
                                }
                            }
                        });                                        
                });
        }

        $scope.packOption = 'new';
        $scope.packOptionChanged = function () {

            if ($scope.accounts.length > 0) {
                $scope.selectedCopyAccount = $scope.accounts[0];
            }

            $scope.originalQuotes = [];
            $scope.selectedCopyQuote = null;
            $scope.quoteRevs = [];
            $scope.selectedCopyQuoteRev = null;

            $scope.copyAccountChanged();
        }

        $scope.copyAccountChanged = function () {
            $scope.originalQuotes = [];
            $scope.selectedCopyQuote = null;
            $scope.quoteRevs = [];
            $scope.selectedCopyQuoteRev = null;

            if ($scope.packOption === 'copy') {
                quoteService.getOriginalQuotesByAccountId($scope.selectedCopyAccount.id)
                    .then(function (response) {
                        $scope.originalQuotes = response;
                        if (response.length > 0) {
                            $scope.selectedCopyQuote = response[0];
                            $scope.copyQuoteChanged();
                        }
                    });
            } else if ($scope.packOption === 'temp') {
                quoteService.getTempQuotesByAccountId($scope.selectedCopyAccount.id)
                    .then(function (response) {
                        $scope.originalQuotes = response;
                        if (response.length > 0) {
                            $scope.selectedCopyQuote = response[0];
                            $scope.quoteRevs = [];
                            $scope.quoteRevs.push(response[0]);
                            $scope.selectedCopyQuoteRev = response[0];
                        }
                    });
            }
        }

        $scope.copyQuoteChanged = function () {            
            if ($scope.packOption === 'copy') {
                quoteService.getNonTempRevQuotesByParentId($scope.selectedCopyQuote.id)
                    .then(function (response) {
                        $scope.quoteRevs = response;
                        if ($scope.quoteRevs.length > 0) {
                            $scope.selectedCopyQuoteRev = $scope.quoteRevs[0];
                        }
                    });
            } else if ($scope.packOption === 'temp') {
                $scope.quoteRevs = [];
                $scope.quoteRevs.push($scope.selectedCopyQuote);
                $scope.selectedCopyQuoteRev = $scope.selectedCopyQuote;
            }
        }

        $scope.validateTrayNo = function () {
            if ($scope.selectedAccount === null || $scope.quote.qthdr_tray_no.length < 1) {
                return;
            }
            quoteService.isTrayExist($scope.selectedAccount.id, $scope.quote.qthdr_tray_no)
                .then(function (res) {
                    $scope.isTrayExist = res;
                });
        }

        $scope.upload = function (file, qn) {
            Upload.upload({
                url: constants.baseUri + 'QuoteMaster/UploadFile',
                data: { file: file, qn: qn }
            }).then(function (resp) {
                //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                //console.log(resp.data);                
                quoteService.getOriginalQuotesByAccountId($scope.selectedAccount.id)
                    .then(function (res) {
                        $scope.originalQuotes = res;
                        //console.log(res);

                        var last = res[res.length - 1];
                        $scope.selectedQuote = last;
                        $scope.selectedQuoteChanged();
                        $scope.quoteRevs = [];
                        $scope.quoteRevs.push(last);
                        $scope.selectedRev = $scope.quoteRevs[0];
                        $scope.mode = 'edit';
                        $scope.selectedRevChanged();
                    });

            }, function (resp) {
                //console.log('Error status: ' + resp.status);
            }, function (evt) {
                //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };

        $scope.createPackBtnClicked = function () {

            if ($scope.selectedAccount !== null) {
                $scope.quote.qthdr_acct_id = $scope.selectedAccount.id;
            }            
            if ($scope.selectedRep !== null) {
                $scope.quote.qthdr_rep_id = $scope.selectedRep.id;
            }

            if ($scope.packOption !== 'new'
                && $scope.selectedCopyQuoteRev !== null) {                
                quoteService.createQuoteFromExistingDetails($scope.selectedCopyQuoteRev.id, $scope.quote)
                    .then(function (response) {
                        if (response.id > 0) {
                            window.location.href = '/QuoteMaster/Edit/' + response.id;                            
                        }
                    });
            } else if ($scope.packOption === 'new') {
                quoteService.createQuote($scope.quote)
                    .then(function (response) {                        
                        if (response.id > 0) {
                            window.location.href = '/QuoteMaster/Edit/' + response.id;                            
                        }
                    });
            } else if ($scope.packOption === 'upload') {
                quoteService.createQuote($scope.quote)
                    .then(function (response) {                        
                        if (response.id > 0) {                            
                            $scope.upload($scope.file, response.id);
                            window.location.href = '/QuoteMaster/Edit/' + response.id;
                        }
                    });                
            }
        }

        $scope.cancelBtnClicked = function () {
            window.location.href = "/QuoteMaster";
        }        
    }
})();