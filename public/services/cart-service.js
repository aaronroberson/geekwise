(function(angular) {
	"use strict";

	var app = angular.module('MyStore');

	app.factory('CartService', function($cookieStore, ProductService, config) {

		// Private items variable
		var items = {};

		// Angular factories return service objects
		var cart = {

			getItems: function() {
				// Initialize the itemsCookie variable
				var itemsCookie;
				// Check if cart is empty
				if(!items.length) {
					// Get the items cookie
					itemsCookie = $cookieStore.get('items');
					// Check if the item cookie exists
					if(itemsCookie) {
						// Loop through the items in the cookie
						angular.forEach(itemsCookie, function(item, key) {
							// Get the product details from the ProductService using the guid
							ProductService.getProduct(key).then(function(response){
								var product = response.data;
								// Update the quantity to the quantity saved in the cookie
								product.quantity = item;
								// Add the product to the cart items object using the guid as the key
								items[product.guid] = product;
							});
						});
					}
				}
				// Returns items object
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
				// Remove the items cookie
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

			updateItemsCookie: function() {
				// Initialize an object to be saved as the cookie
				var itemsCookie = {};
				// Loop through the items in the cart
				angular.forEach(items, function(item, key) {
					// Add each item to the items cookie,
					// using the guid as the key and the quantity as the value
					itemsCookie[key] = item.quantity;
				});
				// Use the $cookieStore service to persist the itemsCookie object to the cookie named 'items'
				$cookieStore.put('items', itemsCookie);
			},

            getItemPrice: function(item) {
                return parseFloat(item.isSpecial ? item.specialPrice : item.price);
            },

            checkout: function() {
                // Create form DOM element
                var form = $('<form></form>');

                var data = {
                    business: config.paypal.merchantId,
                    currency_code: 'USD',
                    cmd: '_cart',
                    upload: 1,
                    rm: "2",
                    charset: "utf-8"
                };

                var counter = 0;

                angular.forEach(items, function(item, key) {
                    counter += 1;
                    data["item_number_" + counter] = item.id;
                    data["item_name_" + counter] = item.title;
                    data["quantity_" + counter] = item.quantity;
                    data["amount_" + counter] = cart.getItemPrice(item);
                });

                form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
                form.attr("method", "POST");
                form.attr("style", "display:none;");

                angular.forEach(data, function(value, name) {
                    if (value != null) {
                        var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
                        form.append(input);
                    }
                });

                $("body").append(form);

                // submit form
                form.submit();
                form.remove();

            }
		};

        return cart;

	});

})(window.angular);
