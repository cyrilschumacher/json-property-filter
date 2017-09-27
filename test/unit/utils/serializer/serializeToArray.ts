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
import { serializeToArray } from "../../../../src/serializer/serializeToArray";

describe("serializeToArray", () => {
    it("should return simple array", () => {
        const source = { key: "value" };
        const expected = [];
        expected["key"] = "value";

        const actual = serializeToArray(source);

        assert.deepEqual(actual, expected);
    });

    it("should return array that contains property paths with their children", () => {
        const source = { key: "value", property: { key2: "value2" } };
        const expected = [];
        expected["key"] = "value";
        expected["property.key2"] = "value2";

        const actual = serializeToArray(source);

        assert.deepEqual(actual, expected);
    });

    it("should return array that contains property paths with a array as value", () => {
        const source = { array: [123, "value2"] };
        const expected = [];
        expected["array[0]"] = 123;
        expected["array[1]"] = "value2";

        const actual = serializeToArray(source);
        assert.deepEqual(actual, expected);
    });

    it("should return array that contains a property subset", () => {
        const source = { key: { key2: { key3: "value" } } };
        const expected = [];
        expected["key.key2.key3"] = "value";

        const actual = serializeToArray(source);
        assert.deepEqual(actual, expected);
    });

    it("should return array that contains a property subset in a array", () => {
        const source = [{ key: "value" }, { key: "value2" }];
        const expected = [];
        expected["[0].key"] = "value";
        expected["[1].key"] = "value2";

        const actual = serializeToArray(source);
        assert.deepEqual(actual, expected);
    });

    it("should return array that contains a property subset and array in a array", () => {
        const source = [
            { key: "value", key2: ["a", "b", "c"], key3: { key4: "value2" } },
            { key: "value3", key2: ["d", "e", "f"], key3: { key4: "value4" } },
        ];
        const expected = [];
        expected["[0].key"] = "value";
        expected["[0].key2[0]"] = "a";
        expected["[0].key2[1]"] = "b";
        expected["[0].key2[2]"] = "c";
        expected["[0].key3.key4"] = "value2";
        expected["[1].key"] = "value3";
        expected["[1].key2[0]"] = "d";
        expected["[1].key2[1]"] = "e";
        expected["[1].key2[2]"] = "f";
        expected["[1].key3.key4"] = "value4";
        
        const actual = serializeToArray(source);
        assert.deepEqual(actual, expected);
    });
});
