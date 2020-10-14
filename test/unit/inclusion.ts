import * as chai from "chai";

import { extract, filter } from "../../src/inclusion";
import { expect } from "chai";

import assertArrays = require("chai-arrays");

/* tslint:disable:no-unused-expression */
describe("inclusion", () => {
    before(() => chai.use(assertArrays));

    describe("filter()", () => {
        const source = {
            squadName: "Super hero squad",
            homeTown: "Metro City",
            formed: 2016,
            secretBase: "Super tower",
            active: true,
            address: {
                latitude: 41.86392,
                longitude: -87.853393,
                street: "Broadview",
            },
            members: [
                {
                    name: "Molecule Man",
                    age: 29,
                    secretIdentity: "Dan Jukes",
                    powers: ["Radiation resistance", "Turning tiny", "Radiation blast"],
                    appearance: {
                        gender: "Male",
                        height: ["5'9", "180 cm"],
                        weight: ["165 lb", "75 kg"],
                        eyeColor: "blue",
                        hairColor: "brown",
                    },
                },
                {
                    name: "Madame Uppercut",
                    age: 39,
                    secretIdentity: "Jane Wilson",
                    powers: ["Million tonne punch", "Damage resistance", "Superhuman reflexes"],
                    appearance: {
                        gender: "Female",
                        height: ["6'2", "192 cm"],
                        weight: ["185 lb", "84 kg"],
                        eyeColor: "green",
                        hairColor: "brown",
                    },
                },
                {
                    name: "Eternal Flame",
                    age: 1000000,
                    secretIdentity: "Unknown",
                    powers: ["Immortality", "Heat Immunity", "Inferno", "Teleportation", "Interdimensional travel"],
                },
            ],
        };

        describe("when all filter is used", () => {
            it("should return all properties", () => {
                // Given
                const filters = ["**"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.deep.equal(source);
            });

            it("should ignore the 'members.name' filter", () => {
                // Given
                const filters = ["members.**", "members.name"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.all.keys("members");
                expect(result)
                    .to.have.property("members")
                    .to.have.deep.members([
                        {
                            name: "Molecule Man",
                            age: 29,
                            secretIdentity: "Dan Jukes",
                            powers: ["Radiation resistance", "Turning tiny", "Radiation blast"],
                            appearance: {
                                gender: "Male",
                                height: ["5'9", "180 cm"],
                                weight: ["165 lb", "75 kg"],
                                eyeColor: "blue",
                                hairColor: "brown",
                            },
                        },
                        {
                            name: "Madame Uppercut",
                            age: 39,
                            secretIdentity: "Jane Wilson",
                            powers: ["Million tonne punch", "Damage resistance", "Superhuman reflexes"],
                            appearance: {
                                gender: "Female",
                                height: ["6'2", "192 cm"],
                                weight: ["185 lb", "84 kg"],
                                eyeColor: "green",
                                hairColor: "brown",
                            },
                        },
                        {
                            name: "Eternal Flame",
                            age: 1000000,
                            secretIdentity: "Unknown",
                            powers: [
                                "Immortality",
                                "Heat Immunity",
                                "Inferno",
                                "Teleportation",
                                "Interdimensional travel",
                            ],
                        },
                    ]);
            });
        });

        describe("when root filter is used", () => {
            it("should return all root properties", () => {
                // Given
                const filters = ["*"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result)
                    .to.be.an("object")
                    .and.to.have.all.keys(["squadName", "homeTown", "formed", "secretBase", "active"]);
            });

            it("should return all 'members' properties", () => {
                // Given
                const filters = ["members.*"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.all.keys("members");
                expect(result)
                    .to.have.property("members")
                    .and.to.have.deep.members([
                        { name: "Molecule Man", age: 29, secretIdentity: "Dan Jukes" },
                        { name: "Madame Uppercut", age: 39, secretIdentity: "Jane Wilson" },
                        { name: "Eternal Flame", age: 1000000, secretIdentity: "Unknown" },
                    ]);
            });
        });

        describe("when property filter is used", () => {
            it("should return the 'address.street' property", () => {
                // Given
                const filters = ["address.street"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.nested.property("address.street", "Broadview");
            });

            it("should return the 'squadName' property", () => {
                // Given
                const filters = ["squadName"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.all.keys("squadName");
                expect(result).to.have.property("squadName").and.to.equal("Super hero squad");
            });

            it("should return the 'squadName' and 'members.name' properties", () => {
                // Given
                const filters = ["squadName", "members.name"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.all.keys("squadName", "members");
                expect(result).to.have.property("squadName").and.to.equal("Super hero squad");
                expect(result)
                    .to.have.property("members")
                    .to.have.deep.members([
                        { name: "Molecule Man" },
                        { name: "Madame Uppercut" },
                        { name: "Eternal Flame" },
                    ]);
            });

            it("should return the 'members' property", () => {
                // Given
                const filters = ["members"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.all.keys("members");
                expect(result).to.have.property("members").and.to.deep.equal(source.members);
            });

            it("should return all 'members.name' properties", () => {
                // Given
                const filters = ["members.name"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.all.keys("members");
                expect(result)
                    .to.have.property("members")
                    .and.to.have.deep.members([
                        { name: "Molecule Man" },
                        { name: "Madame Uppercut" },
                        { name: "Eternal Flame" },
                    ]);
            });

            it("should return all elements of 'members.appearance' property", () => {
                // Given
                const filters = ["members.appearance"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.all.keys("members");
                expect(result)
                    .to.have.property("members")
                    .and.to.have.deep.members([
                        {
                            appearance: {
                                gender: "Male",
                                height: ["5'9", "180 cm"],
                                weight: ["165 lb", "75 kg"],
                                eyeColor: "blue",
                                hairColor: "brown",
                            },
                        },
                        {
                            appearance: {
                                gender: "Female",
                                height: ["6'2", "192 cm"],
                                weight: ["185 lb", "84 kg"],
                                eyeColor: "green",
                                hairColor: "brown",
                            },
                        },
                    ]);
            });

            it("should return a property with similar format", () => {
                // Given
                const customSource = { test: "1", test1: "3", desc: "testing" };
                const filters = ["test"];

                // When
                const result = filter(customSource, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.all.keys(["test"]);
            });

            it("should return a property with a strange format", () => {
                // Given
                const customSource = { "[test.1.2]": "1", test1: "3", desc: "testing" };
                const filters = ["[test.1.2]"];

                // When
                const result = filter(customSource, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.all.keys(["[test.1.2]"]);
            });
        });

        describe("when index filter is used", () => {
            it("should return the first 'members.name' property", () => {
                // Given
                const filters = ["members.0.name"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.all.keys("members");
                expect(result)
                    .to.have.property("members")
                    .and.to.have.length(1)
                    .and.to.deep.include({ name: "Molecule Man" });
            });

            it("should return the second 'members.name' property", () => {
                // Given
                const filters = ["members.1.name"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.all.keys("members");
                expect(result)
                    .to.have.property("members")
                    .and.to.have.length(1)
                    .and.to.deep.include({ name: "Madame Uppercut" });
            });

            it("should return the first value of 'members.powers' property", () => {
                // Given
                const filters = ["members.powers.0"];

                // When
                const result = filter(source, filters) as any;

                // Then
                expect(result).to.be.an("object").and.to.have.property("members").and.to.be.array();

                expect(result.members[0])
                    .to.have.property("powers")
                    .and.to.be.containingAllOf(["Radiation resistance"]);
                expect(result.members[1]).to.have.property("powers").and.to.be.containingAllOf(["Million tonne punch"]);
                expect(result.members[2]).to.have.property("powers").and.to.be.containingAllOf(["Immortality"]);
            });

            it("should not return the unknown element of 'members.powers' property", () => {
                // Given
                const filters = ["members.powers.99"];

                // When
                const result = filter(source, filters) as any;

                // Then
                expect(result).to.be.an("object").and.to.be.empty;
            });

            it("should return the value of the index 1", () => {
                // Given
                const customSource = ["first", "second", "third"];
                const filters = ["1"];

                // When
                const result = filter(customSource, filters);

                // Then
                expect(result).to.be.array().and.to.be.equalTo(["second"]);
            });
        });
    });

    describe("extract()", () => {
        it("should return an empty array for no filter", () => {
            // Given
            const filters = [];

            // When
            const includeFilters = extract(filters);

            // Then
            expect(includeFilters).to.be.empty;
        });

        it("should return filters for an inclusion filter", () => {
            // Given
            const filters = ["message"];

            // When
            const includeFilters = extract(filters);

            // Then
            expect(includeFilters).to.be.an("array");
            expect(includeFilters).to.be.containingAllOf(["message"]);
        });

        it("should return filters for an inclusion filter with symbol", () => {
            // Given
            const filters = ["+message"];

            // When
            const includeFilters = extract(filters);

            // Then
            expect(includeFilters).to.be.an("array");
            expect(includeFilters).to.be.containingAllOf(["message"]);
        });

        it("should return an empty array for an exclusion filter", () => {
            // Given
            const filters = ["-message"];

            // When
            const includeFilters = extract(filters);

            // Then
            expect(includeFilters).to.be.empty;
        });

        it("should return 'cause' and '+status' properties", () => {
            // Given
            const filters = ["cause", "-message", "+status"];

            // When
            const includeFilters = extract(filters);

            // Then
            expect(includeFilters).to.be.an("array");
            expect(includeFilters).to.be.containingAllOf(["cause", "status"]);
            expect(includeFilters).to.not.be.containingAllOf(["message"]);
        });
    });
});
