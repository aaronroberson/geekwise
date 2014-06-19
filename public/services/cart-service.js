(function(angular) {
	"use strict";

	var app = angular.module('MyStore');

	app.factory('CartService', function($cookieStore, ProductService, config) {

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
                var total = 0;
                angular.forEach(items, function(item) {
                    // TODO add shipping
                    total += parseInt(item.quantity) * cart.getItemPrice(item);
                });
                return total;
			},

			checkout: function() {
				/* PayPal: www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside */

				var form = $('<form/></form>');

				var data = {
					cmd: "_cart",
					business: config.paypal.merchantID,
					upload: "1",
					rm: "2",
					charset: "utf-8",
					currency_code: 'USD'
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
			},

			getItemPrice: function(item) {
				return	parseFloat(item.isSpecial ? item.specialPrice : item.price);
			}
		};

        return cart;

	});

})(window.angular);
