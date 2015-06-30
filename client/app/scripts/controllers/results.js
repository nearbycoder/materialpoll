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
      $scope.pieData = [];
      var colors = ['#7e57c2','#ec407a', '#42a5f5', '#66bb6a', '#d4e157', '#ff7043', '#78909c', '#ffa726', '#9ccc65', '#26a69a'];
      var highlight = ['#b39ddb','#f48fb1', '#90caf9', '#a5d6a7', '#e6ee9c', '#ffab91', '#b0bec5', '#ffcc80', '#c5e1a5', '#80cbc4'];
      for(var x = 0; x < data.answers.length; x++){
        if(data.answers[x]){
          data.answers[x].checked = false;
          $scope.options.push({name:data.answers[x].name, color : colors[x], highlight: highlight[x], checked : data.answers[x].checked, votes : data.votes[x], percent : data.votes[x] / totalvotes * 100 + '%'});
          $scope.pieData.push({value: data.votes[x], color: colors[x], highlight: highlight[x], label: data.answers[x].name});
        }
        
      }

      Chart.defaults.global.responsive = true;
      var ctx = $('#pieChart').get(0).getContext('2d');
      // This will get the first returned node in the jQuery collection.
      var pieChart = new Chart(ctx).Pie($scope.pieData, {
        segmentShowStroke : false,
        segmentStrokeColor : '#fff',
        segmentStrokeWidth : 0,
        percentageInnerCutout : 0,
        animationSteps : 100,
        animationEasing : 'easeOutBounce',
        animateRotate : true,
        animateScale : false,
        legendTemplate : '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<segments.length; i++){%><li><span style=\'background-color:<%=segments[i].fillColor%>\'></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
      });
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
            pieChart.segments[y].value = dat.votes[y];
            pieChart.update();
          }
        }
        $scope.$apply();
      });
    });
  });
