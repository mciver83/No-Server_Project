var app = angular.module('vacationPlanner')


app.service('userService', function(fb, $firebaseAuth, $location){
	var firebaseLogin = new Firebase(fb.url);

	var authObj = $firebaseAuth(firebaseLogin);

	this.authObj = function(){
		return authObj;
	}

	this.login = function(user, cb){
		authObj.$authWithPassword({
			email: user.email,
			password: user.password
		}).then(function(authData){
			console.log("logged in as: " + authData.uid);
			$location.path('/home/' + authData.uid.replace('simplelogin:', ''));
		}).catch(function(error){
			console.error(error)
		})
	};

	
	this.getUser = function(uid){
		return new Firebase(fb.url + '/users/' + uid)
	};
	

	this.register = function(user, cb){
		authObj.$createUser({
			email: user.email,
			password: user.password
		}).then(function(userData){
			console.log(userData);
			authObj.$authWithPassword({
			    email: user.email,
				password: user.password
			  }).then(function(authData){
			  	console.log("Logged in as:", authData.uid);
			  	authData.name = user.name;
			  	authData.email = user.email;
				authData.timestamp = new Date().toString();
				firebaseLogin.child('users').child(authData.uid.replace('simplelogin:', '')).set(authData);
				$location.path('/home/' + authData.uid.replace('simplelogin:', ''));
			}).catch(function(error) {
			  	console.error("Error: ", error);
			});
		}, function(error){
			console.log(error);
		});
	}
	
})

app.service('vacaService', function(fb){

	this.getVacations = function(uId){
		return new Firebase(fb.url + '/users/' + uId + '/vacations')
	};

	this.getVacation = function(uId, vacationId){
		return new Firebase(fb.url + '/users/' + uId + '/vacations/' + vacationId)
	};

	this.getCategories = function(uId, vacationId){
		return new Firebase(fb.url + '/users/' + uId + '/vacations/' + vacationId + '/categories');
	};

});

app.service('weatherService', function($http, $q){

	this.getWeather = function(city){
		var dfd = $q.defer();
		$http({
			method: 'GET',
			url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city
		}).then(function(response){
			var data =  {
				weather: response.data.weather[0].description,
				weatherIcon: response.data.weather[0].icon,
				temp: Math.round((response.data.main.temp - 273.15) * 1.8 + 32)
			}
			dfd.resolve(data);
		})
		return dfd.promise;
	}


	// this.getWeather = function(city){
	// 	var dfd = $q.defer();
	// 	$http({
	// 		method: 'GET',
	// 		url: 'http://api.wunderground.com/api/0deea343381dfaf0/forecast10day/q/' + city + '.json'
	// 	}).then(function(response){
	// 		console.log(response)
	// 		var data = []
	// 		var weatherArr = response.data.forecast.simpleforecast.forecastday
	// 		for(var i = 0; i < weatherArr; i++){
	// 			data.push({
	// 				weatherConditions: weatherArr[i].conditions,
	// 				month: weatherArr[i].date.month,
	// 				day: weatherArr[i].date.day,
	// 				tempHigh: weatherArr[i].high.fahrenheit,
	// 				tempLow: weatherArr[i].low.fahrenheit,
	// 				iconUrl: weatherArr[i].icon_url
	// 			})
	// 		}
	// 		dfd.resolve(data);
	// 	})
	// 	return dfd.promise;
	// }

})


app.service('YelpAPI', function ($http, $q) {

	var randomString = function (length, chars) {
		var result = '';
		for (var i = length; i > 0; --i) {
			result += chars[Math.round(Math.random() * (chars.length - 1))];
		}
		return result;
	};
	var counter = 0;
    this.getData = function(location, term, callback) {
    	var dfd = $q.defer();
		var method = 	'GET';
		var url = 		'http://api.yelp.com/v2/search';
		var params = {
			callback: 'angular.callbacks._' + counter,
			// callback: 'JSON_CALLBACK',
			location: location,
			oauth_consumer_key:'uPHjeLSKTuu0k8CuQ3JdEw', // consumer key
			oauth_token: 'b3zoA94VzqwpJPEaZiPBEFwd-F2V1JxJ', //Token
			oauth_signature_method: 'HMAC-SHA1',
  			oauth_timestamp: new Date().getTime(),
  			oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
  			term: term
		}; // end params
		var consumerSecret = '04dyZCVxZ8zwLXY-aFqu9R1siLo'; //Consumer Secret
		var tokenSecret = 'zbTzYwBRTfM9w16wESJwRXumfM4'; //Token Secret
  		var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, { encodeSignature: false }); 
  		// end signature
  		params['oauth_signature'] = signature;
  		console.log(params.callback);
  		// $http({
  		// 	method: 'JSONP',
  		// 	params: params,
  		// 	url: url + '?callback=JSON_CALLBACK'
  		// }).then(function(response){
  		// 	dfd.resolve(response.data.businesses);
  		// 	counter++
  		// }, function(err){
  		// 	console.log(err)
  		// })
  		$http.jsonp(url, { params : params }).then(function(response){
  			console.log(response)
  			dfd.resolve(response.data.businesses);
  			counter++
  		}, function(err){
  			console.log(err)
  		})
  		return dfd.promise
	} // end retrieveYelp

	// this.getData().then(function(res){
	// 	console.log(res);
	// }, function(err){
	// 	console.log(err)
	// })

}); // end service
