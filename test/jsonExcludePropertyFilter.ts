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

import JsonExcludePropertyFilter from "../src/jsonExcludePropertyFilter";
import {assert} from "chai";

describe("JsonExcludePropertyFilter", () => {
    it("should return all properties excepted the 'key1' property", () => {
        let source = [];
        source["key1"] = "value1";
        source["key2"] = "value2";
        let expected = [];
        expected["key2"] = "value2";

        const filter = new JsonExcludePropertyFilter(["key1"]);
        const filtered = filter.apply(source);

        assert.deepEqual(filtered, expected);
    });

    it("should return the root properties of 'key2' property only", () => {
        let source = [];
        source["key1.key2"] = "value2";
        source["key1.key3.key4"] = "value3";
        source["key1.key3.key5"] = "value4";
        let expected = [];
        expected["key1.key2"] = "value2";

        const filter = new JsonExcludePropertyFilter(["key1.key3.*"]);
        const filtered = filter.apply(source);

        assert.deepEqual(filtered, expected);
    });

    it("should return array that contains 'key2' property only", () => {
        let source = [];
        source["key1[0].key2"] = "value2";
        source["key1[0].key3"] = "value3";
        source["key1[1].key2"] = "value2";
        source["key1[1].key3"] = "value3";
        let expected = [];
        expected["key1[0].key2"] = "value2";
        expected["key1[1].key2"] = "value2";

        const filter = new JsonExcludePropertyFilter(["key1.key3"]);
        const filtered = filter.apply(source);

        assert.deepEqual(filtered, expected);
    });

    it("should return all properties of 'key3' property only", () => {
        let source = [];
        source["key1"] = "value1";
        source["key2"] = "value2";
        source["key3.key4"] = "value3";
        let expected = [];
        expected["key3.key4"] = "value3";

        const filter = new JsonExcludePropertyFilter(["*"]);
        const filtered = filter.apply(source);

        assert.deepEqual(filtered, expected);
    });

    it("should return empty array", () => {
        let source = [];
        source["key1"] = "value";
        source["key2.key3.key4"] = "value3";
        source["key2.key3.key4"] = "value4";
        let expected = [];

        const filter = new JsonExcludePropertyFilter(["**"]);
        const filtered = filter.apply(source);

        assert.deepEqual(filtered, expected);
    });

    it("should return original array", () => {
        let source = [];
        source["key1"] = "value1";
        source["key2"] = "value2";
        source["key3.key4"] = "value3";
        let expected = [];
        expected["key1"] = "value1";
        expected["key2"] = "value2";
        expected["key3.key4"] = "value3";

        const filter = new JsonExcludePropertyFilter([]);
        const filtered = filter.apply(source);

        assert.deepEqual(filtered, expected);
    });
});
