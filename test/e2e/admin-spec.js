﻿// Admin page spec
describe("admin-page", function () {
    //browser.get("#/");

    var generateTests;
    var removeTests;

    beforeAll(function () {
        // Login as an administrator
        element(by.model("loginData.username")).sendKeys("administrator");
        element(by.model("loginData.password")).sendKeys("cloudmedicrocks");
        element(by.buttonText("Login to your account")).click();

        generateTests = function () {
            var testNames = ["Mike", "John"];
            for (var i = 0; i < 2; i++) {
                var randNo = Math.floor((Math.random() * 10000) + 1);

                element(by.id("physician-tab")).click();
                element(by.buttonText("Add Physician/Nurse")).click();
                element(by.model('creator.Email')).sendKeys(testNames[i] + "Miller@example.com");
                element(by.model('creator.FirstName')).sendKeys(testNames[i]);
                element(by.model('creator.LastName')).sendKeys("Miller");
                element(by.model('data.PhoneNumber')).sendKeys(" 1234567890");
                element(by.model('dt')).sendKeys("1934-11-01");
                element(by.cssContainingText('option', 'Male')).click();
                element(by.cssContainingText('option', 'Physician')).click();
                element(by.id("register-btn")).click();
            }

            for (var j = 0; j < 2; j++) {
                var randNo = Math.floor((Math.random() * 10000) + 1);

                element(by.id("supporter-tab")).click();
                element(by.buttonText("Add Supporter")).click();
                element(by.model('creator.Email')).sendKeys(testNames[j] + "Johnson@example.com");
                element(by.model('creator.FirstName')).sendKeys(testNames[j]);
                element(by.model('creator.LastName')).sendKeys("Johnson");
                element(by.model('data.PhoneNumber')).sendKeys(" 1234567890");
                element(by.model('dt')).sendKeys("1934-11-01");
                element(by.cssContainingText('option', 'Male')).click();
                element(by.id("register-btn")).click();
            }
        }

        removeTests = function () {
            var nextPhysPage = element(by.id("next-phys-pg"));
            var nextSuppPage = element(by.id("next-supp-pg"));
            var count = 0;

            // Iterate through the pages and search for example provider to delete
            var findExampleProvider = function (email) {
                return element.all(by.cssContainingText("tbody tr", email)).count().then(function (result) {
                    count += result;
                    var hasNext = nextPhysPage.isDisplayed().then(function (result) {
                        if (result && count === 0) {
                            nextPhysPage.click().then(function () {
                                findExampleProvider(email);
                            });
                        } else {
                            element(by.cssContainingText("tbody tr", email)).element(by.id("remove-physician")).click();
                            element(by.buttonText("Yes, delete User!")).click();
                            count = 0;
                        }
                    });
                });
            }

            var findExampleSupporter = function (email) {
                return element.all(by.cssContainingText("tbody tr", email)).count().then(function (result) {
                    count += result;
                    var hasNext = nextSuppPage.isDisplayed().then(function (result) {
                        if (result && count === 0) {
                            nextSuppPage.click().then(function () {
                                findExampleSupporter(email);
                            });
                        } else {
                            element(by.cssContainingText("tbody tr", email)).element(by.id("remove-supporter")).click();
                            element(by.buttonText("Yes, delete User!")).click();
                            count = 0;
                        }
                    });
                });
            }

            element(by.id("physician-tab")).click().then(function () {
                findExampleProvider("MikeMiller@example.com");
            });
            element(by.id("physician-tab")).click().then(function () {
                findExampleProvider("JohnMiller@example.com");
            });
            element(by.id("supporter-tab")).click().then(function () {
                findExampleSupporter("MikeJohnson@example.com");
            });
            element(by.id("supporter-tab")).click().then(function () {
                findExampleSupporter("JohnJohnson@example.com");
            });
        }
    });

    it("should load", function () {
        expect(browser.getTitle()).toBe('Admin | CloudMedic Dashboard');
    });

    describe("physicians-tab", function () {
        var physicianEmail;

        it("should be hidden initially", function () {
            expect(element(by.id("physician-list")).isDisplayed()).toBeFalsy();
        })

        it("should load when selected", function () {
            element(by.id("physician-tab")).click();
            expect(element(by.id("physician-list")).isDisplayed()).toBeTruthy();
        });

        describe("physicians-table", function () {
            it("should be sortable by name", function () {
                element(by.id("physician-list")).element(by.linkText("Full Name")).click();
                var string1 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(0).getText();
                var string2 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("physician-list")).element(by.linkText("Full Name")).click();
                var string3 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(0).getText();
                var string4 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by username", function () {
                element(by.id("physician-list")).element(by.linkText("UserName")).click();
                var r1 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(0);
                var string1 = r1.all(by.tagName('td')).get(1).getText();
                var r2 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(1);
                var string2 = r2.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("physician-list")).element(by.linkText("UserName")).click();
                var r3 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(0);
                var string3 = r3.all(by.tagName('td')).get(1).getText();
                var r4 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(1);
                var string4 = r4.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by email", function () {
                element(by.id("physician-list")).element(by.linkText("Email")).click();
                var r1 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(0);
                var string1 = r1.all(by.tagName('td')).get(2).getText();
                var r2 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(1);
                var string2 = r2.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("physician-list")).element(by.linkText("Email")).click();
                var r3 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(0);
                var string3 = r3.all(by.tagName('td')).get(2).getText();
                var r4 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(1);
                var string4 = r4.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            describe("next-page-btn", function () {
                var nextBtn = element(by.id("next-phys-pg"));

                it("should be displayed on first page", function () {
                    expect(nextBtn.isDisplayed()).toBeTruthy();
                });

                it("should lead to a new page", function () {
                    var r1 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(0);
                    var email = r1.all(by.tagName('td')).get(2).getText().then(function (data) {
                        nextBtn.click();
                        expect(element.all(by.cssContainingText("tbody tr", data)).count()).toBe(0);
                    });
                });
            });

            describe("prev-page-btn", function () {
                var prevBtn = element(by.id("prev-phys-pg"));

                it("should lead to a new page", function () {
                    var r1 = element(by.id("physician-list")).all(by.repeater("physician in physicians")).get(0);
                    var email = r1.all(by.tagName('td')).get(2).getText().then(function (data) {
                        prevBtn.click();
                        expect(element.all(by.cssContainingText("tbody tr", data)).count()).toBe(0);
                    });
                });

                it("should be hidden on first page", function () {
                    expect(prevBtn.isDisplayed()).toBeFalsy();
                });
            });
        });

        describe("add-button", function () {
            it("should be hidden for other tabs", function () {
                element(by.id("patient-tab")).click();
                expect(element(by.buttonText("Add Physician/Nurse")).isDisplayed()).toBeFalsy();
            });

            it("should be active for physician tab", function () {
                element(by.id("physician-tab")).click();
                expect(element(by.buttonText("Add Physician/Nurse")).isDisplayed()).toBeTruthy();
            });
        });

        describe("add-provider-form", function () {
            var randNo = Math.floor((Math.random() * 10000) + 1);
            physicianEmail = "physician" + randNo.toString() + "@example.com";

            it("should open on clicking add button", function () {
                element(by.buttonText("Add Physician/Nurse")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Register New Physician/Nurse")).count()).toEqual(1);
            });

            describe("name-inputs", function () {
                afterEach(function () {
                    element(by.model('creator.FirstName')).clear();
                    element(by.model('creator.LastName')).clear();
                });

                it("should display error message for invalid first name", function () {
                    element(by.model('creator.FirstName')).sendKeys("user1");

                    expect(element(by.id("fn-invalid")).isDisplayed()).toBeTruthy();
                });
                it("should display error message for invalid last name", function () {
                    element(by.model('creator.LastName')).sendKeys("example1");

                    expect(element(by.id("ln-invalid")).isDisplayed()).toBeTruthy();
                });
                it("should accept valid inputs", function () {
                    element(by.model('creator.FirstName')).sendKeys("user");
                    element(by.model('creator.LastName')).sendKeys("example");

                    expect(element(by.id("fn-invalid")).isDisplayed()).toBeFalsy();
                    expect(element(by.id("ln-invalid")).isDisplayed()).toBeFalsy();
                });
            });

            describe("phone-number-input", function () {
                afterEach(function () {
                    element(by.model('data.PhoneNumber')).clear();
                });

                it("should only allow numbers", function () {
                    element(by.model('data.PhoneNumber')).sendKeys("abc");

                    expect(element(by.model('data.PhoneNumber')).getAttribute('value')).toEqual("(xxx) xxx-xxxx");
                });

                it("should cap length of input", function () {
                    element(by.model('data.PhoneNumber')).sendKeys(" 1234567890123");

                    expect(element(by.model('data.PhoneNumber')).getAttribute('value')).toEqual("(123) 456-7890");
                });
            });

            it("should prevent submission until all fields complete", function () {
                var registerBtn = element(by.id("register-btn"));
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('creator.Email')).sendKeys(physicianEmail);
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('creator.FirstName')).sendKeys("Example");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('creator.LastName')).sendKeys("Physician");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('data.PhoneNumber')).sendKeys(" 1234567890");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('dt')).sendKeys("1934-11-01");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.cssContainingText('option', 'Male')).click();
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.cssContainingText('option', 'Physician')).click();
                expect(registerBtn.isEnabled()).toBeTruthy();
            });

            it("should close the modal upon successful creation", function () {
                element(by.id("register-btn")).click();
                expect(element.all(by.css(".modal-header")).count()).toEqual(0);
                element(by.id("physician-tab")).click();
            });

            it("should successfully create a provider", function () {
                var nextPage = element(by.id("next-phys-pg"));
                var count = 0;

                // Iterate through the pages and search for create physician
                var findProvider = function () {
                    var numberFound = element.all(by.cssContainingText("tbody tr", physicianEmail)).count().then(function (result) {
                        count += result;
                        var hasNext = nextPage.isDisplayed().then(function (result) {
                            if (result && count === 0) {
                                nextPage.click().then(function () {
                                    findProvider();
                                });
                            } else {
                                expect(count).toBeGreaterThan(0);
                            }
                        });
                    });
                }

                findProvider();
            });
        });

        describe("remove-button", function () {
            var provider;

            it("should ask for confirmation when clicked", function () {
                provider = element(by.cssContainingText("tbody tr", physicianEmail));
                provider.element(by.id("remove-physician")).click();

                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
            });

            it("should close view on successful deletion", function () {
                element(by.buttonText("Yes, delete User!")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(0);
            });

            it("should delete physician when confirmed", function () {
                element(by.id("physician-tab")).click();
                var nextPage = element(by.id("next-phys-pg"));
                var count = 0;

                // Iterate through the pages and search for deleted physician
                var findProvider = function () {
                    var numberFound = element.all(by.cssContainingText("tbody tr", physicianEmail)).count().then(function (result) {
                        count += result;
                        var hasNext = nextPage.isDisplayed().then(function (result) {
                            if (result && count === 0) {
                                nextPage.click().then(function () {
                                    findProvider();
                                });
                            } else {
                                expect(count).toBe(0);
                            }
                        });
                    });
                }

                findProvider();
            });
        });
    });

    describe("nurses-tab", function () {
        var nurseEmail;

        it("should be hidden initially", function () {
            expect(element(by.id("nurse-list")).isDisplayed()).toBeFalsy();
        })

        it("should load when selected", function () {
            element(by.id("nurse-tab")).click();
            expect(element(by.id("nurse-list")).isDisplayed()).toBeTruthy();
        });

        describe("nurses-table", function () {
            it("should be sortable by name", function () {
                element(by.id("nurse-list")).element(by.linkText("Full Name")).click();
                var string1 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(0).getText();
                var string2 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("nurse-list")).element(by.linkText("Full Name")).click();
                var string3 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(0).getText();
                var string4 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by username", function () {
                element(by.id("nurse-list")).element(by.linkText("UserName")).click();
                var r1 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(0);
                var string1 = r1.all(by.tagName('td')).get(1).getText();
                var r2 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(1);
                var string2 = r2.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("nurse-list")).element(by.linkText("UserName")).click();
                var r3 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(0);
                var string3 = r3.all(by.tagName('td')).get(1).getText();
                var r4 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(1);
                var string4 = r4.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by email", function () {
                element(by.id("nurse-list")).element(by.linkText("Email")).click();
                var r1 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(0);
                var string1 = r1.all(by.tagName('td')).get(2).getText();
                var r2 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(1);
                var string2 = r2.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("nurse-list")).element(by.linkText("Email")).click();
                var r3 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(0);
                var string3 = r3.all(by.tagName('td')).get(2).getText();
                var r4 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(1);
                var string4 = r4.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            describe("next-page-btn", function () {
                var nextBtn = element(by.id("next-nurse-pg"));

                it("should be displayed on first page", function () {
                    expect(nextBtn.isDisplayed()).toBeTruthy();
                });

                it("should lead to a new page", function () {
                    var r1 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(0);
                    var email = r1.all(by.tagName('td')).get(2).getText().then(function (data) {
                        nextBtn.click();
                        expect(element.all(by.cssContainingText("tbody tr", data)).count()).toBe(0);
                    });
                });
            });

            describe("prev-page-btn", function () {
                var prevBtn = element(by.id("prev-nurse-pg"));

                it("should lead to a new page", function () {
                    var r1 = element(by.id("nurse-list")).all(by.repeater("nurse in nurses")).get(0);
                    var email = r1.all(by.tagName('td')).get(2).getText().then(function (data) {
                        prevBtn.click();
                        expect(element.all(by.cssContainingText("tbody tr", data)).count()).toBe(0);
                    });
                });

                it("should be hidden on first page", function () {
                    expect(prevBtn.isDisplayed()).toBeFalsy();
                });
            });
        });

        describe("add-button", function () {
            it("should be hidden for other tabs", function () {
                element(by.id("patient-tab")).click();
                expect(element(by.buttonText("Add Physician/Nurse")).isDisplayed()).toBeFalsy();
            });

            it("should be active for physician tab", function () {
                element(by.id("nurse-tab")).click();
                expect(element(by.buttonText("Add Physician/Nurse")).isDisplayed()).toBeTruthy();
            });
        });

        describe("add-provider-form", function () {
            var randNo = Math.floor((Math.random() * 10000) + 1);
            nurseEmail = "nurse" + randNo.toString() + "@example.com";

            it("should open on clicking add button", function () {
                element(by.buttonText("Add Physician/Nurse")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Register New Physician/Nurse")).count()).toEqual(1);
            });

            describe("name-inputs", function () {
                afterEach(function () {
                    element(by.model('creator.FirstName')).clear();
                    element(by.model('creator.LastName')).clear();
                });

                it("should display error message for invalid first name", function () {
                    element(by.model('creator.FirstName')).sendKeys("user1");

                    expect(element(by.id("fn-invalid")).isDisplayed()).toBeTruthy();
                });
                it("should display error message for invalid last name", function () {
                    element(by.model('creator.LastName')).sendKeys("example1");

                    expect(element(by.id("ln-invalid")).isDisplayed()).toBeTruthy();
                });
                it("should accept valid inputs", function () {
                    element(by.model('creator.FirstName')).sendKeys("user");
                    element(by.model('creator.LastName')).sendKeys("example");

                    expect(element(by.id("fn-invalid")).isDisplayed()).toBeFalsy();
                    expect(element(by.id("ln-invalid")).isDisplayed()).toBeFalsy();
                });
            });

            describe("phone-number-input", function () {
                afterEach(function () {
                    element(by.model('data.PhoneNumber')).clear();
                });

                it("should only allow numbers", function () {
                    element(by.model('data.PhoneNumber')).sendKeys("abc");

                    expect(element(by.model('data.PhoneNumber')).getAttribute('value')).toEqual("(xxx) xxx-xxxx");
                });

                it("should cap length of input", function () {
                    element(by.model('data.PhoneNumber')).sendKeys(" 1234567890123");

                    expect(element(by.model('data.PhoneNumber')).getAttribute('value')).toEqual("(123) 456-7890");
                });
            });

            it("should prevent submission until all fields complete", function () {
                var registerBtn = element(by.id("register-btn"));
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('creator.Email')).sendKeys(nurseEmail);
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('creator.FirstName')).sendKeys("Example");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('creator.LastName')).sendKeys("Nurse");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('data.PhoneNumber')).sendKeys(" 1234567890");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('dt')).sendKeys("1934-11-01");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.cssContainingText('option', 'Male')).click();
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.cssContainingText('option', 'Nurse')).click();
                expect(registerBtn.isEnabled()).toBeTruthy();
            });

            it("should close the modal upon successful creation", function () {
                element(by.id("register-btn")).click();
                expect(element.all(by.css(".modal-header")).count()).toEqual(0);
                element(by.id("nurse-tab")).click();
            });

            it("should successfully create a nurse", function () {
                var nextPage = element(by.id("next-nurse-pg"));
                var count = 0;

                // Iterate through the pages and search for create physician
                var findNurse = function () {
                    var numberFound = element.all(by.cssContainingText("tbody tr", nurseEmail)).count().then(function (result) {
                        count += result;
                        var hasNext = nextPage.isDisplayed().then(function (result) {
                            if (result && count === 0) {
                                nextPage.click().then(function () {
                                    findNurse();
                                });
                            } else {
                                expect(count).toBeGreaterThan(0);
                            }
                        });
                    });
                }

                findNurse();
            });
        });

        describe("remove-button", function () {
            var provider;

            it("should ask for confirmation when clicked", function () {
                provider = element(by.cssContainingText("tbody tr", nurseEmail));
                provider.element(by.id("remove-nurse")).click();

                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
            });

            it("should close view on successful deletion", function () {
                element(by.buttonText("Yes, delete User!")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(0);
            });

            it("should delete provider when confirmed", function () {
                element(by.id("nurse-tab")).click();
                var nextPage = element(by.id("next-nurse-pg"));
                var count = 0;

                // Iterate through the pages and search for deleted nurse
                var findNurse = function () {
                    var numberFound = element.all(by.cssContainingText("tbody tr", nurseEmail)).count().then(function (result) {
                        count += result;
                        var hasNext = nextPage.isDisplayed().then(function (result) {
                            if (result && count === 0) {
                                nextPage.click().then(function () {
                                    findNurse();
                                });
                            } else {
                                expect(count).toBe(0);
                            }
                        });
                    });
                }

                findNurse();
            });
        });
    })

    describe("supporters-tab", function () {
        var supporterEmail;

        it("should be hidden initially", function () {
            expect(element(by.id("supporter-list")).isDisplayed()).toBeFalsy();
        });

        it("should load when selected", function () {
            element(by.id("supporter-tab")).click();
            expect(element(by.id("supporter-list")).isDisplayed()).toBeTruthy();
        });

        describe("supporters-table", function () {
            it("should be sortable by name", function () {
                element(by.id("supporter-list")).element(by.linkText("Full Name")).click();
                var string1 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(0).getText();
                var string2 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("supporter-list")).element(by.linkText("Full Name")).click();
                var string3 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(0).getText();
                var string4 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by username", function () {
                element(by.id("supporter-list")).element(by.linkText("UserName")).click();
                var r1 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(0);
                var string1 = r1.all(by.tagName('td')).get(1).getText();
                var r2 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(1);
                var string2 = r2.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("supporter-list")).element(by.linkText("UserName")).click();
                var r3 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(0);
                var string3 = r3.all(by.tagName('td')).get(1).getText();
                var r4 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(1);
                var string4 = r4.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by email", function () {
                element(by.id("supporter-list")).element(by.linkText("Email")).click();
                var r1 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(0);
                var string1 = r1.all(by.tagName('td')).get(2).getText();
                var r2 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(1);
                var string2 = r2.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("supporter-list")).element(by.linkText("Email")).click();
                var r3 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(0);
                var string3 = r3.all(by.tagName('td')).get(2).getText();
                var r4 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(1);
                var string4 = r4.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            describe("next-page-btn", function () {
                var nextBtn = element(by.id("next-supp-pg"));

                it("should be displayed on first page", function () {
                    expect(nextBtn.isDisplayed()).toBeTruthy();
                });

                it("should lead to a new page", function () {
                    var r1 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(0);
                    var email = r1.all(by.tagName('td')).get(2).getText().then(function (data) {
                        nextBtn.click();
                        expect(element.all(by.cssContainingText("tbody tr", data)).count()).toBe(0);
                    });
                });
            });

            describe("prev-page-btn", function () {
                var prevBtn = element(by.id("prev-supp-pg"));

                it("should lead to a new page", function () {
                    var r1 = element(by.id("supporter-list")).all(by.repeater("supporter in supporters")).get(0);
                    var email = r1.all(by.tagName('td')).get(2).getText().then(function (data) {
                        prevBtn.click();
                        expect(element.all(by.cssContainingText("tbody tr", data)).count()).toBe(0);
                    });
                });

                it("should be hidden on first page", function () {
                    expect(prevBtn.isDisplayed()).toBeFalsy();
                });
            });
        });

        describe("add-button", function () {
            it("should be hidden for other tabs", function () {
                element(by.id("patient-tab")).click();
                expect(element(by.buttonText("Add Supporter")).isDisplayed()).toBeFalsy();
            });

            it("should be active for provider tab", function () {
                element(by.id("supporter-tab")).click();
                expect(element(by.buttonText("Add Supporter")).isDisplayed()).toBeTruthy();
            });
        });

        describe("add-supporter-form", function () {
            var randNo = Math.floor((Math.random() * 10000) + 1);
            supporterEmail = "supporter" + randNo.toString() + "@example.com";

            it("should open on clicking add button", function () {
                element(by.buttonText("Add Supporter")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Register New Supporter")).count()).toEqual(1);
            });

            describe("name-inputs", function () {
                afterEach(function () {
                    element(by.model('creator.FirstName')).clear();
                    element(by.model('creator.LastName')).clear();
                });

                it("should display error message for invalid first name", function () {
                    element(by.model('creator.FirstName')).sendKeys("user1");

                    expect(element(by.id("fn-invalid")).isDisplayed()).toBeTruthy();
                });
                it("should display error message for invalid last name", function () {
                    element(by.model('creator.LastName')).sendKeys("example1");

                    expect(element(by.id("ln-invalid")).isDisplayed()).toBeTruthy();
                });
                it("should accept valid inputs", function () {
                    element(by.model('creator.FirstName')).sendKeys("user");
                    element(by.model('creator.LastName')).sendKeys("example");

                    expect(element(by.id("fn-invalid")).isDisplayed()).toBeFalsy();
                    expect(element(by.id("ln-invalid")).isDisplayed()).toBeFalsy();
                });
            });

            describe("phone-number-input", function () {
                afterEach(function () {
                    element(by.model('data.PhoneNumber')).clear();
                });

                it("should only allow numbers", function () {
                    element(by.model('data.PhoneNumber')).sendKeys("abc");

                    expect(element(by.model('data.PhoneNumber')).getAttribute('value')).toEqual("(xxx) xxx-xxxx");
                });

                it("should cap length of input", function () {
                    element(by.model('data.PhoneNumber')).sendKeys(" 1234567890123");

                    expect(element(by.model('data.PhoneNumber')).getAttribute('value')).toEqual("(123) 456-7890");
                });
            });

            it("should prevent submission until all fields complete", function () {
                var registerBtn = element(by.id("register-btn"));
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('creator.Email')).sendKeys(supporterEmail);
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('creator.FirstName')).sendKeys("example");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('creator.LastName')).sendKeys("supporter");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('data.PhoneNumber')).sendKeys(" 1234567890");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.model('dt')).sendKeys("1934-11-01");
                expect(registerBtn.isEnabled()).toBeFalsy();

                element(by.cssContainingText('option', 'Male')).click();
                expect(registerBtn.isEnabled()).toBeTruthy();
            });

            it("should close the modal upon successful creation", function () {
                element(by.id("register-btn")).click();
                expect(element.all(by.css(".modal-header")).count()).toEqual(0);
            });

            it("should successfully create a supporter", function () {
                element(by.id("supporter-tab")).click();
                var nextPage = element(by.id("next-supp-pg"));
                var count = 0;

                // Iterate through the pages and search for created supporter
                var findSupporter = function () {
                    var numberFound = element.all(by.cssContainingText("tbody tr", supporterEmail)).count().then(function (result) {
                        count += result;
                        var hasNext = nextPage.isDisplayed().then(function (result) {
                            if (result && count === 0) {
                                nextPage.click().then(function () {
                                    findSupporter();
                                });
                            } else {
                                expect(count).toBeGreaterThan(0);
                            }
                        });
                    });
                }

                findSupporter();
            });
        });

        describe("remove-button", function () {
            var supporter;

            it("should ask for confirmation when clicked", function () {
                supporter = element(by.cssContainingText("tbody tr", supporterEmail));

                supporter.element(by.id("remove-supporter")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
            });

            it("should close view on successful deletion", function () {
                element(by.buttonText("Yes, delete User!")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(0);
            });

            it("should delete supporter when confirmed", function () {
                element(by.id("supporter-tab")).click();
                var nextPage = element(by.id("next-supp-pg"));
                var count = 0;

                // Iterate through the pages and search for deleted supporter
                var findSupporter = function () {
                    var numberFound = element.all(by.cssContainingText("tbody tr", supporterEmail)).count().then(function (result) {
                        count += result;
                        var hasNext = nextPage.isDisplayed().then(function (result) {
                            if (result && count === 0) {
                                nextPage.click().then(function () {
                                    findSupporter();
                                });
                            } else {
                                expect(count).toBe(0);
                            }
                        });
                    });
                }

                findSupporter();
            });
        });
    });

    describe("patients-tab", function () {
        it("should be the default loaded tab", function () {
            browser.get('#/admin');
            expect(element(by.id("patient-list")).isDisplayed()).toBeTruthy();
        });

        describe("patients-table", function () {
            it("should be sortable by name", function () {
                element(by.id("patient-list")).element(by.linkText("Full Name")).click();
                var string1 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(0).getText();
                var string2 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("patient-list")).element(by.linkText("Full Name")).click();
                var string3 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(0).getText();
                var string4 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by username", function () {
                element(by.id("patient-list")).element(by.linkText("UserName")).click();
                var r1 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(0);
                var string1 = r1.all(by.tagName('td')).get(1).getText();
                var r2 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(1);
                var string2 = r2.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("patient-list")).element(by.linkText("UserName")).click();
                var r3 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(0);
                var string3 = r3.all(by.tagName('td')).get(1).getText();
                var r4 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(1);
                var string4 = r4.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            it("should be sortable by email", function () {
                element(by.id("patient-list")).element(by.linkText("Email")).click();
                var r1 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(0);
                var string1 = r1.all(by.tagName('td')).get(2).getText();
                var r2 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(1);
                var string2 = r2.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeGreaterThan(data[1].toLowerCase());
                });

                element(by.id("patient-list")).element(by.linkText("Email")).click();
                var r3 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(0);
                var string3 = r3.all(by.tagName('td')).get(2).getText();
                var r4 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(1);
                var string4 = r4.all(by.tagName('td')).get(2).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect((data[0].toLowerCase())).toBeLessThan(data[1].toLowerCase());
                });
            });

            describe("next-page-btn", function () {
                var nextBtn = element(by.id("next-ptnt-pg"));

                it("should be displayed on first page", function () {
                    expect(nextBtn.isDisplayed()).toBeTruthy();
                });

                it("should lead to a new page", function () {
                    var r1 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(0);
                    var email = r1.all(by.tagName('td')).get(2).getText().then(function (data) {
                        nextBtn.click();
                        expect(element.all(by.cssContainingText("tbody tr", data)).count()).toBe(0);
                    });
                });
            });

            describe("prev-page-btn", function () {
                var prevBtn = element(by.id("prev-ptnt-pg"));

                it("should lead to a new page", function () {
                    var r1 = element(by.id("patient-list")).all(by.repeater("patient in patients")).get(0);
                    var email = r1.all(by.tagName('td')).get(2).getText().then(function (data) {
                        prevBtn.click();
                        expect(element.all(by.cssContainingText("tbody tr", data)).count()).toBe(0);
                    });
                });

                it("should be hidden on first page", function () {
                    expect(prevBtn.isDisplayed()).toBeFalsy();
                });
            });
        });

        describe("remove-button", function () {
            var patient;

            it("should ask for confirmation when clicked", function () {
                var nextPage = element(by.id("next-ptnt-pg"));
                var count = 0;

                // Iterate through the pages and search for created patient
                var findPatient = function () {
                    var numberFound = element.all(by.cssContainingText("tbody tr", "person@sample.com")).count().then(function (result) {
                        count += result;
                        var hasNext = nextPage.isDisplayed().then(function (result) {
                            if (result && count === 0) {
                                nextPage.click().then(function () {
                                    findPatient();
                                });
                            } else {
                                patient = element(by.cssContainingText("tbody tr", "person@sample.com"));
                                patient.element(by.id("remove-patient")).click();
                                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
                            }
                        });
                    });
                }

                findPatient();
            });

            it("should delete user when confirmed", function () {
                element(by.buttonText("Yes, delete User!")).click();
                element(by.id("patient-tab")).click();
                var nextPage = element(by.id("next-ptnt-pg"));
                var count = 0;

                // Iterate through the pages and search for deleted patient
                var findPatient = function () {
                    var numberFound = element.all(by.cssContainingText("tbody tr", "person@sample.com")).count().then(function (result) {
                        count += result;
                        var hasNext = nextPage.isDisplayed().then(function (result) {
                            if (result && count === 0) {
                                nextPage.click().then(function () {
                                    findPatient();
                                });
                            } else {
                                expect(count).toBe(0);
                            }
                        });
                    });
                }

                findPatient();
            });
        });

        describe("create-careteam-form", function () {
            it("should open on clicking add button", function () {
                // generate test characters before opening modal
                generateTests();

                element.all(by.id("patient-tab")).click();
                element.all(by.id("create-careteam")).get(0).click();
                expect(element.all(by.cssContainingText(".modal-title", "Create New Care Team")).count()).toEqual(1);
            }, 100000);

            describe("patient-name-input", function () {
                it("should not allow editing", function () {
                    expect(element(by.id("patient-name")).isEnabled()).toBeFalsy();
                });
            });

            describe("provider-search-input", function () {
                afterEach(function () {
                    element(by.model("providerEmail")).clear();
                });

                it("should allow searching providers", function () {
                    element(by.model("providerEmail")).sendKeys("MikeMiller@example.com");
                    element(by.id("search-providers")).click();

                    element.all(by.repeater("provider in selectedProviders")).count().then(function (count) {
                        expect(count).toEqual(1);
                    });
                });

                it("should capture the enter keypress", function () {
                    element(by.model("providerEmail")).sendKeys("JohnMiller@example.com");
                    element(by.model("providerEmail")).sendKeys(protractor.Key.ENTER);

                    element.all(by.repeater("provider in selectedProviders")).count().then(function (count) {
                        expect(count).toEqual(2);
                    });
                });
            });

            describe("selected-providers-field", function () {
                describe("deselect/remove-button", function () {
                    it("should remove provider from select field", function () {
                        var oldCount = element.all(by.repeater("provider in selectedProviders")).count();
                        element.all(by.id("deselect-provider")).get(0).click();
                        var newCount = element.all(by.repeater("provider in selectedProviders")).count();
                        expect(oldCount).toBeGreaterThan(newCount);
                    });
                });
            });

            describe("supporter-search-input", function () {
                afterEach(function () {
                    element(by.model("supporterEmail")).clear();
                });

                it("should allow searching supporters", function () {
                    element(by.model("supporterEmail")).sendKeys("MikeJohnson@example.com");
                    element(by.id("search-supporters")).click();

                    element.all(by.repeater("supporter in selectedSupporters")).count().then(function (count) {
                        expect(count).toEqual(1);
                    });
                });

                it("should capture the enter keypress", function () {
                    element(by.model("supporterEmail")).sendKeys("JohnJohnson@example.com");
                    element(by.model("supporterEmail")).sendKeys(protractor.Key.ENTER);

                    element.all(by.repeater("supporter in selectedSupporters")).count().then(function (count) {
                        expect(count).toEqual(2);
                    });
                });
            });

            describe("selected-supporters-field", function () {
                describe("deselect/remove-button", function () {
                    it("should remove supporter from select field", function () {
                        var oldCount = element.all(by.repeater("supporter in selectedSupporters")).count();
                        element.all(by.id("deselect-supporter")).get(0).click();
                        var newCount = element.all(by.repeater("supporter in selectedSupporters")).count();
                        expect(oldCount).toBeGreaterThan(newCount);
                    });
                });
            });

            it("should prevent submission until team is named", function () {
                var createBtn = element(by.id("create-btn"));
                expect(createBtn.isEnabled()).toBeFalsy();

                element(by.id("team-name")).sendKeys("Green Lantern Corps");
                expect(createBtn.isEnabled()).toBeTruthy();
            });

            it("should close the modal upon successful creation", function () {
                element(by.model("providerEmail")).clear();
                element(by.model("providerEmail")).sendKeys("MikeMiller@example.com");
                element(by.id("search-providers")).click();

                element(by.model("providerEmail")).clear();
                element(by.model("providerEmail")).sendKeys("JohnMiller@example.com");
                element(by.id("search-providers")).click();

                element(by.model("supporterEmail")).clear();
                element(by.model("supporterEmail")).sendKeys("MikeJohnson@example.com");
                element(by.id("search-supporters")).click();

                element(by.model("supporterEmail")).clear();
                element(by.model("supporterEmail")).sendKeys("JohnJohnson@example.com");
                element(by.id("search-supporters")).click();

                element(by.id("create-btn")).click();
                expect(element.all(by.css(".modal-header")).count()).toEqual(0);
            }, 100000);
        });
    });

    describe("careteams-tab", function () {
        var testCount;

        it("should be hidden initially", function () {
            expect(element(by.id("careteams-list")).isDisplayed()).toBeFalsy();
        });

        it("should load when selected", function () {
            element(by.id("careteam-tab")).click();
            expect(element(by.id("careteams-list")).isDisplayed()).toBeTruthy();
        });

        describe("careteams-table", function () {
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

            it("should be sortable by patient", function () {
                element(by.id("careteams-list")).element(by.linkText("Patient")).click();
                var r1 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0);
                var string1 = r1.all(by.tagName('td')).get(1).getText();
                var r2 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1);
                var string2 = r2.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string1, string2]).then(function (data) {
                    expect(data[0].toLowerCase() >= data[1].toLowerCase()).toBeTruthy();
                });

                element(by.id("careteams-list")).element(by.linkText("Patient")).click();
                var r3 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(0);
                var string3 = r3.all(by.tagName('td')).get(1).getText();
                var r4 = element(by.id("careteams-list")).all(by.repeater("careTeam in careTeams")).get(1);
                var string4 = r4.all(by.tagName('td')).get(1).getText();
                protractor.promise.all([string3, string4]).then(function (data) {
                    expect(data[0].toLowerCase() <= data[1].toLowerCase()).toBeTruthy();
                });
            });
        });

        it("should display unapproved careteams in separate table", function () {
            // sample Care Team "Green Lantern Corps" created in patient-tab test
            expect(element(by.id("inactive-careteams-list")).all(by.cssContainingText("tbody tr", "Green Lantern Corps")).count()).toBeGreaterThan(0);
        });

        describe("update-form", function () {
            it("should open on clicking update button", function () {
                element(by.id("inactive-careteams-list")).element(by.cssContainingText("tbody tr", "Green Lantern Corps")).element(by.id("update-inactive-careteam")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Update CareTeam")).count()).toBeGreaterThan(0);
            });

            describe("provider-search-input", function () {
                afterEach(function () {
                    element(by.model("providerEmail")).clear();
                });

                it("should allow searching providers", function () {
                    element(by.model("providerEmail")).sendKeys("doctor@example.com");
                    element(by.id("search-providers")).click();

                    element.all(by.repeater("provider in selectedProviders")).count().then(function (count) {
                        expect(count).toEqual(3);
                    });
                });
            });

            describe("selected-providers-field", function () {
                describe("deselect/remove-button", function () {
                    it("should remove provider from select field", function () {
                        var oldCount = element.all(by.repeater("provider in selectedProviders")).count();
                        element(by.cssContainingText("tbody tr", "doctor@example.com")).element(by.id("deselect-provider")).click();
                        var newCount = element.all(by.repeater("provider in selectedProviders")).count();
                        expect(oldCount).toBeGreaterThan(newCount);
                    });
                });
            });

            describe("supporter-search-input", function () {
                afterEach(function () {
                    element(by.model("supporterEmail")).clear();
                });

                it("should allow searching supporters", function () {
                    element(by.model("supporterEmail")).sendKeys("supporter@example.com");
                    element(by.id("search-supporters")).click();

                    element.all(by.repeater("supporter in selectedSupporters")).count().then(function (count) {
                        expect(count).toEqual(3);
                    });
                });
            });

            describe("selected-supporters-field", function () {
                describe("deselect/remove-button", function () {
                    it("should remove supporter from select field", function () {
                        var oldCount = element.all(by.repeater("supporter in selectedSupporters")).count();
                        element(by.cssContainingText("tbody tr", "supporter@example.com")).element(by.id("deselect-supporter")).click();
                        var newCount = element.all(by.repeater("supporter in selectedSupporters")).count();
                        expect(oldCount).toBeGreaterThan(newCount);
                    });
                });
            });

            it("should close the modal upon successful update", function () {
                element(by.model("providerEmail")).clear();
                element(by.model("providerEmail")).sendKeys("doctor@example.com");
                element(by.id("search-providers")).click();
                element(by.model("supporterEmail")).clear();
                element(by.model("supporterEmail")).sendKeys("supporter@example.com");
                element(by.id("search-supporters")).click();
                element(by.model("careTeam.Name")).clear();
                element(by.model("careTeam.Name")).sendKeys("Watchmen");
                element(by.buttonText("Update CareTeam")).click();
                expect(element.all(by.css(".modal-header")).count()).toEqual(0);
            });

            it("should successfully modify care team", function () {
                element(by.id("careteam-tab")).click();
                expect(element(by.id("inactive-careteams-list")).all(by.cssContainingText("tbody tr", "Watchmen")).count()).toBe(1);
                // testCount variable used later to verify CareTeam deletion
                testCount = testCount = element.all(by.cssContainingText("tbody tr", "Watchmen")).count();
            });
        });

        describe("remove-button", function () {
            var careTeam;

            it("should ask for confirmation when clicked", function () {
                careTeam = element(by.id("inactive-careteams-list")).element(by.cssContainingText("tbody tr", "Watchmen"));
                careTeam.element(by.id("remove-inactive-careteam")).click();
                expect(element.all(by.cssContainingText(".modal-title", "Are You Sure?")).count()).toEqual(1);
            });

            it("should delete careteam when confirmed", function () {
                element(by.buttonText("Yes, delete care team!")).click();
                element(by.id("careteam-tab")).click();
                expect(element.all(by.cssContainingText("tbody tr", "Watchmen")).count()).toBeLessThan(testCount);
            });
        });
    });

    it("should log out", function () {
        // remove test users before logging out
        removeTests();

        element(by.linkText("Logout")).click();
        expect(browser.getTitle()).toBe('Login | CloudMedic Dashboard');
    }, 100000);
});