(function(angular){
	"use strict";

	angular.module('MyStore')
        .config(function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url: '/',
                controller: 'HomeController',
				templateUrl: 'views/home.html'
			})
			.state('products', {
				url: '/products',
				controller: 'ProductList',
				templateUrl: 'views/product-list.html'
			})
            .state('product', {
                url: '/product/:id',
                controller: 'ProductDetail',
                templateUrl: 'views/product-detail.html'
            })
			.state('cart', {
				url: '/cart',
				controller: 'CartController',
				templateUrl: 'views/cart.html'
			})
			.state('about', {
				url: '/about',
				template: '<h1>About</h1>'
			})
			.state('contact', {
				url: '/contact',
				template: '<h1>Contact</h1>'
			})
            .state('login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: 'views/login.html'
            })
            .state('signup', {
                url: '/signup',
                controller: 'SignupController',
                templateUrl: 'views/signup.html'
            });

	});

})(window.angular);
