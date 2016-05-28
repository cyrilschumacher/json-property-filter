/* The MIT License (MIT)
 *
 * Copyright (c) 2016 Cyril Schumacher.fr
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

/// <reference path="../typings/index.d.ts"/>

import JsonSerializer from "../src/jsonSerializer";
import {assert} from "chai";

describe("JsonSerializer", () => {
    describe("serializeToArray", () => {
        it("should return simple array", () => {
            const source = { "key": "value" };
            let expected = [];
            expected["key"] = "value";
            const actual = JsonSerializer.serializeToArray(source);

            assert.deepEqual(actual, expected);
        });

        it("should return array that contains property paths with their children", () => {
            const source = { "key": "value", "property": { "key2": "value2" } };
            let expected = [];
            expected["key"] = "value";
            expected["property.key2"] = "value2";
            const actual = JsonSerializer.serializeToArray(source);

            assert.deepEqual(actual, expected);
        });

        it("should return array that contains property paths with a array as value", () => {
            const source = { "array": [123, "value2"] };
            let expected = [];
            expected["array[0]"] = 123;
            expected["array[1]"] = "value2";
            const actual = JsonSerializer.serializeToArray(source);

            assert.deepEqual(actual, expected);
        });

        it("should return array that contains a property subset", () => {
            const source = { "key": { "key2": { "key3": "value" } } };
            let expected = [];
            expected["key.key2.key3"] = "value";
            const actual = JsonSerializer.serializeToArray(source);

            assert.deepEqual(actual, expected);
        });
    });

    describe("serializeToObject", () => {
        it("should return simple object", () => {
            let source = [];
            source["key"] = "value";
            const expected = { "key": "value" };
            const actual = JsonSerializer.serializeToObject(source);

            assert.deepEqual(actual, expected);
        });

        it("should return object that contains property paths with their children", () => {
            let source = [];
            source["key"] = "value";
            source["property.key2"] = "value2";
            const expected = { "key": "value", "property": { "key2": "value2" } };
            const actual = JsonSerializer.serializeToObject(source);

            assert.deepEqual(actual, expected);
        });

        it("should return object that contains property paths with a array as value", () => {
            let source = [];
            source["array[0]"] = 123;
            source["array[1]"] = "value2";
            const expected = { "array": [123, "value2"] };
            const actual = JsonSerializer.serializeToObject(source);

            assert.deepEqual(actual, expected);
        });

        it("should return object that contains property paths with a array as value", () => {
            let source = [];
            source["array[0].key1"] = "value1";
            source["array[1].key2"] = "value2";
            const expected = { "array": [{ "key1": "value1" }, { "key2": "value2" }] };
            const actual = JsonSerializer.serializeToObject(source);

            assert.deepEqual(actual, expected);
        });

        it("should return object that contains a property subset", () => {
            let source = [];
            source["key.key2.key3"] = "value";
            const expected = { "key": { "key2": { "key3": "value" } } };
            const actual = JsonSerializer.serializeToObject(source);

            assert.deepEqual(actual, expected);
        });
    });
});
