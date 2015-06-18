var app = angular.module('vacationPlanner')

/*
app.directive('vacation', function(){
	return {
		restrict: 'E',
		templateUrl: 'app/directives/vacation.html',
		scope: {
			setVacation: '&',
			vacation: '=',
			currentVacation: '='
		},
		link: function(scope, element, attrs){
			element.on('click', function(){
				scope.setVacation({vacation: scope.vacation})
				scope.$apply();
			})
		},
		controller: function($scope){
			$scope.$watch('currentVacation', function(){
				if($scope.vacation !== $scope.currentVacation){
					$scope.show = false;
				}
			})
		}
	}
})
*/

app.directive('category', function(){
	return {
		restrict: 'E',
		templateUrl: 'app/directives/category.html',
		transclude: true,
		scope: {
			setCategory: '&',
			category: '=',
			currentCategory: '=',
			items: '=',
			addItem: '=',
			newItem: '=',
			removeItem: '=',
			getData: '&',
			places: '='
		},
		link: function(scope, element, attrs){
			var justClicked = false;
			element.on('click', function(){
				if(justClicked){
					justClicked = false;
					return
				}
				scope.show = true;
				if(scope.show === true){
					scope.setCategory({category: scope.category});
				};

				$(this)
					.addClass('active')
					.siblings()
						.removeClass('active')
					.parent()
						.removeClass('vacation')
				scope.$apply();
				
			});
			var x = element.children(1)[0];
			$(x).on('click', function(){
				scope.show = false;
				$(element).removeClass('active')
					.parent()
						.addClass('vacation')
				justClicked = true;
				scope.$apply();
			});

		},
		controller: function($scope){
			$scope.$watch('currentCategory', function(){
				if($scope.category !== $scope.currentCategory){
					$scope.show = false;
				} else {
					$scope.getData();
				}
			})
		}
	}
})
