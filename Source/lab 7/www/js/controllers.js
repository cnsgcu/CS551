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
        url: 'https://api.mongolab.com/api/1/databases/mysql/collections/users?apiKey=V9wNk7IJhJCX3tA-PczYNw3iR2JtdNhi',
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
      url: 'https://api.mongolab.com/api/1/databases/mysql/collections/users?apiKey=V9wNk7IJhJCX3tA-PczYNw3iR2JtdNhi',
      data: JSON.stringify({'email': 'csc326@mail.umkc.edu'}),
      contentType: 'application/json'
    }).success(function(data) {
      console.log(data);
      $scope.uid = data[0]['_id']['$oid'];

      $scope.user = {
        'dob': new Date(Date.parse(data[0]['dob'])),
        'name': data[0]['name'],
        'email': data[0]['email'],
        'password': data[0]['password'],
        'repassword': data[0]['password']
      }
    });
    
    $scope.update = function() {
      var updateUser = JSON.parse(JSON.stringify($scope.user));
      delete updateUser['repassword'];
      
      $http({
        method: 'PUT',
        url: 'https://api.mongolab.com/api/1/databases/mysql/collections/users?apiKey=V9wNk7IJhJCX3tA-PczYNw3iR2JtdNhi',
        data: JSON.stringify({'$set' : updateUser}),
        contentType: 'application/json'
      }).success(function(data) {
        console.log(data);
      });
    };
    
    $scope.delete = function() {
      $http({
        method: 'DELETE',
        url: 'https://api.mongolab.com/api/1/databases/mysql/collections/users/' + $scope.uid + '?apiKey=V9wNk7IJhJCX3tA-PczYNw3iR2JtdNhi'
      }).success(function(data) {
        console.log(data);
        
        $location.path('/');
      });
    };
  });