(function() {
    'use strict';

    var chatApp = angular.module('chatApp', ['ngRoute', 'ui.bootstrap']);

    chatApp.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'pages/login.html',
                controller  : 'loginController'
            })

            .when('/home/:user_name', {
                templateUrl : 'pages/home.html',
                controller  : 'homeController'
            })

            .when('/register', {
                templateUrl : 'pages/register.html',
                controller  : 'registerController'
            });
    });

    chatApp.controller('loginController', function($scope, $location) {
        $scope.loginInfo = {};

        $scope.login = function() {
            var users = JSON.parse(localStorage.getItem('users'));

            if (users) {
                for (var i = 0; i < users.length; i++) {
                    var email = users[i].email,
                        password = users[i].password;

                    if (email == $scope.loginInfo.email
                        && password == $scope.loginInfo.password) {
                        $location.path('/home/' + users[i].first_name);
                    }
                }
            }
        }
    });

    chatApp.controller('homeController', function($scope, $http, $routeParams) {
        $scope.user_name = $routeParams.user_name;

        // Experimental: Wikipedia API
        //
        //$.getJSON(
        //    'https://en.wikipedia.org/w/api.php?action=query&&rawcontinue=&format=json&callback=?',
        //    {
        //        titles: 'Cheese',
        //        prop: 'images'
        //    },
        //    function(data) {
        //        console.log(data);
        //    }
        //);

        $scope.foodBank = [
            {name: 'Butter, salted', id:'01001'},
            {name: 'Butter, whipped, with salt', id:'01002'},
            {name: 'Butter oil, anhydrous', id :'01003'},
            {name: 'Cheese, blue', id :'01004'},
            {name: 'Cheese, brick', id :'01005'},
            {name: 'Cheese, brie', id: '01006'},
            {name: 'Cheese, camembert', id: '01007'},
            {name: 'Cheese, caraway', id: '01008'},
            {name: 'Cheese, cheddar', id: '01009'},
            {name: 'Cheese, cheshire', id: '01010'},
            {name: 'Cheese, colby', id: '01011'},
            {name: 'Cheese, cottage, creamed', id: '01012'},
            {name: 'Cheese, cottage, creamed, with fruit', id: '01013'},
            {name: 'Cheese, cottage, nonfat, uncreamed, dry', id: '01014'},
            {name: 'Cheese, cottage, lowfat, 2% milkfat', id: '01015'},
            {name: 'Cheese, cottage, lowfat, 1% milkfat', id: '01016'},
            {name: 'Cheese, cream', id: '01017'},
            {name: 'Cheese, edam', id: '01018'}
        ];

        $scope.nutritionInfo = function() {
            $http.get('http://api.nal.usda.gov/ndb/reports/?ndbno=' + $scope.foodSelected.id + '&type=f&format=json&api_key=TnuJOsEgPNEEO7IMiPyHPjiH038tet819KzrE7q7')
                .success(function(data) {
                    $scope.nutritionCaption = 'Nutrition Info per 100g';
                    $scope.selectedFoodName = $scope.foodSelected.name;
                    $scope.nutrients = data.report.food.nutrients;
                    $scope.foodGroup = data.report.food.fg;

                    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
                        {
                            tags: $scope.selectedFoodName.split(',')[0].trim(),
                            tagmode: "any",
                            format: "json"
                        },
                        function(data) {
                            var imgIdx = 3;

                            $('#cardHeader').css('background-image', "url('" + data.items[imgIdx].media.m + "')");
                            $('#imageHeader').attr('src', data.items[imgIdx].media.m);
                        }
                    );

                    $('#nutritionCard').css('border', '1px solid #ddd');
                });
        };

    });

    chatApp.controller('registerController', function($scope, $location) {
        $scope.userInfo = {};

        localStorage.setItem('users', '[]');

        $scope.addUser = function() {
            var users = JSON.parse(localStorage.getItem('users'));

            users.push($scope.userInfo);
            localStorage.setItem('users', JSON.stringify(users));
            console.log(localStorage.getItem('users'));

            $location.path('/')
        };
    });
})();