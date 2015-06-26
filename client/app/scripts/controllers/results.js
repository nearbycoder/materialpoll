'use strict';

/**
 * @ngdoc function
 * @name materialPollApp.controller:MainCtrl
 * @description
 * # ResultsCtrl
 * Controller of the materialPollApp
 */
angular.module('materialPollApp')
  .controller('ResultsCtrl', function ($scope, $stateParams, $http, myConfig) {
    $scope.options = [];
    $scope.options.votes = [];
  	$http.get(myConfig.backend + $stateParams.id)
    .success(function(data){
      $scope.title = data.name;
      $scope.multiple = data.multiple || false;
      var totalvotes = 0;
      $.each(data.votes,function() {
          totalvotes += this;
      });
      //setup initial votes based on data from db
      for(var x = 0; x < data.answers.length; x++){
        if(data.answers[x]){
          data.answers[x].checked = false;
          $scope.options.push({name:data.answers[x].name, checked : data.answers[x].checked, votes : data.votes[x], percent : data.votes[x] / totalvotes * 100 + '%'});
        }
      }
      //setup socket connection for realtime connection to poll
      var socket = io.connect('http://45.55.31.147:9090', {'sync disconnect on unload':true});
      socket.on('chat' + $stateParams.id, function(dat){
        var socketvotes = 0;
        $.each(dat.votes,function() {
            socketvotes += this;
        });
        for(var y = 0; y < dat.answers.length; y++){
          if($scope.options[y]){
            $scope.options[y].votes = dat.votes[y];
            $scope.options[y].percent = dat.votes[y] / socketvotes * 100 + '%';
          }
        }
        $scope.$apply();
      });
    });
  });
