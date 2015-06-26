'use strict';

/**
 * @ngdoc function
 * @name materialPollApp.controller:MainCtrl
 * @description
 * # VoteCtrl
 * Controller of the materialPollApp
 */
angular.module('materialPollApp')
  .controller('VoteCtrl', function ($scope, $state,$stateParams, $http, myConfig) {
  	$http.get(myConfig.backend + $stateParams.id)
  	.success(function(data){
  		$scope.title = data.name;
  		$scope.multiple = data.multiple || false;
  		$scope.options = [];
  		for(var x = 0; x < data.answers.length; x++){
  			if(data.answers[x]){
  				data.answers[x].checked = false;
  				$scope.options.push({name:data.answers[x].name, checked : data.answers[x].checked });
  			}
  		}
  	});
      //check if at least one box was checked before allowing $http put
  		$scope.vote = function(options) {
        var votes = [];
        var checked = false;
  			angular.forEach(options, function(option) {
  				if(option.checked === true){
            checked = true;
            votes.push(1);
  				}else{
            votes.push(0);
          }
  			});
        if(checked === true){
          $http.put(myConfig.backend + $stateParams.id,{votes : votes})
          .success(function(){
            $state.go('/:id/v',{id: $stateParams.id});
          });
        }
  		};
      //check if allowing multiple selections, if not reset all other checkboxes
	  	$scope.updateSelection = function(position, options) {
	  		if($scope.multiple === false){
				  angular.forEach(options, function(option, index) {
				    if (position !== index) {
				      option.checked = false;
            }
				  });
				}
			};
  });
