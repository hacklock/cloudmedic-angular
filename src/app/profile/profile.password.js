﻿angular.module('cloudmedic.profile.password', ['ui.router', 'cloudmedic.resources', 'ui.bootstrap', 'form'])
.config(function config($stateProvider) {
    $stateProvider
    .state("profile.changePassword", {
        url: "/changepassword",
        onEnter: function ($modal, $state, $stateParams) {
            $modal.open({
                templateUrl: "profile/profile.password.tpl.html",
                controller: 'FormCtrl'
            }).result.then(function () {
                $state.go("profile", $stateParams);
            }, function () {
                return $state.go("profile", $stateParams);
            });
        }
    });
});