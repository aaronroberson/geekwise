(function(angular) {
	"use strict";

	var app = angular.module('MyStore');

	app.factory('CartService', function(config) {

		// Private items variable
		var items = {};
		var cart = {

			getItems: function() {
				// Returns items object
                return items;
			},

			addItem: function(item) {
				// Checks if item already exists
				// If it exists, updates the quantity
				// If it doesn't exist, adds quantity property with value of 1 then
				// adds the item onto the items object
                if(!items[item.guid]) {
                    item.quantity = 1;
                    items[item.guid] = item;
                }else {
                    items[item.guid].quantity += 1;
                }
			},

			removeItem: function(item_id) {
                delete items[item_id];
			},

			emptyCart: function() {
				// Sets items object to an empty object
                items = {};
			},

			getItemCount: function() {
				// returns number of items, including item quantity
                var total = 0;
                angular.forEach(items, function(item) {
                    total += parseInt(item.quantity);
                });
                return total;
			},

			getCartSubtotal: function() {
				// Return the item quantity times item price for each item in the items object
                var total = 0;
                angular.forEach(items, function(item) {
                   total += parseInt(item.quantity) * cart.getItemPrice(item);
                });
                return total;
			},

			getCartTotal: function() {
				// Return the cartSubtotal plus shipping and handling
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
