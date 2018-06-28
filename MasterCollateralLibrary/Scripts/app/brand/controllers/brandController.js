

(function () {
    'use strict';

    angular
        .module('app.brand')
        .controller('brandController', ['$scope', '$location', 'brandService', brandController]);

    function brandController($scope, $location, brandService) {

        $scope.brand = null;

        var temp = window.location.pathname.split('/');
        var id = 0;
        if (temp.length === 4) {
            id = temp[3];
        }

        if (id > 0) {

            brandService.getBrandEdit(id)
                .then(function(response) {

                    if (response !== "" && response !== undefined) {
                        $scope.brand = response;
                    }
                });
        }

        $scope.save = function () {

            if ($scope.brand.id > 0) {
                // Edit
                brandService.updateBrand($scope.brand)
                    .then(function(res) {
                        if (res === true) {
                            window.location.href = "/ProductBrands/";
                        }
                    });
            }
            else {
                // New
                brandService.createBrand($scope.brand)
                    .then(function (res) {
                        if (res.id > 0) {
                            window.location.href = "/ProductBrands/Edit/" + res.id;
                        }
                    });
                    
            }


        }

        $scope.newBtnClicked = function () {

            window.location.href = '/ProductBrands/Create/';

        }

        $scope.cancel = function () {
            window.location.href = '/ProductBrands/';
        }
    }
    

})();