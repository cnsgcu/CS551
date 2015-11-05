'use strict';

function extend(destination, source) {
  for (var sp in source) {
    if (source.hasOwnProperty(sp)) {
      destination[sp] = source[sp];
    }
  }
  
  return destination; 
}

// Request factory for Factory pattern
function BaseRequestFactory() {
  if (!(this instanceof BaseRequestFactory)) { 
    return new BaseRequestFactory();
  }
  
  this.tmp = null;
};

// Encapsulate common methods of request factory
BaseRequestFactory.prototype = {
  make: function(reqMethod) {
    this.tmp = {};
    this.tmp.method = reqMethod;
    
    return this;
  },
  
  requestTo: function(reqUrl) {
    this.tmp.url = reqUrl
    
    return this;
  }
}

// Mixins for mixin pattern
var DataRequestMixin = {
  carryJsonData: function(reqData) {
    var request = this.tmp;
    this.tmp = null;
          
    request.data = JSON.stringify(reqData);
    request.contentType = 'application/json'

    return request;
  }
}

var NoDataRequestMixin = {
  carryNoData: function() {
    var request = this.tmp;
    this.tmp = null;

    return request;    
  }
}

// Singleton pattern
var RequestFactory = (function() {
  extend(BaseRequestFactory.prototype, DataRequestMixin);
  extend(BaseRequestFactory.prototype, NoDataRequestMixin)
  var instance = BaseRequestFactory();
  
  return {
    getInstance: function() {
      return instance;
    }
  }
})();


// Angular starts here
angular.module('starter.controllers', [])

  .controller('DashCtrl', function($scope, $http, $location, Camera) {
    $scope.user = {
      'dob': '',
      'name': '',
      'email': '',
      'password': '',
      'repassword': ''
    };
    
    $scope.doSubmit = function() {
      var submitUser = JSON.parse(JSON.stringify($scope.user));
      delete submitUser['repassword'];
      var request = RequestFactory.getInstance().make('POST').requestTo('http://spider.mybluemix.net/users/').carryJsonData(submitUser);
      
      $http(request).success(
        function(data) {
          $location.path("/edit/" + submitUser['email']);
        }
      );
    };
  })
  
  .controller('EditCtrl', function($scope, $http, $location, $filter, $stateParams, Camera) {
    var request = RequestFactory.getInstance().make('GET').requestTo('http://spider.mybluemix.net/users/' + $stateParams.email).carryNoData();
    $http(request).success(function(data) {
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
      
      var request = RequestFactory.getInstance().make('PUT').requestTo('http://spider.mybluemix.net/users/' + $scope.uid).carryJsonData(updateUser);
      
      $http(request).success(function(data) {
        console.log(data);
      });
    };
    
    $scope.delete = function() {
      var request = RequestFactory.getInstance().make('DELETE').requestTo('http://spider.mybluemix.net/users/' + $scope.uid).carryNoData();
      
      $http(request).success(function(data) {
        $location.path('/');
      });
    };
  });