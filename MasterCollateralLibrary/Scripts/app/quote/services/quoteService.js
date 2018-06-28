/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.quote')
        .factory('quoteService', ['$http', '$q', 'constants', quoteService]);

    function quoteService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {    
            getFind: getFind,
            getFindQcApprovals: getFindQcApprovals,
            getLanguages: getLanguages,
            getMfgPlants: getMfgPlants,
            getHsCodes: getHsCodes,
            getSalesReps: getSalesReps,
            getSalesRep: getSalesRep,
            getSterilizationMethods: getSterilizationMethods,
            getFormulas: getFormulas,
            getFormulasByPlantId: getFormulasByPlantId,
            getBrands: getBrands,
            getSellCurrency: getSellCurrency,
            getBoxes: getBoxes,            
            getQuoteStatuses: getQuoteStatuses,
            getQuoteDetails: getQuoteDetails,
            getQuotes: getQuotes,
            getOriginalQuotesByAccountId: getOriginalQuotesByAccountId,
            getRevQuotesByParentId: getRevQuotesByParentId,
            getTempQuotesByAccountId: getTempQuotesByAccountId,
            getNonTempRevQuotesByParentId: getNonTempRevQuotesByParentId,
            getQuoteEdit: getQuoteEdit,
            createQuote: createQuote,
            createQuoteFromExistingDetails: createQuoteFromExistingDetails,
            deleteQuote: deleteQuote,
            addLine: addLine,
            addLines: addLines,
            updateLine: updateLine,
            deleteLine: deleteLine,
            switchComponent: switchComponent,
            isTrayExist: isTrayExist,
            getAssemblyTypes: getAssemblyTypes,
            getAssemblyBuilds: getAssemblyBuilds,
            getAssemblyComponents: getAssemblyComponents,
            getTopLevelItems: getTopLevelItems,
            addAssemblyLine: addAssemblyLine,
            updateAssemblyLine: updateAssemblyLine,
            update: update,
            remove: remove,
            getPackQuoteReport: getPackQuoteReport,
            createNewRevFromId: createNewRevFromId,
            createNewAwardFromId: createNewAwardFromId,
            createTemplateFromId: createTemplateFromId,
            isFinishedGoodExist: isFinishedGoodExist,
            validateFinishedGood: validateFinishedGood,
            disassembleFinishedGood: disassembleFinishedGood,
            findQuoteStatusList: findQuoteStatusList,
            createstatus: createstatus,
            updatestatus: updatestatus,
            deletestatus: deletestatus,
            getQuoteHistory: getQuoteHistory,
            findTopLevelItems: findTopLevelItems
        };

        return service;

        //function getCustomerAccounts() {
        //    var deferred = $q.defer();
        //    $http.get(baseUri + 'QuoteMaster/CustomerAccounts')
        //        .then(function (response) {
        //            deferred.resolve(response.data);
        //        },
        //        function (err) {
        //            deferred.reject(err);
        //        });
        //    return deferred.promise;
        //};

        function getFind(param) {

            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/Find', param)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getFindQcApprovals(param) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/FindApprovalQuotes', param)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getLanguages() {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/Languages')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getMfgPlants() {
            var deferred = $q.defer();

            $http.get(baseUri + 'QuoteMaster/MfgPlants')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getHsCodes() {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/HsCodes')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getSalesReps() {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/SalesReps')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getSalesRep(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/GetSalesRep?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getSterilizationMethods() {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/SterilizationMethods')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getFormulas() {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/Formulas')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getFormulasByPlantId(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/FormulasByPlantId?id='+id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getBrands() {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/Brands')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getSellCurrency() {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/SellCurrency')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getBoxes() {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/Boxes')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };        

        function getQuoteStatuses() {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/QuoteStatuses')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getQuoteDetails(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/GetQuoteDetails?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };
        
        function getQuotes(pageSize, pageNumber, sortBy, sortDir) {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/Quotes?pageSize=' + pageSize +
                '&pageNumber=' + pageNumber + '&sortBy=' + sortBy + '&sortDir=' + sortDir)
                .then(function (response) {
                    //console.log(response.data);
                    if (response.data.Data !== null) {
                        for (var i = 0; i < response.data.Data.length; i++) {
                            if (response.data.Data[i].qthdr_date !== null) {
                                response.data.Data[i].qthdr_date = new Date(parseInt(response.data.Data[i].qthdr_date.substr(6)));
                            }
                            if (response.data.Data[i].qthdr_date_update !== null) {
                                response.data.Data[i].qthdr_date_update = new Date(parseInt(response.data.Data[i].qthdr_date_update.substr(6)));
                            }
                            if (response.data.Data[i].qthdr_status_date !== null) {
                                response.data.Data[i].qthdr_status_date = new Date(parseInt(response.data.Data[i].qthdr_status_date.substr(6)));
                            }
                        }
                    }

                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };       

        function getOriginalQuotesByAccountId(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/GetOriginalQuotesByAccountId?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getRevQuotesByParentId(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/GetRevQuotesByParentId?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getTempQuotesByAccountId(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/GetTempQuotesByAccountId?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getNonTempRevQuotesByParentId(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/GetNonTempRevQuotesByParentId?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getQuoteEdit(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/GetQuoteEdit?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function createQuote(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/CreateQuote', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function createQuoteFromExistingDetails(id, model) {
            //console.log(id);
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/CreateQuoteFromExistingDetails', { id: id, dto: model })
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function deleteQuote(id) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'QuoteMaster/DeleteQuote?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function addLine(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/AddLine', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function addLines(models) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/AddLines', models)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function updateLine(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'QuoteMaster/UpdateLine', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function deleteLine(model) {
            var deferred = $q.defer();            
            $http.delete(baseUri + 'QuoteMaster/DeleteLine?id=' + model.id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function switchComponent(model, component) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/SwitchComponent', { dto: model, component: component })
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function isTrayExist(acctId, trayNo) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/IsTrayExist', { acctId, trayNo })
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getAssemblyTypes() {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/AssemblyTypes')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getAssemblyBuilds() {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/AssemblyBuilds')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getAssemblyComponents(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/AssemblyComponents?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getTopLevelItems(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/TopLevelItems?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function addAssemblyLine(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/AddAssemblyLine', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function updateAssemblyLine(assembly, components) {
            var deferred = $q.defer();
            $http.put(baseUri + 'QuoteMaster/UpdateAssemblyLine', { assembly, components })
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function update(id, model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'QuoteMaster/Update?id='+id, model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function remove(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'QuoteMaster/Delete?id=' + model.id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getPackQuoteReport(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/GetPackQuoteReport?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function createNewRevFromId(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'QuoteMaster/CreateNewRevFromId?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function createNewAwardFromId(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/CreateNewAwardFromId', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function createTemplateFromId(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/CreateTemplateFromId', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function isFinishedGoodExist(finishedGood) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/IsFinishedGoodExists', { finishedGood })
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function validateFinishedGood(finishedGood, quoteId, accountId) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/ValidateFinishedGood', { finishedGood, quoteId, accountId })
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function disassembleFinishedGood(finishedGood) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/DisassembleFinishedGood', { finishedGood })
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }
        function findQuoteStatusList(param) {

            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteStatus/Find', param)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function deletestatus(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'QuoteStatus/Delete?id=' + model.id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function createstatus(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteStatus/SaveNew', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function updatestatus(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'QuoteStatus/Update', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getQuoteHistory(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/GetQuoteHistory', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function findTopLevelItems(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/FindTopLevelItems', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };
    }

})();