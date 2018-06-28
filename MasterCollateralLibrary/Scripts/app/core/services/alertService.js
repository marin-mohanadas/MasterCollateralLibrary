/*
 * Copyright 2017 MindHarbor
 * Author: Dai Nguyen
 */

(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('alertService', ['toastr', alertService]);

    function alertService(toastr) {

        var service = {
            success: success,
            error: error,
            info: info
        };

        return service;

        function success(message) {
            toastr.success(message);
        }

        function error(message) {
            toastr.error(message);
        }

        function info(message) {
            toastr.info(message);
        }
    }
})();