(function(angular) {

    var app = angular.module('MyStore');

	// Inject in the CartService
    app.controller('CartController', function($scope, CartService) {

	    // Set the items on the scope to the items in the CartService
	    $scope.items = CartService.getItems();

        $scope.getItemCount = CartService.getItemCount;

	    $scope.removeItem = CartService.removeItem;

        $scope.emptyCart = CartService.emptyCart;

	    $scope.cartSubtotal = CartService.getCartSubtotal;

	    $scope.cartTotal = CartService.getCartTotal;

	    $scope.checkout = function() {
		    CartService.checkout();
	    }

    });

})(window.angular);
