(function(angular) {
    "use strict";

    var app = angular.module('MyStore');

    app.factory('Auth', function($http, $rootScope, $cookieStore) {

        $rootScope.currentUser = $cookieStore.get('user');
        $cookieStore.remove('user');

        return {

            login: function(user, success, error) {
                return $http.post('/api/login', user)
                    .success(function(data) {
                        $rootScope.currentUser = data;

                        success();
                    })
                    .error(error);
            },

            signup: function(user, success, error) {
                return $http.post('/api/signup', user)
                    .success(success)
                    .error(error);
            },

            logout: function(success) {
                return $http.get('/api/logout').success(function() {

                    $rootScope.currentUser = null;
                    $cookieStore.remove('user');

                    success();
                });
            }
        };

    });

})(window.angular);