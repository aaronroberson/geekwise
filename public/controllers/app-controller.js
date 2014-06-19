(function(angular) {

    var app = angular.module('MyStore');

    app.controller('AppController', function($scope, $state, $timeout, Auth) {


        function successCallback() {

            $state.go('login');

            $scope.alert = {
                type: 'success',
                message: 'You have been logged out.'
            };

            $timeout(function() {
                $scope.alert = undefined;

            }, 3000);

        }

        $scope.logout = function() {
            Auth.logout(successCallback);
        }

    });

})(window.angular);