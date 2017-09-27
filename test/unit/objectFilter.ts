/* The MIT License (MIT)
 *
 * Copyright (c) 2017 Cyril Schumacher.fr
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { assert } from "chai";
import { JsonPropertyFilter } from "../../src/jsonPropertyFilter";

describe("JsonPropertyFilter#Object", () => {
    const source = {
        address: {
            city: "New York",
            postalCode: "10021",
            state: "NY",
            streetAddress: "21 2nd Street",
        },
        age: 25,
        firstName: "John",
        gender: {
            type: "male",
        },
        lastName: "Smith",
        phoneNumber: [
            {
                number: "212 555-1234",
                type: "home",
            },
            {
                number: "646 555-4567",
                type: "fax",
            },
        ],
    };

    it("should return the original object with a empty array", () => {
        const filter = new JsonPropertyFilter();
        filter.setIncludeFilters(["*"]);
        const filtered = filter.apply(source);
        const expected = {
            age: 25,
            firstName: "John",
            lastName: "Smith",
        };

        assert.deepEqual(filtered, expected);
    });

    it("should return the original object with a empty array", () => {
        const properties = [];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);

        assert.deepEqual(filtered, source);
    });

    it("should return all properties of object", () => {
        const properties = ["**"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);

        assert.deepEqual(filtered, source);
    });

    it("should return the root properties of object", () => {
        const properties = ["*"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = {
            age: 25,
            firstName: "John",
            lastName: "Smith",
        };

        assert.deepEqual(filtered, expected);
    });

    it("should return all properties of 'address' property", () => {
        const properties = ["address.**"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = {
            address: {
                city: "New York",
                postalCode: "10021",
                state: "NY",
                streetAddress: "21 2nd Street",
            },
        };

        assert.deepEqual(filtered, expected);
    });

    it("should return specific properties", () => {
        const properties = ["firstName", "lastName", "phoneNumber.number"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = {
            firstName: "John",
            lastName: "Smith",
            phoneNumber: [
                {
                    number: "212 555-1234",
                },
                {
                    number: "646 555-4567",
                },
            ],
        };

        assert.deepEqual(filtered, expected);
    });

    it("should return all properties without the properties: 'firstName' and 'lastName'", () => {
        const properties = ["**", "-firstName", "-lastName"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = {
            address: {
                city: "New York",
                postalCode: "10021",
                state: "NY",
                streetAddress: "21 2nd Street",
            },
            age: 25,
            gender: {
                type: "male",
            },
            phoneNumber: [
                {
                    number: "212 555-1234",
                    type: "home",
                },
                {
                    number: "646 555-4567",
                    type: "fax",
                },
            ],
        };

        assert.deepEqual(filtered, expected);
    });

    it("should return the 'phoneNumber' property without the 'number' subproperty", () => {
        const properties = ["phoneNumber", "-phoneNumber.number"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = {
            phoneNumber: [
                {
                    type: "home",
                },
                {
                    type: "fax",
                },
            ],
        };

        assert.deepEqual(filtered, expected);
    });

    it("should return all properties without the properties: 'age', 'phoneNumber' and 'gender'", () => {
        const properties = ["-age", "-phoneNumber", "-gender"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = {
            address: {
                city: "New York",
                postalCode: "10021",
                state: "NY",
                streetAddress: "21 2nd Street",
            },
            firstName: "John",
            lastName: "Smith",
        };

        assert.deepEqual(filtered, expected);
    });

    it("should return all properties without the 'address' property", () => {
        const properties = ["-address.*"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = {
            age: 25,
            firstName: "John",
            gender: {
                type: "male",
            },
            lastName: "Smith",
            phoneNumber: [
                {
                    number: "212 555-1234",
                    type: "home",
                },
                {
                    number: "646 555-4567",
                    type: "fax",
                },
            ],
        };

        assert.deepEqual(filtered, expected);
    });
});
