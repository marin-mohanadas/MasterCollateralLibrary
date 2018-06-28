/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.component')
        .factory('componentService', ['$http', '$q', 'constants', componentService]);

    function componentService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {           
            getFind: getFind,
            getComponents: getComponents,
            getCountries: getCountries,
            getSterilities: getSterilities,
            getStats: getStats,
            getProdMgrs: getProdMgrs,
            getCostTypes: getCostTypes,
            getUoms: getUoms,
            getLifeCycles: getLifeCycles,
            getTraits: getTraits,
            getMaterials: getMaterials,
            getSpecialties: getSpecialties,
            getComponentEdit: getComponentEdit,
            getComponentSources: getComponentSources,
            getAssemblies: getAssemblies,
            duplicatePurchase: duplicatePurchase,
            addCrossRef: addCrossRef,
            updateCrossRef: updateCrossRef,
            removeCrossRef: removeCrossRef,
            addCategory: addCategory,
            updateCategory: updateCategory,
            removeCategory: removeCategory,
            addTrait: addTrait,
            updateTrait: updateTrait,
            removeTrait: removeTrait,
            addMaterial: addMaterial,
            updateMaterial: updateMaterial,
            removeMaterial: removeMaterial,
            addSpecialty: addSpecialty,
            updateSpecialty: updateSpecialty,
            removeSpecialty: removeSpecialty,
            addLabel: addLabel,
            updateLabel: updateLabel,
            removeLabel: removeLabel,
            removePix: removePix,
            updatePurchase: updatePurchase,
            removePurchase: removePurchase,
            addPurchase: addPurchase,
            update: update,
            create: create,
            remove: remove,
            getByCategoryId: getByCategoryId,
            setCategoryId: setCategoryId,
            setCrossRef: setCrossRef,
            isExist: isExist,
            getExchangeRate: getExchangeRate,
            requestNewItem: requestNewItem,
            //getCompTrays: getCompTrays
            getCompByQuote: getCompByQuote,
            sendACLApprovalRequest: sendACLApprovalRequest,
            sendACLApprovalNotification: sendACLApprovalNotification,
            sendACLRejectionNotification: sendACLRejectionNotification,
            getACLAccountExeptions: getACLAccountExeptions,
            addACLAccountExeptions: addACLAccountExeptions,
            removeACLAccountExeptions: removeACLAccountExeptions,
            updateACLAccountExeptions: updateACLAccountExeptions
        };

        return service;

        function getFind(param) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/Find', param)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getComponents(pageSize, pageNumber, sortBy, sortDir) {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/Components?pageSize=' + pageSize +
                '&pageNumber=' + pageNumber + '&sortBy=' + sortBy + '&sortDir=' + sortDir)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };        

        function getCountries() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/Countries')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };        

        function getSterilities() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/Sterilities')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };        

        function getStats() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/Stats')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };  

        function getProdMgrs() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/ProdMgrs')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };  

        function getCostTypes() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/CostTypes')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };  

        function getUoms() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/Uoms')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };  

        function getLifeCycles() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/LifeCycles')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };  

        function getTraits() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/Traits')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };  

        function getMaterials() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/Materials')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };  

        function getSpecialties() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/Specialties')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };  

        function getComponentEdit(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/GetComponentEdit?id=' + id)
                .then(function (response) {                    

                    if (response.data !== null
                        && response.data != ""
                        && response.data.tbl_purch !== null) {

                        for (var i = 0; i < response.data.tbl_purch.length; i++) {
                            if (response.data.tbl_purch[i].purch_date_create !== null) {                                          
                                response.data.tbl_purch[i].purch_date_create = new Date(parseInt(response.data.tbl_purch[i].purch_date_create.substr(6)));                                                                
                            }
                            if (response.data.tbl_purch[i].purch_date_expry !== null) {
                                response.data.tbl_purch[i].purch_date_expry = new Date(parseInt(response.data.tbl_purch[i].purch_date_expry.substr(6)));
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

        function getComponentSources() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/ComponentSources')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };  

        function getAssemblies() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/Assemblies')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };  

        function duplicatePurchase(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/DuplicatePurchase', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function addCrossRef(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/AddCrossRef', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function updateCrossRef(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'ComponentList/UpdateCrossRef', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function removeCrossRef(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'ComponentList/RemoveCrossRef?id=' + model.ID)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function addCategory(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/AddCategory', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function updateCategory(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'ComponentList/UpdateCategory', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function removeCategory(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'ComponentList/RemoveCategory?id=' + model.ID)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function addTrait(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/AddTrait', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function updateTrait(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'ComponentList/UpdateTrait', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function removeTrait(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'ComponentList/RemoveTrait?id=' + model.ID)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function addMaterial(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/AddMaterial', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function updateMaterial(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'ComponentList/UpdateMaterial', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function removeMaterial(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'ComponentList/RemoveMaterial?id=' + model.ID)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function addSpecialty(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/AddSpecialty', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function updateSpecialty(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'ComponentList/UpdateSpecialty', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function removeSpecialty(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'ComponentList/RemoveSpecialty?id=' + model.ID)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function addLabel(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/AddLabel', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function updateLabel(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'ComponentList/UpdateLabel', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function removeLabel(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'ComponentList/RemoveLabel?id=' + model.id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function removePix(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'ComponentList/RemovePix?id=' + model.id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function addPurchase(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/AddPurchase', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function updatePurchase(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'ComponentList/UpdatePurchase', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function removePurchase(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'ComponentList/RemovePurchase?id=' + model.id)
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
            $http.put(baseUri + 'ComponentList/Update?id='+id, model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function create(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/Create', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function remove(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'ComponentList/Delete?id=' + model.id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function getByCategoryId(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/GetByCatgoryId?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function setCategoryId(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/SetCategoryId', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function setCrossRef(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/SetCrossRef', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function isExist(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/IsExist', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };     

        function getExchangeRate() {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/GetExchRate')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function requestNewItem(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/RequestNewItem', model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        //function getCompTrays(param) {

        //    var deferred = $q.defer();
        //    $http.post(baseUri + 'QuoteMaster/FindTrays', param)
        //        .then(function (response) {
        //            deferred.resolve(response.data);
        //        },
        //        function (err) {
        //            deferred.reject(err);
        //        });
        //    return deferred.promise;
        //};

        function getCompByQuote(params) {  //called from componentEditController getTrays() & getCompQuotes() functions; only breaks from getCompQuotes (getTrays uses hardcoded value for status_id)
           // console.log(params); 
            var deferred = $q.defer();
            $http.post(baseUri + 'QuoteMaster/FindTrays', params)
                .then(function (response) {
                    deferred.resolve(response.data); 
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function sendACLApprovalRequest(modal, quoteID, quoteQN, requestReason) {
            var deferred = $q.defer();
            console.log(requestReason);
            $http.post(baseUri + 'ComponentList/RequestACLApproval?quoteID=' + quoteID + '&quoteQN=' + quoteQN + '&requestReason=' + requestReason, modal)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function sendACLApprovalNotification(compID, requesterEmail, quoteID, quoteQN) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/SendACLApprovalNotification?compID=' + compID + '&requester='+ requesterEmail + '&quoteID=' + quoteID + '&quoteQN=' + quoteQN + '')
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function sendACLRejectionNotification(compID, requesterEmail, quoteID, quoteQN, rejectReason) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/SendACLRejectionNotification?compID=' + compID + '&requester=' + requesterEmail + '&quoteID=' + quoteID + '&quoteQN=' + quoteQN + '&rejectReason=' + rejectReason)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function getACLAccountExeptions(id) {
            var deferred = $q.defer();
            $http.get(baseUri + 'ComponentList/GetACLExceptions?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        //function addACLAccountExeptions(compID, account_id, expiration_date) {
        function addACLAccountExeptions(model) {
            var deferred = $q.defer();
            //$http.post(baseUri + 'ComponentList/AddACLExceptions?compID=' + compID + "&account_id=" + account_id + "&expiration_date=" + expiration_date)
            $http.post(baseUri + 'ComponentList/AddACLExceptions',model)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        function removeACLAccountExeptions(id) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/RemoveACLExceptions?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };
        function updateACLAccountExeptions(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ComponentList/UpdateACLExceptions',model)
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