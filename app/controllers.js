var app = angular.module('vacationPlanner')

app.controller('searchCtrl', function($scope, YelpApi){

	$scope.getData = function(location, term){
		YelpApi.getData(location, term);
	}
});


app.controller('loginCtrl', function($scope, userService){
	$scope.status = 'Register';

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


app.controller('homeCtrl', function($scope, userRef, vacaRef, $firebaseObject, $firebaseArray, $location){

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
		$scope.vacations.$remove({
			vacation: vacation
		})
	}

	// $scope.setCurrentVacation = function(vacation){
	// 	$scope.currentVacation = vacation;
	// };


});

app.controller('vacationCtrl', function(fb, $scope, YelpAPI, currVacationRef, categoriesRef, $firebaseObject, $firebaseArray){

	
	$scope.vacation = $firebaseObject(currVacationRef);
	$scope.vacation.$loaded().then(function(vacation){
		var vacation = $scope.vacation.vacation
		$scope.vacationName = vacation;
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

	$scope.removeCategory = function(cateogry){
		$scope.categoreis.$remove(category)
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
		newItem = '';
	};

	$scope.removeItem = function(item){
		console.log('remove');
		$scope.items.$remove(item)
	}


	$scope.getData = function(){
		YelpAPI.getData($scope.vacation.vacation, $scope.currentCategory.category).then(function(response){
			$scope.places = [];	
			for(var i = 0; i < response.length; i++){
				if(response[i].rating > 0){
					$scope.places.push({
					name: response[i].name,
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
	}



})
