(function(angular) {
	"use strict";

	var app = angular.module('MyStore');

	app.factory('CartService', function($cookieStore, ProductService) {

		// Private items variable
		var items = {};

		// Angular factories return service objects
		var cart = {

			getItems: function() {
                var itemsCookie;
				// Returns items object
                if(!items.length) {
                    itemsCookie = $cookieStore.get('items');
                    if(itemsCookie) {
                        angular.forEach(itemsCookie, function(item, key) {
                            ProductService.getProduct(key).then(function(response){
                                var product = response.data;
                                product.quantity = item;
                                items[product.guid] = product;
                            });
                        });
                    }
                }
                return items;
			},

			addItem: function(item) {
				// Checks if item already exists
				// If it exists, updates the quantity
				// If it doesn't exist, adds quantity property with value of 1 then
				// pushes the item onto the items array
                if(!items[item.guid]) {
                    item.quantity = 1;
                    items[item.guid] = item;
                } else {
                    items[item.guid].quantity += 1;
                    //items[item.guid].quantity = items[item.guid].quantity + 1
                }
                cart.updateItemsCookie();
			},

			removeItem: function(guid) {
				// Removes an item from the items array
				// Can use angular.forEach(array, function(item, index) to splice
                delete items[guid];
                // var myArr = new Array();
                // delete myArr.splice // returns false
                // delete myArr.length // return false
                // var x = 10;
                // delete x; // return false
                // y = 10;
                // delete y; // return true
                cart.updateItemsCookie();
			},

			emptyCart: function() {
				// Sets items array to empty array
                items = {};
                $cookieStore.remove('items');
			},

			getItemCount: function() {
				// returns number of items, including item quantity
                var total = 0;
                angular.forEach(items, function(item) {
                    total += item.quantity;
                });
                return total;
			},

			getCartSubtotal: function() {
				// Return the item quantity times item price for each item in the array
                var total = 0;
                angular.forEach(items, function(item) {
                    var s = parseInt(item.quantity);
                    var q = isNaN(s) ? 0 : s;
                    var p = cart.getItemPrice(item);
                   total += q * p;
                });
                return total;
            },

			getCartTotal: function() {
				// TODO Return the cartSubtotal plus shipping and handling
                // TODO Return the item quantity times item price for each item in the array
                return cart.getCartSubtotal();
			},

            // aaronaroberson@gmail.com

            updateItemsCookie: function() {
                var itemsCookie = {};
                angular.forEach(items, function(item, key) {
                    itemsCookie[key] = item.quantity;
                });
                $cookieStore.put('items', itemsCookie);
            },

            getItemPrice: function(item) {
                return parseFloat(item.isSpecial ? item.specialPrice : item.price);
            }
		};

        return cart;

	});

})(window.angular);
