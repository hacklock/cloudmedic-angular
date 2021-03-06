﻿// Patient page spec
describe("patient-page", function () {
    //browser.get('#/');

    var createInvites = function () {
        element(by.model("loginData.username")).sendKeys("administrator");
        element(by.model("loginData.password")).sendKeys("cloudmedicrocks");
        element(by.buttonText("Login to your account")).click();

        var teamNames = ["Fantastic Three", "X Men"];
        var count = 0;
        var nextPage = element(by.id("next-ptnt-pg"));

        // Iterate through the pages and search for created patient
        var findPatient = function (name) {
            var numberFound = element.all(by.cssContainingText("tbody tr", "patient@example.com")).count().then(function (result) {
                count += result;
                var hasNext = nextPage.isDisplayed().then(function (result) {
                    if (result && count === 0) {
                        nextPage.click().then(function () {
                            findPatient(name);
                        });
                    } else {
                        element(by.cssContainingText("tbody tr", "patient@example.com")).element(by.id("create-careteam")).click();
                        element(by.model("providerEmail")).sendKeys("doctor@example.com");
                        element(by.id("search-providers")).click();

                        element(by.model("supporterEmail")).sendKeys("supporter@example.com");
                        element(by.id("search-supporters")).click();

                        element(by.id("team-name")).sendKeys(name);

                        element(by.id("create-btn")).click();
                        count = 0;
                    }
                });
            });
        }

        findPatient("Fantastic Three");
        findPatient("X Men");

        //for (var i = 0; i < 2; i++) {
        //    var nextPage = element(by.id("next-ptnt-pg"));
        //    var count = 0;
        //    findPatient();
        //}

        element(by.linkText("Logout")).click();
    };

    beforeAll(function () {
        // Create example careteam invites 
        createInvites();
    }, 100000);

    it("should load", function () {
        // Login as an provider
        element(by.model("loginData.username")).sendKeys("patient1");
        element(by.model("loginData.password")).sendKeys("Password1!");
        element(by.buttonText("Login to your account")).click();
        expect(browser.getTitle()).toBe('Patient | CloudMedic Dashboard');
    });

    describe("pending-invites-tab", function () {
        it("should be the default loaded tab", function () {
            expect(element(by.id("pending-team-list")).isDisplayed()).toBeTruthy();
        });

        it("should be sortable by careteam name", function () {
            element(by.id("pending-team-list")).element(by.linkText("Care Team Name")).click();
            var string1 = element(by.id("pending-team-list")).all(by.repeater("careTeam in careTeams")).get(0).getText();
            var string2 = element(by.id("pending-team-list")).all(by.repeater("careTeam in careTeams")).get(1).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(data[0].toLowerCase() >= data[1].toLowerCase()).toBeTruthy();
            });

            element(by.id("pending-team-list")).element(by.linkText("Care Team Name")).click();
            var string3 = element(by.id("pending-team-list")).all(by.repeater("careTeam in careTeams")).get(0).getText();
            var string4 = element(by.id("pending-team-list")).all(by.repeater("careTeam in careTeams")).get(1).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(data[0].toLowerCase() <= data[1].toLowerCase()).toBeTruthy();
            });
        });
        
        describe("approve-button", function () {
            it("should ask for confirmation when clicked", function () {
                element(by.cssContainingText("tbody tr", "Fantastic Three")).element(by.id("approve-team")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
            });

            it("should remove team from list when approved", function () {
                element(by.buttonText("Yes")).click();
                expect(element(by.id("pending-team-list")).all(by.cssContainingText("tbody tr", "Fantastic Three")).count()).toEqual(0);
            });

            it("should send approved team to care teams list", function () {
                expect(element(by.id("careteams-list")).all(by.cssContainingText("tbody tr", "Fantastic Three")).count()).toEqual(1);
            });
        });
        
        describe("reject-button", function () {
            it("should ask for confirmation when clicked", function () {
                element(by.cssContainingText("tbody tr", "X Men")).element(by.id("reject-team")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
            });

            it("should remove team from list when approved", function () {
                element(by.buttonText("Yes")).click();
                expect(element(by.id("pending-team-list")).all(by.cssContainingText("tbody tr", "X Men")).count()).toEqual(0);
            });
        });
    });

    describe("prescriptions-tab", function () {
        it("should be hidden initially", function () {
            expect(element(by.id("prescription-list")).isDisplayed()).toBeFalsy();
        });

        it("should load when selected", function () {
            element(by.id("prescription-tab")).click();
            expect(element(by.id("prescription-list")).isDisplayed()).toBeTruthy();
        });

        it("should be sortable by med name", function () {
            element(by.id("prescription-list")).element(by.linkText("Medication")).click();
            var string1 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(0).getText();
            var string2 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(1).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(data[0].toLowerCase() >= data[1].toLowerCase()).toBeTruthy();
            });

            element(by.id("prescription-list")).element(by.linkText("Medication")).click();
            var string3 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(0).getText();
            var string4 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(1).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(data[0].toLowerCase() <= data[1].toLowerCase()).toBeTruthy();
            });
        });

        it("should be sortable by start date", function () {
            element(by.id("prescription-list")).element(by.linkText("Start Date")).click();
            var r1 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(0);
            var string1 = r1.all(by.tagName('td')).get(1).getText();
            var r2 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(1);
            var string2 = r2.all(by.tagName('td')).get(1).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(Date.parse(data[0]) >= Date.parse(data[1])).toBeTruthy();
            });

            element(by.id("prescription-list")).element(by.linkText("Start Date")).click();
            var r3 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(0);
            var string3 = r3.all(by.tagName('td')).get(1).getText();
            var r4 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(1);
            var string4 = r4.all(by.tagName('td')).get(1).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(Date.parse(data[0]) <= Date.parse(data[1])).toBeTruthy();
            });
        });

        it("should be sortable by end date", function () {
            element(by.id("prescription-list")).element(by.linkText("End Date")).click();
            var r1 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(0);
            var string1 = r1.all(by.tagName('td')).get(2).getText();
            var r2 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(1);
            var string2 = r2.all(by.tagName('td')).get(2).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect(Date.parse(data[0]) >= Date.parse(data[1])).toBeTruthy();
            });

            element(by.id("prescription-list")).element(by.linkText("End Date")).click();
            var r3 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(0);
            var string3 = r3.all(by.tagName('td')).get(2).getText();
            var r4 = element(by.id("prescription-list")).all(by.repeater("prescription in prescriptions")).get(1);
            var string4 = r4.all(by.tagName('td')).get(2).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect(Date.parse(data[0]) <= Date.parse(data[1])).toBeTruthy();
            });
        });
    });

    describe("careteams-tab", function () {
        it("should be hidden initially", function () {
            expect(element(by.id("careteams-list")).isDisplayed()).toBeFalsy();
        });

        it("should load when selected", function () {
            element(by.id("careteam-tab")).click();
            expect(element(by.id("careteams-list")).isDisplayed()).toBeTruthy();
        });

        it("should be sortable by team name", function () {
            element(by.id("careteams-list")).element(by.linkText("Name")).click();
            var string1 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0).getText();
            var string2 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1).getText();
            protractor.promise.all([string1, string2]).then(function (data) {
                expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
            });

            element(by.id("careteams-list")).element(by.linkText("Name")).click();
            var string3 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0).getText();
            var string4 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1).getText();
            protractor.promise.all([string3, string4]).then(function (data) {
                expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
            });
        });

        describe("remove-button", function () {
            it("should ask for confirmation when clicked", function () {
                element(by.id("careteams-list")).element(by.cssContainingText("tbody tr", "Fantastic Three")).element(by.id("remove-careteam")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
            });

            it("should delete careteam when confirmed", function () {
                element(by.buttonText("Yes")).click();
                element(by.id("careteam-tab")).click();
                expect(element.all(by.cssContainingText("tbody tr", "Fantastic Three")).count()).toBe(0);
            });
        });
    });

    it("should log out", function () {
        element(by.linkText("Logout")).click();
        expect(browser.getTitle()).toBe('Login | CloudMedic Dashboard');
    });
});