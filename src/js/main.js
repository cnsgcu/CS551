(function() {
    'use strict';

    var chatApp = angular.module('chatApp', ['ngRoute']);

    chatApp.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'pages/login.html',
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
    };

    $http.get('http://api.wunderground.com/api/36b799dc821d5836/conditions/q/MO/Kansas%20City.json')
        .success(function(data) {
            var temp = data.current_observation.temp_f;
            var icon = data.current_observation.icon_url;
            var weather = data.current_observation.weather;

            var contentString = "<img src='" + icon  +"'/>" + weather + '<span> - ' + temp + ' &deg; F' + '</span>';

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(39.09972, -94.57833),
                map: map
            });

            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });

        });
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