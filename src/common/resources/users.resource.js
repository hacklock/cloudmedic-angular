﻿angular.module('users.resource', ['ngResource'])
.provider('Users', function () {
    var self = this;
    self.apiUrl = '';
    self.setApiUrl = function (apiUrl) {
        self.apiUrl = apiUrl;
    };

    self.$get = function ($resource) {
        var service = $resource(self.apiUrl + 'users/:path', {}, {
            'query': { method: 'GET', isArray: false },
            'providers': { method: 'GET', isArray: false, params: { path: 'providers' } },
            'supporters': { method: 'GET', isArray: false, params: { path: 'supporters' } },
            'meds': { method: 'GET', isArray: true, params: { path: 'prescriptions' } },
            'prTeams': { method: 'GET', isArray: true, params: { path: 'provider' } },
            'sTeams': {method: 'GET', isArray: true, params: {path: 'careteams'} },
            'paTeams': { method: 'GET', isArray: true, params: { path: 'patient' } },
            'patients': { method: 'GET', isArray: true, params: { path: 'patients' } },
            'remove': { method: 'DELETE', isArray: false },
            'create': { method: 'POST', isArray: false, params: { path: 'add' } }
        });
        return service;
    };
});
