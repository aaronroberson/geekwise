(function(angular) {

    var app = angular.module('MyStore');

	// Inject in the ProductService
    app.controller('CartController', function($scope, CartService) {

	    // Set the items on the scope to the items in the ProductService
	    $scope.items = CartService.getItems();

	    $scope.addItem = function(item) {
            CartService.addItem(item);
        };

        $scope.getItemCount = function() {
            return CartService.getItemCount();
        };

	    $scope.removeItem = function(guid) {
            CartService.removeItem(guid);
        };

	    $scope.cartSubtotal = function() {
            return CartService.getCartSubtotal();
        };

        $scope.emptyCart = function() {
            CartService.emptyCart();
        }

	    $scope.cartTotal = function() {
            return CartService.getCartTotal();
        };

        $scope.checkout = function() {
            CartService.checkout();
        };

    });

})(window.angular);
