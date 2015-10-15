angular.module('starter.controllers', [])

  .controller('DashCtrl', function($scope, Camera) {
    $scope.user = {
      'name': '',
      'email': '',
      'dob': '',
      'password': '',
      'repassword': ''
    }
    
    $scope.validate = function() {
      var valid = true;
      
      for (var attr in $scope.user) {
        if ($scope.user[attr] === '') {
          if (valid) valid = false;
        }
      }
      
      return valid;
    };
    
    $scope.takePicture = function() {
      Camera.getPicture().then(function(imageURI) {
        console.log(imageURI);
      }, function(err) {
        console.err(err);
      });
    }
    
    $scope.doLogin = function() {
      
    }
  });