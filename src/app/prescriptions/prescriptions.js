﻿angular.module('cloudmedic.prescriptions', [
    'ui.router',
    'chart.js',
    'crypteron.resources'
])
.config(function config($stateProvider) {
    $stateProvider.state('prescriptions', {
        url: '/prescriptions',
        views: {
            "main": {
                controller: 'PrescriptionsCtrl',
                templateUrl: 'prescriptions/prescriptions.tpl.html'
            }
        },
        resolve: {
            prescriptions: function (Prescriptions) {
                return Prescriptions.query().$promise;
            },
            users: function (Users) {
                return Users.query().$promise;
            },
            medications: function (Medications) {
                return Medications.query().$promise;
            }
        },
        data: { pageTitle: 'Prescriptions' }
    });
})
.controller('PrescriptionsCtrl', function ($scope, $window, $state, prescriptions, Prescriptions, localizedNotifications, $modal, users, medications) {   
    $scope.prescriptions = prescriptions;
    $scope.prescriptionsRemover = new Prescriptions();

    $scope.removePrescription = function (prescription) {
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "app.confirm.tpl.html",
            controller: ['$scope', function ($scope) {
                $scope.confirmText = "You will not be able to recover this prescription!";
                $scope.confirmButton = "Yes, delete prescription!";
            }]
        }).result.then(function () {
            $scope.prescriptionsRemover.$remove({ id: prescription.PrescriptionId }).then(function () {
                localizedNotifications.addForNext('delete.success', 'success', { entityType: 'Prescription' });
                $state.go("prescriptions", null, { reload: true });
            });
        });
    };
    $scope.createPrescription = function () {     
        localizedNotifications.removeForCurrent();
        $modal.open({
            templateUrl: "prescriptions/prescriptions.add.tpl.html",
            controller: 'PreAddCtrl',
            resolve: {MedId:""}
        }).result.then(function () {
            $state.go("medications", null, { reload: true });
        });
    };

    $scope.users = users;
    $scope.medications = medications;

    $scope.getPrescriptionInfo = function (prescription) {

        for (var j = 0; j < medications.length; j++) {
            if (prescription.MedicationId.toString() === medications[j].MedicationId.toString()) {
                $scope.MedicationName = medications[j].GenericName + ' (' + medications[j].Code + ')';
                break;
            }

        }
        for (var i = 0; i < users.length; i++) {
            if (prescription.PatientId.toString() === users[i].UserId.toString()) {
                $scope.FullName = users[i].FirstName + ' ' + users[i].LastName;
                return prescription;
            }
        }
    };
})
.controller('PreAddCtrl', function ($scope, $state, $http,$modalInstance, Prescriptions, localizedNotifications, MedId, MedName) {
    $scope.prescriptionsData = {
        MedicationId: MedId,
        MedicationName: MedName,
        Frequency: "",
        Dosage: "",
        Notes:"",
        isSubmitting: false,
        PatientId: "",
        // for testing only 
        Candidates: "",
        PatientLastName:""
    };
    $scope.search = function () {
        $http.get("https://localhost:44300/Users/Find?LastName=" + $scope.prescriptionsData.PatientLastName).then(function (response) {        
            $scope.prescriptionsData.Candidates = response.data;
        });
    };
    $scope.prescriptionsCreator = new Prescriptions();
    // Prescription creation method
    $scope.create = function () {
        localizedNotifications.removeForCurrent();
        $scope.prescriptionsData.isSubmitting = true;
        $scope.prescriptionsCreator.PrescriptionId = $scope.prescriptionsData.PrescriptionId;
        $scope.prescriptionsCreator.MedicationId = $scope.prescriptionsData.MedicationId;
        $scope.prescriptionsCreator.PatientId = $scope.prescriptionsData.PatientId;
        $scope.prescriptionsCreator.Frequency = $scope.prescriptionsData.Frequency;
        $scope.prescriptionsCreator.Dosage = $scope.prescriptionsData.Dosage;
        $scope.prescriptionsCreator.Notes = $scope.prescriptionsData.Notes;
        $scope.prescriptionsCreator.$create().then(function () {
            localizedNotifications.addForNext('create.success', 'success', { entityType: 'Prescription' });
            $modalInstance.close();
        }, function () {
            $scope.prescriptionsData.isSubmitting = false;
        });
    };

});