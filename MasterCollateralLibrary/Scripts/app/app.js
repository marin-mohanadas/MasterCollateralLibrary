/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    var app = angular.module('app', [
        'ngAnimate',        
        'ui.bootstrap',
        'ngAnimate',
        'ngMessages',
        'ngCookies',
        'ngFileUpload',
        'infinite-scroll',
        'toastr',
        'ui.tree',
        'app.core',
        'app.quote',
        'app.component',
        'app.customer',
        'app.productGroup',
        'app.vendor',
        'app.category',
        'app.brand',
        'app.packFormulas',
        'app.materials',
        'app.costTypes',
        'app.boxes',
        'app.salesReps',
        'app.clientAccounts',
        'app.distributor',
        'app.gpo',
        'app.account',
        'app.productManagers'
    ]);

    var baseUri = window.location.origin + '/';
    
    app.constant('constants', {
        baseUri: baseUri
    });

})();