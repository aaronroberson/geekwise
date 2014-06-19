(function(angular) {
    "use strict";

    var app = angular.module('MyStore');

    app.directive('msAddCart', function(CartService) {

        return {
            // E for Element
            // A for Attribute
            // C for Class
            restrict: 'E',
            scope: {
                // 3 types of bindings for scope properties
                // @ which is a string
                // & which is a one-way binding
                // = which is two-way binding
                product: '='
            },
            replace: true,
            templateUrl: 'templates/add-cart-button.html',
            link: function(scope, elem, attr) {
                scope.addItem = CartService.addItem;
            }

        };
    });

})(window.angular);
})(window.angular);
