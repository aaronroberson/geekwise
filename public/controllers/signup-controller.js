(function(angular) {
    "use strict";

    var app = angular.module('MyStore');

    app.controller('SignupController', function($scope, $state, $timeout, Auth) {

        function successCallback() {
            $scope.alert = {
                type: 'success',
                message: 'Your account has been created.'
            };

            $timeout(function() {

                $state.go('login');

                $scope.alert = undefined;

            }, 3000);
        }

        function errorCallback() {
            $scope.alert = {
                type: 'danger',
                message: 'There was an error created your account. Please try again.'
            };

            $timeout(function() {
                $scope.alert = undefined;

            }, 3000);
        }

        $scope.signup = function() {
            Auth.signup({
                email   : $scope.email,
                password: $scope.password
            }, successCallback, errorCallback);
        };
    });

})(window.angular);