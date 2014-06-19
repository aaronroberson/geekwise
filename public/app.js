(function(angular) {
	"use strict";

	var app = angular.module('MyStore', ['ngCookies', 'ngMessages', 'ui.router']);

	app.value('config', {

		/* Create a merchant account and add the seller email below:
		 * https://www.paypal.com/webapps/mpp/merchant
		 */
		paypal: {
			merchantID: 'aaronaroberson@gmail.com'
		}

	});

})(window.angular);
