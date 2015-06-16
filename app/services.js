var app = angular.module('vacationPlanner')


app.service('userService', function(fb, $firebaseAuth, $location){
	var firebaseLogin = new Firebase(fb.url);
	var authObj = $firebaseAuth(firebaseLogin);

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
