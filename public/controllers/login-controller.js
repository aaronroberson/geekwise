(function(angular) {

    var app = angular.module('MyStore');

    app.controller('LoginController', function($scope, $state, $timeout, Auth) {

        function successCallback() {
            $scope.alert = {
                type: 'success',
                message: 'You have successfully logged in.'
            };

            $timeout(function() {

                $state.go('home');

                $scope.alert = undefined;

            }, 3000);
        }

        function errorCallback() {
            $scope.alert = {
                type: 'danger',
                message: 'Invalid username and/or password'
            };

            $timeout(function() {
                $scope.alert = undefined;

            }, 3000);
        }

        $scope.login = function() {

            var user = {
                email: $scope.email,
                password: $scope.password
            };

            Auth.login(user, successCallback, errorCallback);

        };

    });

})(window.angular);