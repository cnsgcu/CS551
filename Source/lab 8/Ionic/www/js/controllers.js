angular.module('starter.controllers', [])

  .controller('DashCtrl', function($scope, $http, $location, Camera) {
    $scope.user = {
      'dob': '',
      'name': '',
      'email': '',
      'password': '',
      'repassword': ''
    };
    
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
    };
    
    $scope.doSubmit = function() {
      var submitUser = JSON.parse(JSON.stringify($scope.user));
      delete submitUser['repassword'];
      
      $http({
        method: 'POST',
        url: 'http://localhost:9477/Spider/users',
        data: JSON.stringify(submitUser),
        contentType: 'application/json'
      }).success(function(data) {
        $location.path("/edit");
      });
    };
  })
  
  .controller('EditCtrl', function($scope, $http, $location, $filter, Camera) {
    $http({
      method: 'GET',
      url: 'http://localhost:9477/Spider/users/csc823@gmail.com',
      contentType: 'application/json'
    }).success(function(data) {
      console.log(data);
      $scope.uid = data['_id']['$oid'];

      $scope.user = {
        'dob': new Date(Date.parse(data['dob'])),
        'name': data['name'],
        'email': data['email'],
        'password': data['password'],
        'repassword': data['password']
      }
    });
    
    $scope.update = function() {
      var updateUser = JSON.parse(JSON.stringify($scope.user));
      delete updateUser['repassword'];
      
      $http({
        method: 'PUT',
        url: 'http://localhost:9477/Spider/users/' + $scope.uid,
        data: JSON.stringify(updateUser),
        contentType: 'application/json'
      }).success(function(data) {
        console.log(data);
      });
    };
    
    $scope.delete = function() {
      $http({
        method: 'DELETE',
        url: 'http://localhost:9477/Spider/users/' + $scope.uid
      }).success(function(data) {
        console.log(data);
        $location.path('/');
      });
    };
  });