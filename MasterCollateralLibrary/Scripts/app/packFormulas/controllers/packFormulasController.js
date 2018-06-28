

(function () {
    'use strict';

    angular
        .module('app.packFormulas')
        .controller('packFormulasController', ['$scope', '$location', 'packFormulasService', 'quoteService', packFormulasController]);

    function packFormulasController($scope, $location, packFormulasService, quoteService) {

        $scope.formula = {
            id: 0
        };

        var temp = window.location.pathname.split('/');
        var id = 0;
        if (temp.length === 4) {
            id = temp[3];
        }

        if (id > 0) {
            packFormulasService.getFormulaEdit(id)
                .then(function(response) {
                    if (response !== "" && response !== undefined) {
                        $scope.formula = response;
                        getDropDownListData();
                    }
                });
        } else {
            getDropDownListData();
        }

        
        function getDropDownListData() {
            $scope.selectedPlant = null;
            getPlants();
        }

        $scope.selectedPlant = null;

        function getPlants() {
            quoteService.getMfgPlants()
                .then(function (res) {
                    $scope.plants = res;
                    //console.log(res);
                    if ($scope.formula === undefined || $scope.formula.id < 1) return;
                    var plantFound = false;

                    for (var i = 0; i < res.length; i++) {
                        if (res[i].id === $scope.formula.formula_locn) {
                            $scope.selectedPlant = res[i];
                            plantFound = true;
                        }
                        if (plantFound === true) break;
                    }
                });
        }

        $scope.save = function () {

            if ($scope.selectedPlant !== null) {
                $scope.formula.formula_locn = $scope.selectedPlant.id;
            }

            if ($scope.formula.id > 0) {
                //Edit
                packFormulasService.updateFormula($scope.formula)
                    .then(function (res) {
                        if (res === true) {
                            //Show result notification
                            window.location.href = "/PackFormulas/";
                        }
                    });
            } else {
                // New
                packFormulasService.createFormula($scope.formula)
                    .then(function (res) {
                        if (res.id > 0) {
                            window.location.href = "/PackFormulas/Edit/" + res.id;
                        }
                    });

            }            
        }

        $scope.cancel = function () {

            window.location = window.location.href = "/PackFormulas/";
        }

        $scope.replicate = function () {
            if ($scope.formula.id < 1) {
                return;
            }

            var copy = angular.copy($scope.formula);
            copy.id = 0;            
            $scope.formula = copy;
        }
    }
    

})();