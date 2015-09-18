(function() {
    'use strict';

    var chatApp = angular.module('chatApp', ['ngRoute']);

    chatApp.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'pages/login.html'
            })

            .when('/home', {
                templateUrl: 'pages/home.html',
                controller : 'homeController'
            })

            .when('/register', {
                templateUrl: 'pages/register.html',
                controller : 'registerController'
            });
    });

    chatApp.controller('homeController', function($scope, $http) {

        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            zoom: 8,
            center: new google.maps.LatLng(39.09972, -94.57833),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };



        var map = new google.maps.Map(mapCanvas, mapOptions);

        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer({
            draggable: true
        });

        // Route
        $scope.getRoute = function() {
            var request = {
                origin: $scope.route.origin,
                destination: $scope.route.destination,
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setMap(map);
                    directionsDisplay.setDirections(response);
                }
            });

            $scope.weatherInfo();
        };

        $scope.weatherInfo = function() {
            var orgLocation = $scope.route.origin.split(',');
            var destLocation = $scope.route.destination.split(',');

            $http.get('http://api.wunderground.com/api/36b799dc821d5836/conditions/q/' + destLocation[1].trim() + '/' + destLocation[0].trim() + '.json')
                .success(function(data) {
                    $scope.destination_weather_icon = data.current_observation.icon_url;
                    $scope.destination_weather_condition = data.current_observation.weather;
                    $scope.destination_weather_temp = data.current_observation.temp_f;
                });

            $http.get('http://api.wunderground.com/api/36b799dc821d5836/conditions/q/' + orgLocation[1].trim() + '/' + orgLocation[0].trim() + '.json')
                .success(function(data) {
                    $scope.origin_weather_icon = data.current_observation.icon_url;
                    $scope.origin_weather_condition = data.current_observation.weather;
                    $scope.origin_weather_temp = data.current_observation.temp_f;
                });
        }
    });

    chatApp.controller('registerController', function($scope) {
        $scope.userInfo = {};
        localStorage.setItem('users', '[]');

        $scope.addUser = function() {
            var users = JSON.parse(localStorage.getItem('users'));

            users.push($scope.userInfo);
            localStorage.setItem('users', JSON.stringify(users));
        };
    });
})();