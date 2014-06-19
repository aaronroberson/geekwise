(function(angular) {

    var app = angular.module('MyStore');

	// Inject in the CartService
    app.controller('CartController', function($scope, CartService) {

	    // Set the items on the scope to the items in the CartService
	    $scope.items = CartService.getItems();

        $scope.getItemCount = CartService.getItemCount;

	    $scope.addItem = CartService.addItem;

        $scope.getItemCount = CartService.getItemCount;

	    $scope.removeItem = CartService.removeItem;
	    $scope.cartSubtotal = CartService.getCartSubtotal;

	    $scope.cartSubtotal = CartService.getCartSubtotal;

	    $scope.checkout = function() {
		    CartService.checkout();

    });

})(window.angular);
