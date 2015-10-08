describe('Controllers', function() {
	var scope;

	beforeEach(module('starter.controllers'));
    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('DashCtrl', {$scope: scope});
    }));

	it('should init empty model', function() {
		expect(typeof scope.user !== undefined).toEqual(true);
		
		expect(scope.user.name === '').toEqual(true);
		expect(scope.user.email === '').toEqual(true);
		expect(scope.user.dob === '').toEqual(true);
		expect(scope.user.password === '').toEqual(true);
		expect(scope.user.repassword === '').toEqual(true);
	})
	
	it('should bind user info', function() {
		var user = {
			'name': 'Cuong Cu',
			'email': 'csc326@mail.umkc.edu',
			'dob': '01/01/1111',
			'password': '12345',
			'repassword': '12345'
		};
		
		scope.user = user;

		expect(scope.user.name == user.name).toEqual(true);
		expect(scope.user.email === user.email).toEqual(true);
		expect(scope.user.dob === user.dob).toEqual(true);
		expect(scope.user.password === user.password).toEqual(true);
		expect(scope.user.repassword === user.repassword).toEqual(true);
	})
	
	it('should validate user info not empty', function() {
		var invalidUser = {
				'name': 'Cuong Cu',
				'email': 'csc326@mail.umkc.edu',
				'dob': '',
				'password': '12345',
				'repassword': '12345'
			},
			validUser = {
				'name': 'Cuong Cu',
				'email': 'csc326@mail.umkc.edu',
				'dob': '01/01/1111',
				'password': '12345',
				'repassword': '12345'
			};
			
		scope.user = invalidUser;
		expect(scope.validate()).toEqual(false);
		
		scope.user = validUser;
		expect(scope.validate()).toEqual(true);
	})
});