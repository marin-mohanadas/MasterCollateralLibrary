

(function () {
    'use strict';

    angular
        .module('app.salesReps')
        .controller('salesRepsController', ['$scope', '$location', 'salesRepsService', 'quoteService' , salesRepsController]);

    function salesRepsController($scope, $location, salesRepsService, quoteService) {

        $scope.rep = null;

        var temp = window.location.pathname.split('/');
        var id = 0;
        if (temp.length === 4) {
            id = temp[3];
        }

        if (id > 0) {

            salesRepsService.getRepEdit(id)
                .then(function(response) {

                    if (response !== "" && response !== undefined) {
                        $scope.rep = response;
                        getDropDownListData();
                    }
                });
        } else {
            getDropDownListData();
        }

        
        function getDropDownListData() {
            $scope.selectedCompany = null;

            getBrands();

        }

        $scope.selectedCompany = null;

        function getBrands() {
            quoteService.getBrands()
                .then(function (res) {
                    $scope.brands = res;
                    //console.log(res);
                    if ($scope.rep === undefined) return;
                    var brandFound = false;

                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.rep.rep_company) {
                            $scope.selectedCompany = res[i];
                            brandFound = true;
                        }
                        if (brandFound === true) break;
                    }
                });
        }

        $scope.save = function () {

            if ($scope.selectedCompany !== null) {
                $scope.rep.rep_company = $scope.selectedCompany.id;
            }

            if ($scope.rep.id > 0) {
                //Edit
                salesRepsService.updateRep($scope.rep)
                    .then(function (res) {
                        if (res === true) {
                            //Show result notification
                            window.location.href = "/SalesReps/";
                        }
                    });
            } else {
                // New
                salesRepsService.createRep($scope.rep)
                    .then(function (res) {
                        if (res.id > 0) {
                            window.location.href = "/SalesReps/Edit/" + res.id;
                        }
                    });

            }


        }

        $scope.cancel = function () {

            window.location = window.location.href = "/SalesReps/";
        }
    }
    

})();