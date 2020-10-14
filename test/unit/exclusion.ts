import * as chai from "chai";

import { extract, filter } from "../../src/exclusion";
import { expect } from "chai";

import assertArrays = require("chai-arrays");

/* tslint:disable:no-unused-expression */
describe("exclusion", () => {
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

        before(() => chai.use(assertArrays));

        describe("when all filter is used", () => {
            it("should not return all properties", () => {
                // Given
                const filters = ["**"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.is.empty;
            });
        });

        describe("when root filter is used", () => {
            it("should not return all root properties", () => {
                // Given
                const filters = ["*"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result)
                    .to.be.an("object")
                    .and.to.not.have.all.keys(["squadName", "homeTown", "formed", "secretBase", "active"]);
            });

            it("should not return all elements in 'members' property", () => {
                // Given
                const filters = ["members.*"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.property("members").and.to.be.empty;
            });
        });

        describe("when property filter is used", () => {
            it("should not return the 'address.street' property", () => {
                // Given
                const filters = ["address.street"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.not.have.nested.property("address.street");
            });

            it("should not return the 'squadName' property", () => {
                // Given
                const filters = ["squadName"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.not.have.property("squadName");
            });

            it("should not return the 'members' property", () => {
                // Given
                const filters = ["members"];

                // When
                const result = filter(source, filters);

                // Then
                expect(result).to.be.an("object").and.to.not.have.property("members");
            });

            it("should return a property with similar format", () => {
                // Given
                const customSource = { test: "1", test1: "3", desc: "testing" };
                const filters = ["test"];

                // When
                const result = filter(customSource, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.all.keys(["test1", "desc"]);
            });

            it("should return a property with a strange format", () => {
                // Given
                const customSource = { "[test.1.2]": "1", test1: "3", desc: "testing" };
                const filters = ["[test.1.2]"];

                // When
                const result = filter(customSource, filters);

                // Then
                expect(result).to.be.an("object").and.to.have.all.keys(["test1", "desc"]);
            });
        });

        describe("when index filter is used", () => {
            it("should not return the first 'members.name' property", () => {
                // Given
                const filters = ["members.0.name"];

                // When
                const result = filter(source, filters) as any;

                // Then
                expect(result).to.be.an("object");
                expect(result.members[0]).to.be.an("object").and.to.not.have.property("name");
            });

            it("should not return the first value of 'members.powers' property", () => {
                // Given
                const filters = ["members.powers.0"];

                // When
                const result = filter(source, filters) as any;

                // Then
                expect(result).to.be.an("object").and.to.have.property("members").and.to.be.array();

                expect(result.members[0])
                    .to.have.property("powers")
                    .and.to.be.containingAllOf(["Turning tiny", "Radiation blast"]);
                expect(result.members[1])
                    .to.have.property("powers")
                    .and.to.be.containingAllOf(["Damage resistance", "Superhuman reflexes"]);
                expect(result.members[2])
                    .to.have.property("powers")
                    .and.to.be.containingAllOf([
                        "Heat Immunity",
                        "Inferno",
                        "Teleportation",
                        "Interdimensional travel",
                    ]);
            });

            it("should not return the second value of 'members.powers' property", () => {
                // Given
                const filters = ["members.powers.1"];

                // When
                const result = filter(source, filters) as any;

                // Then
                expect(result).to.be.an("object").and.to.have.property("members").and.to.be.array();

                expect(result.members[0])
                    .to.have.property("powers")
                    .and.to.be.containingAllOf(["Radiation resistance", "Radiation blast"]);
                expect(result.members[1])
                    .to.have.property("powers")
                    .and.to.be.containingAllOf(["Million tonne punch", "Superhuman reflexes"]);
                expect(result.members[2])
                    .to.have.property("powers")
                    .and.to.be.containingAllOf(["Immortality", "Inferno", "Teleportation", "Interdimensional travel"]);
            });

            it("should return all values of 'members.powers' property for wrong index", () => {
                // Given
                const filters = ["members.powers.99"];

                // When
                const result = filter(source, filters) as any;

                // Then
                expect(result).to.be.an("object").and.to.have.property("members").and.to.be.array();

                expect(result.members[0])
                    .to.have.property("powers")
                    .and.to.be.containingAllOf(["Radiation resistance", "Turning tiny", "Radiation blast"]);
                expect(result.members[1])
                    .to.have.property("powers")
                    .and.to.be.containingAllOf(["Million tonne punch", "Damage resistance", "Superhuman reflexes"]);
                expect(result.members[2])
                    .to.have.property("powers")
                    .and.to.be.containingAllOf([
                        "Immortality",
                        "Heat Immunity",
                        "Inferno",
                        "Teleportation",
                        "Interdimensional travel",
                    ]);
            });

            it("should not return the value of the index 1", () => {
                // Given
                const customSource = ["first", "second", "third"];
                const filters = ["1"];

                // When
                const result = filter(customSource, filters);

                // Then
                expect(result).to.be.array().and.to.be.equalTo(["first", "third"]);
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

        it("should return an empty array for an inclusion filter", () => {
            // Given
            const filters = ["message"];

            // When
            const includeFilters = extract(filters);

            // Then
            expect(includeFilters).to.be.empty;
        });

        it("should return an empty array for an inclusion filter with a symbol", () => {
            // Given
            const filters = ["+message"];

            // When
            const includeFilters = extract(filters);

            // Then
            expect(includeFilters).to.be.empty;
        });

        it("should return filters", () => {
            // Given
            const filters = ["-message"];

            // When
            const includeFilters = extract(filters);

            // Then
            expect(includeFilters).to.be.an("array");
            expect(includeFilters).to.be.containingAllOf(["message"]);
        });
    });
});
