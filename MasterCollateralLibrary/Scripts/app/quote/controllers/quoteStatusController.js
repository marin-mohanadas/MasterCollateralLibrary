
(function () {
    'use strict';

    angular
        .module('app.quote')
        .controller('quoteStatusController', ['$scope', '$uibModal', '$location', 'quoteService', quoteStatusController]);

    function quoteStatusController($scope, $uibModal, $location, quoteService) {

        $scope.busy = true;
        $scope.items = [];                
        $scope.total = 0;
        $scope.numberPages = 0;
        $scope.maxSize = 15;

        $scope.param = {
            PageSize: 20,
            PageNumber: 1,
            SortBy: 'desc',
            SortDir: 'asc',
            id: '',
            qtstatus_desc: ''
        };

        $scope.selectedLine = {};

        getItems();

        $scope.pageChanged = function () {
            getItems();
        }

        $scope.filterChanged = function () {
            $scope.param.PageNumber = 1;
            getItems();
        }

        $scope.doSortBy = function (val) {
            if ($scope.param.SortBy === val) {
                $scope.param.SortDir = $scope.param.SortDir === "asc" ? "desc" : "asc";
            } else {
                $scope.param.SortBy = val;
                $scope.param.SortDir = "asc";
            }
            $scope.param.PageNumber = 1;
            getItems();
        }

        $scope.sortIcon = function (val) {
            if ($scope.param.SortBy === val) {
                if ($scope.param.SortDir === 'asc')
                    return 'glyphicon glyphicon-arrow-up';
                else if ($scope.param.SortDir === 'desc')
                    return 'glyphicon glyphicon-arrow-down';
                return '';
            }
        }

        function getItems() {          
            quoteService.findQuoteStatusList($scope.param)
                .then(function (response) {
                    //console.log(response);
                    $scope.items = response.Data;
                    $scope.total = response.Total;
                    $scope.busy = false;
                    $scope.numberPages = Math.ceil(response.Total / $scope.param.PageSize);
                });
        }

        
        $scope.editBtnClicked = function (item) {
            $scope.selectedLine = JSON.parse(JSON.stringify(item)); // make a copy
        }

        $scope.editBtnOkClicked = function (item) {
            if (item.id === $scope.selectedLine.id) {
                quoteService.updatestatus($scope.selectedLine)
                    .then(function (res) {
                        if (res === true) {
                            item.id = $scope.selectedLine.id;
                            item.qtstatus_desc = $scope.selectedLine.qtstatus_desc;
                            item.qtstatus_defn = $scope.selectedLine.qtstatus_defn;
                            item.qtstatus_qc_sbmt = $scope.selectedLine.qtstatus_qc_sbmt;
                            item.qtstatus_sls_sbmt = $scope.selectedLine.qtstatus_sls_sbmt;
                            item.qtstatus_lock = $scope.selectedLine.qtstatus_lock;
                            item.qtstatus_output = $scope.selectedLine.qtstatus_output;
                            $scope.selectedLine = {};


                        }
                    });
            }
        }

        $scope.editBtnCancelClicked = function (item) {
            $scope.selectedLine = {};
        }

        $scope.deleteBtnClicked = function (item) {
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
                quoteService.deletestatus(item.val)
                    .then(function (res) {
                        if (res === true) {
                            var index = $scope.items.indexOf(item.val);
                            $scope.items.splice(index, 1);
                        }
                    });
            }, function () {

            });
        }

        $scope.newBtnClicked = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '../scripts/app/quote/views/newstatusModal.html',
                controller: 'newstausModalController',
                size: 'sm'
            });
            modalInstance.result.then(function (item) {
                quoteService.createstatus(item)
                    .then(function (res) {
                        if (res.id > 0) {
                            getItems();
                        }
                    });
            }, function () {

            });
        }
    }

})();