/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.quote')
        .controller('quoteCreateController', ['$scope', '$uibModal', 'quoteService', 'customerService', 'componentService', 'Upload', 'constants', quoteCreateController]);

    function quoteCreateController($scope, $uibModal, quoteService, customerService, componentService, Upload, constants) {

        $scope.mode = 'edit'; // edit or new

        $scope.quote = {
            id: 0,
            qthdr_name: '',
            qthdr_acct_id: '',
            qthdr_rev: '0',
            qthdr_tray_no: '',
            tbl_qtdtl: []
        };
        $scope.isTrayExist = false;
        $scope.selectedLine = {};
        $scope.complevels = ['Pack', 'Case', 'Each']

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

        getDropDownListData();

        function getDropDownListData() {
            getCustomerAccounts();
            //getComponentSources();
            getQuoteStatuses();
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

                        if ($scope.mode === 'edit') {
                            $scope.selectedAccountChanged();
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

        $scope.orginalQuotes = [];
        $scope.quoteRevs = [];

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
            if ($scope.mode !== 'new') {
                return;
            }

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
        
        $scope.createPackBtnClicked = function () {
            
            $scope.quote.qthdr_acct_id = $scope.selectedAccount.id;
            
            if ($scope.packOption !== 'new'
                && $scope.selectedCopyQuoteRev !== null) {
                //console.log($scope.selectedCopyQuoteRev.id);
                quoteService.createQuoteFromExistingDetails($scope.selectedCopyQuoteRev.id, $scope.quote)
                    .then(function (response) {
                        if (response.id > 0) {
                            quoteService.getOriginalQuotesByAccountId($scope.selectedAccount.id)
                                .then(function (res) {
                                    $scope.originalQuotes = res;
                                    //console.log(res);
                                    for (var i = 0; i < res.length; i++) {
                                        if (response.id === res[i].id) {
                                            $scope.selectedQuote = res[i];
                                            //$scope.selectedQuoteChanged();
                                            $scope.quoteRevs = [];
                                            $scope.quoteRevs.push(res[i]);
                                            $scope.selectedRev = res[i];
                                            $scope.mode = 'edit';
                                            $scope.selectedRevChanged();
                                            break;
                                        }
                                    }
                                });
                        }
                    });
            } else if ($scope.packOption === 'new') {
                quoteService.createQuote($scope.quote)
                    .then(function (response) {
                        //console.log(response);
                        if (response.id > 0) {
                            quoteService.getOriginalQuotesByAccountId($scope.selectedAccount.id)
                                .then(function (res) {
                                    $scope.originalQuotes = res;
                                    //console.log(res);
                                    for (var i = 0; i < res.length; i++) {
                                        if (response.id === res[i].id) {
                                            $scope.selectedQuote = res[i];
                                            $scope.selectedQuoteChanged();
                                            $scope.quoteRevs = [];
                                            $scope.quoteRevs.push(res[i]);
                                            $scope.selectedRev = res[i];
                                            $scope.mode = 'edit';
                                            $scope.selectedRevChanged();
                                            break;
                                        }
                                    }
                                });
                        }
                    });
            } else if ($scope.packOption === 'upload') {
                quoteService.createQuote($scope.quote)
                    .then(function (response) {
                        //console.log(response);
                        if (response.id > 0) {
                            //console.log($scope.file);
                            $scope.upload($scope.file, response.id);                            
                        }
                    });

                
            }
        }

        $scope.cancelBtnClicked = function () {
            $scope.mode = 'edit';
            reset();
        }

        $scope.createNewPackBtnClicked = function () {            
            $scope.mode = 'new';
            reset();
        }

        $scope.deleteQuoteBtnClicked = function (item) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: item }
                }
            });

            modalInstance.result.then(function (item) {                
                quoteService.deleteQuote(item.val.id)
                    .then(function (res) {
                        if (res === true) {
                            reset();
                        }
                    });
            }, function () {

            });
        }

        $scope.addLineBtnClicked = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/component/views/componentAdvanceSearchModal.html',
                controller: 'componentAdvanceSearchModalController',
                size: 'lg',
                resolve: {

                }
            });

            modalInstance.result.then(function (selectedComponents) {                

                var newLines = [];

                for (var i = 0; i < selectedComponents.length; i++) {
                    var newLine = {
                        qtdtl_qthdr_qn: $scope.quote.id,
                        qtdtl_comp_id: selectedComponents[i].id,
                        qtdtl_comp_qty: 1,
                        qtdtl_comp_case: 'Pack',
                        qtdtl_sub: true,
                        tbl_comp: selectedComponents[i],
                    };

                    newLines.push(newLine);   
                }  

                quoteService.addLines(newLines)
                    .then(function (res) {
                        if (res !== null && res.length > 0) {
                            for (var i = 0; i < res.length; i++) {
                                $scope.quote.tbl_qtdtl.push(res[i]);
                            }                            
                        }
                    });                    

            }, function () {

            });
        }

        $scope.lineDeleteBtnClicked = function (item) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/core/views/confirmationModal.html',
                controller: 'confirmationModalController',
                size: 'sm',
                resolve: {
                    item: { msg: null, val: item }
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
                        }
                    });
            }, function () {

            });            
        }        

        $scope.selectedAccountChanged = function () {
            $scope.orginalQuotes = [];
            $scope.selectedQuote = null;
            $scope.quoteRevs = [];
            $scope.selectedRev = null;
            
            quoteService.getOriginalQuotesByAccountId($scope.selectedAccount.id)
                .then(function (response) {
                    $scope.originalQuotes = response;
                    if (response.length > 0) {
                        $scope.selectedQuote = response[0];         
                        $scope.selectedQuoteChanged();
                    }
                });
        }

        $scope.selectedQuoteChanged = function () {            
            $scope.quoteRevs = [];
            $scope.selectedRev = null;

            if ($scope.mode === 'new') {
                return;
            }

            quoteService.getRevQuotesByParentId($scope.selectedQuote.id)
                .then(function (response) {
                    $scope.quoteRevs = response;
                    if (response.length > 0) {
                        $scope.selectedRev = response[0];
                        $scope.selectedRevChanged();
                    }
                });
        }

        $scope.selectedRevChanged = function () {
            //$scope.quote = $scope.selectedRev;

            quoteService.getQuoteEdit($scope.selectedRev.id)
                .then(function (response) {
                    $scope.quote = response;
                    getQuoteStatuses()
                });
        }    

        $scope.lineEditBtnEditClicked = function (item) {            
            $scope.selectedLine = JSON.parse(JSON.stringify(item)); // make a copy
        }

        $scope.lineEditBtnOkClicked = function (item) {            
            if (item.qtdtl_comp_id === $scope.selectedLine.qtdtl_comp_id) {                
                quoteService.updateLine($scope.selectedLine)
                    .then(function (res) {
                        if (res === true) {
                            item.qtdtl_comp_qty = $scope.selectedLine.qtdtl_comp_qty;
                            item.qtdtl_comp_case = $scope.selectedLine.qtdtl_comp_case;
                            $scope.selectedLine = {};
                        }
                    });
            }            
        }

        $scope.lineEditBtnCancelClicked = function (item) {            
            $scope.selectedLine = {};            
        }

        $scope.lineSwitchItemBtnClicked = function (item) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/component/views/componentRefModal.html',
                controller: 'componentRefModalController',
                size: 'lg',
                resolve: {
                    item: item
                }
            });
            
            modalInstance.result.then(function (selectedItem) {                
                quoteService.switchComponent(item, selectedItem.tbl_comp_equiv)
                    .then(function (res) {
                        if (res === true) {
                            item.qtdtl_comp_id = selectedItem.tbl_comp_equiv.id;
                            item.tbl_comp = selectedItem.tbl_comp_equiv;
                        }
                    });                
            }, function () {

            });
        }

        $scope.upload = function (file, qn) {
            Upload.upload({
                url: constants.baseUri + 'QuoteMaster/UploadFile',
                data: { file: file, qn: qn}
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
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };

        $scope.addAssemblyBtnClicked = function () {
            
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/quote/views/quoteAddAssemblyModal.html',
                controller: 'quoteAddAssemblyModalController',
                size: 'lg',
                resolve: {
                    item: $scope.quote
                }
            });

            modalInstance.result.then(function (assembly) {
                
                var newAssembly = {
                    qtdtl_qthdr_qn: $scope.quote.id,
                    qtdtl_comp_id: assembly.name.id,
                    qtdtl_comp_qty: 1,
                    qtdtl_comp_case: 'Each',
                    qtdtl_sub: true,
                    qtdtl_assembly_type: assembly.type,
                    qtdtl_assembly_build: assembly.build,
                    tbl_comp: assembly.name
                };
                
                // add assembly
                quoteService.addAssemblyLine(newAssembly, assembly.components)
                    .then(function (res) {
                        if (res !== null && res.Key !== null) {

                            res.Key.components = res.Value;
                            $scope.quote.tbl_qtdtl.push(res.Key); // assembly                            

                            for (var i = 0; i < res.Value.length; i++) {
                                for (var j = 0; j < $scope.quote.tbl_qtdtl.length; j++) {
                                    if (res.Value[i].id === $scope.quote.tbl_qtdtl[j].id) {                                        
                                        $scope.quote.tbl_qtdtl.splice(j, 1); // remove component from ui
                                        break;
                                    }
                                }
                            }

                            
                        }
                    });                

            }, function () {
                // cancel
            });
        }

        $scope.showAssemblyBtnClicked = function (item) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/quote/views/quoteAssemblyModal.html',
                controller: 'quoteAssemblyModalController',
                size: 'lg',
                resolve: {
                    item: item
                }
            });

            modalInstance.result.then(function (assembly) {
                // do nothing
            }, function () {
                // cancel
            });
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
    }
})();