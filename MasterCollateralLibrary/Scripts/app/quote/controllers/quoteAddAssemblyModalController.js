/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict'

    angular
        .module('app.quote')
        .controller('quoteAddAssemblyModalController', ['$scope', '$uibModalInstance', 'quoteService', 'componentService', 'item', quoteAddAssemblyModalController]);

    function quoteAddAssemblyModalController($scope, $uibModalInstance, quoteService, componentService, item) {

        //console.log(item);

        $scope.busy = true;
        $scope.items = []; 
        $scope.assemblies = [];
        $scope.selectedItems = [];
        $scope.item = {
            id: 0,
            name: '',
            type: 'First Fold',
            build: 'On the line',
            components: []
        };

        $scope.filterParam = {
            PageSize: 6,
            PageNumber: 1,
            SortBy: 'comp_desc',
            SortDir: 'asc',
            quoteHdrId: item.id,
            compId: null,
            compDescOrg: '',
            compVendor: '',
            compVendorPart: '',
            compAcl: null,
            compLatex: null,
            compSterility: ''
        };

        $scope.types = [];
        $scope.builds = [];

        componentService.getAssemblies()
            .then(function (response) {
                $scope.assemblies = response;
                //console.log(response);
                //console.log(item.tbl_qtdtl);

                if (response.length > 0) {

                    $scope.item.id = $scope.assemblies[0].id;

                    //for (var i = 0; i < response.length; i++) {
                    //    var found = false;
                    //    for (var j = 0; j < item.tbl_qtdtl.length; j++) {
                    //        if (response[i].id === item.tbl_qtdtl[j].tbl_comp.id) {
                    //            found = true;
                    //            break;
                    //        }
                    //    }

                    //    if (found === false) {
                    //        $scope.assemblies.push(response[i]);
                    //    }
                    //}

                    //if ($scope.assemblies.length > 0) {
                    //    $scope.item.name = $scope.assemblies[0];
                    //}
                }
            });

        quoteService.getAssemblyTypes()
            .then(function (response) {
                $scope.types = response;
            });

        quoteService.getAssemblyBuilds()
            .then(function (response) {
                $scope.builds = response;
            });        
        
        getItems();

        //$scope.setSelected = function (item) {            

        //    var foundIndex = -1;

        //    for (var i = 0; i < $scope.selectedItems.length; i++) {
        //        if ($scope.selectedItems[i].id === item.id) {
        //            foundIndex = i;
        //            break;
        //        }
        //    }
            
        //    if (foundIndex > -1 && item.selected === false) { // remove                
        //        $scope.selectedItems.splice(foundIndex, 1);
        //    }
        //    else if (foundIndex === -1 && item.selected === true) { // add
        //        $scope.selectedItems.push(item);
        //    }

        //    //console.log($scope.selectedItems);
        //}

        $scope.removeSelectedItem = function (item) {
            //$scope.items.push(angular.copy(item));
            item.isSelected = false;
            var index = $scope.selectedItems.indexOf(item);
            $scope.selectedItems.splice(index, 1);
        }

        $scope.setSelected = function (item) {            
            item.isSelected = true;
            item.new_qty = item.qtdtl_comp_qty;
            $scope.selectedItems.push(item);
            //var index = $scope.items.indexOf(item);
            //$scope.items.splice(index, 1);
            //getItems();
        }

        $scope.ok = function () {            

            $scope.item.components = $scope.selectedItems;
            //console.log($scope.item);

            $uibModalInstance.close($scope.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
       
        $scope.filterChanged = function () {
            if ($scope.filterParam.compId && $scope.filterParam.compId.length > 0) {
                $scope.filterParam.SortBy = 'compId';
            } else if ($scope.filterParam.compDescOrg && $scope.filterParam.compDescOrg.length > 0) {
                $scope.filterParam.SortBy = 'compDesc';
            } else if ($scope.filterParam.compVendor && $scope.filterParam.compVendor.length > 0) {
                $scope.filterParam.SortBy = 'compVendor';
            } else if ($scope.filterParam.compVendorPart && $scope.filterParam.compVendorPart.length > 0) {
                $scope.filterParam.SortBy = 'compVendorPart';
            } else if ($scope.filterParam.compSterility && $scope.filterParam.compSterility.length > 0) {
                $scope.filterParam.SortBy = 'compSterility';
            } else if ($scope.filterParam.compAcl && $scope.filterParam.compAcl.length > 0) {
                $scope.filterParam.SortBy = 'compAcl';
            } else if ($scope.filterParam.compLatex && $scope.filterParam.compLatex.length > 0) {
                $scope.filterParam.SortBy = 'compLatex';
            }
            $scope.filterParam.PageNumber = 1;
            getItems();
        }

        $scope.pageChanged = function () {
            getItems();
        }

        $scope.doSortBy = function (val) {
            if ($scope.filterParam.SortBy === val) {
                $scope.filterParam.SortDir = $scope.param.SortDir === "asc" ? "desc" : "asc";
            } else {
                $scope.filterParam.SortBy = val;
                $scope.filterParam.SortDir = "asc";
            }
            $scope.filterParam.PageNumber = 1;
            getItems();
        }

        $scope.sortIcon = function (val) {
            if ($scope.filterParam.SortBy === val) {
                if ($scope.filterParam.SortDir === 'asc')
                    return 'glyphicon glyphicon-arrow-up';
                else if ($scope.filterParam.SortDir === 'desc')
                    return 'glyphicon glyphicon-arrow-down';
                return '';
            }
        };

        function getItems() {              
            $scope.items = [];
            quoteService.findTopLevelItems($scope.filterParam)
                .then(function (res) {         
                    for (var i = 0; i < res.Data.length; i++) {
                        var found = false;
                        for (var j = 0; j < $scope.selectedItems.length; j++) {
                            if (res.Data[i].id == $scope.selectedItems[j].id) {
                                found = true;
                                break;
                            }
                        }
                        res.Data[i].isSelected = found;
                        $scope.items.push(res.Data[i]);                        
                    }

                    for (var i = 0; i < $scope.items.length; i++) {                        
                        $scope.items[i].MonthlyAMU = 0;                        
                        getTrays($scope.items[i].tbl_comp);                        
                    }
                    $scope.total = res.Total;
                    $scope.busy = false;
                });
        }

        function getTrays(item) {                        
            var param = { PageSize: 1, PageNumber: 1, id: item.id, qthdr_status_id: 6 };            
            componentService.getCompByQuote(param)
                .then(function (response) {
                    if (response != null || response != undefined) {            
                        item.MonthlyAMU = response.Total;
                    }            
                });            
        }
    }
})();