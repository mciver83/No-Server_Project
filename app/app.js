var app = angular.module('vacationPlanner', ['ngRoute', 'firebase']);

app.constant("fb", {
	url: "https://vacation-planner.firebaseio.com/"
})

app.config(function($routeProvider){
	$routeProvider
	// .when('/', {
	// 	templateUrl: 'index.html'
	// })
	.when('/login', {
		templateUrl: 'app/login.html',
		controller: 'loginCtrl'
	})
	.when('/home/:uId', {
		templateUrl: 'app/home.html',
		controller: 'homeCtrl',
		resolve: {
			userRef: function(userService, $route){
				return userService.getUser($route.current.params.uId);
			}, 

			vacaRef: function(vacaService, $route){
				return vacaService.getVacations($route.current.params.uId);
			}
		}
	})
	.when('/home/:uId/:vacationId', {
		templateUrl: 'app/vacation.html',
		controller: 'vacationCtrl',
		resolve: {
			currVacationRef: function(vacaService, $route){
				return vacaService.getVacation($route.current.params.uId, $route.current.params.vacationId);
			},
			categoriesRef: function(vacaService, $route){
				return vacaService.getCategories($route.current.params.uId, $route.current.params.vacationId);
			},
			userRef: function(userService, $route){
				return userService.getUser($route.current.params.uId);
			},
			vacaRef: function(vacaService, $route){
				return vacaService.getVacations($route.current.params.uId);
			}
		}
	})
	.when('/search', {
		templateUrl: 'app/search.html',
		controller: 'searchCtrl'
	})
	.otherwise('/login')
});