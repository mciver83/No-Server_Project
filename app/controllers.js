var app = angular.module('vacationPlanner')

app.controller('ctrl', function($scope, userService){
	$scope.authObj = userService.authObj();

	$scope.authObj.$onAuth(function(response){
		if(response){
			$scope.authData = response;
		} else{
			$scope.authData = false;
		}
	})
})

app.controller('loginCtrl', function($scope, userService){
	$scope.status = 'Register';

	$scope.authObj = userService.authObj();

	$scope.authObj.$onAuth(function(response){
		if(response){
			$scope.authData = response;
		} else{
			$scope.authData = false;
		}
	})

  	$scope.showReg = function(){
    	if($scope.status === 'Register'){
      		$scope.status = 'Login';
    	} else {
      		$scope.status = 'Register';
    	}
    	$scope.reg = !$scope.reg;
  	};

  	$scope.register = function(user){
  		return userService.register(user);
  	}

  	$scope.login = function(user){
  		return userService.login(user);
  	}
});


app.controller('homeCtrl', function($scope, userService, userRef, vacaRef, $firebaseObject, $firebaseArray, $location){

	$scope.authObj = userService.authObj();

	$scope.authObj.$onAuth(function(response){
		if(response){
			$scope.authData = response;
		} else{
			$scope.authData = false;
		}
	})

	$scope.user = $firebaseObject(userRef);

	$scope.vacations = $firebaseArray(vacaRef);

	$scope.vacations.$loaded().then(function(vacations){
		console.log(vacations);
	})

	$scope.goNext = function(hash){ 
		$location.path(hash);
	}

	$scope.addVacation = function(vacation){
		$scope.vacations.$add({
			vacation: vacation
		});
		$scope.vacation = '';
	}

	$scope.removeVacation = function(vacation){
		if(confirm("are you sure you want to delete your vacation to " + vacation.vacation)){
			$scope.vacations.$remove(vacation);
		}
	}

	// $scope.setCurrentVacation = function(vacation){
	// 	$scope.currentVacation = vacation;
	// };


});

app.controller('vacationCtrl', function(fb, weatherService, userService, userRef, $scope, YelpAPI, currVacationRef, categoriesRef, $firebaseObject, $firebaseArray){

	$scope.authObj = userService.authObj();

	$scope.authObj.$onAuth(function(response){
		if(response){
			$scope.authData = response;
		} else{
			$scope.authData = false;
		}
	})

	$scope.user = $firebaseObject(userRef);
	
	$scope.vacation = $firebaseObject(currVacationRef);
	$scope.vacation.$loaded().then(function(vacation){
		
		$scope.getWeather($scope.vacation.vacation);
	})

	$scope.categories = $firebaseArray(categoriesRef);

	$scope.categories.$loaded().then(function(categories){
	});


	$scope.addCategory = function(category){
		$scope.categories.$add({
			category: category
		});
		$scope.newCategory = '';
	};

	$scope.removeCategory = function(category){
		if(confirm("are you sure you want to delete " + category.category)){
			$scope.categories.$remove(category);
		}
	}

	
	$scope.setCurrentCategory = function(category){
		$scope.currentCategory = category;
		var items = new Firebase(categoriesRef + '/' + $scope.currentCategory.$id + '/items');
		$scope.items = $firebaseArray(items);
		$scope.items.$loaded().then(function(items){
			// $scope.getData();
		})
	};
	
	
	$scope.addItem = function(newItem){
		$scope.items.$add({
			item: newItem
		});
		for(var i = 0; i < $scope.places; i++){
			if(newItem === $scope.places[i].name){
				$scope.places.splice(i)
			}
		}
		newItem = '';
	};

	$scope.removeItem = function(item){
		if(confirm("are you sure you want to delete " + item.item)){
			$scope.items.$remove(item);
		}
		
	};


	$scope.getData = function(){
		YelpAPI.getData($scope.vacation.vacation, $scope.currentCategory.category).then(function(response){
			$scope.places = [];
			for(var i = 0; i < response.length; i++){
				if(response[i].rating > 0){
					$scope.places.push({
						name: response[i].name,
						img: response[i].image_url,
						rating: response[i].rating,
						rating_img_url: response[i].rating_image_url,
						review_count: response[i].review_count,
						url: response[i].url
					})
				}
				
			}
			// console.log($scope.places)
			return $scope.places
		}, function(error){
			console.log(error)
		})
	};

	// $scope.getWeather = function(location){
	// 	weatherService.getWeather(location).then(function(data){
	// 		$scope.weatherData = data;
	// 	}, function(error){
	// 		console.log(error);
	// 	})
	// };

	$scope.getWeather = function(location){
		weatherService.getWeather(location).then(function(response){
			$scope.temp = response.temp;
			$scope.weather = response.weather;
			$scope.weatherIcon = response.weatherIcon;
		}, function(error){
			console.log(error);
		})
	};





})
