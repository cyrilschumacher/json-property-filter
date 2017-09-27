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

import { assert } from "chai";
import { extractFilters } from "../../../src/extractFilters";

describe("extractFilters", () => {
    it("should return no array items if no symbol patterns and no filters", () => {
        const filters = [];
        const symbolPatterns = [];
        const actual = extractFilters(filters, symbolPatterns);
        const expected = [];

        assert.deepEqual(actual, expected);
    });

    it("should return no array items if no symbol patterns", () => {
        const filters = ["+value1"];
        const symbolPatterns = [];
        const actual = extractFilters(filters, symbolPatterns);
        const expected = [];

        assert.deepEqual(actual, expected);
    });

    it("should return no array items if no filters", () => {
        const filters = [];
        const symbolPatterns = [/^(\+)/g];
        const actual = extractFilters(filters, symbolPatterns);
        const expected = [];

        assert.deepEqual(actual, expected);
    });

    it("should return a array with all items", () => {
        const filters = ["+value1", "+value2"];
        const symbolPatterns = [/^(\+)/g];
        const actual = extractFilters(filters, symbolPatterns);
        const expected = ["value1", "value2"];

        assert.deepEqual(actual, expected);
    });

    it("should return a array with single item", () => {
        const filters = ["value1", "+value2"];
        const symbolPatterns = [/^(\+)/g];
        const actual = extractFilters(filters, symbolPatterns);
        const expected = ["value2"];

        assert.deepEqual(actual, expected);
    });

    it("should return a array that contains the single item with defined symbol", () => {
        const filters = ["-value1", "+value2", "value3"];
        const symbolPatterns = [/^(\+)/g];
        const actual = extractFilters(filters, symbolPatterns);
        const expected = ["value2"];

        assert.deepEqual(actual, expected);
    });

    it("should return a array that contains the single item with defined symbol without removing redundant symbols", () => {
        const filters = ["+++value"];
        const symbolPatterns = [/^(\+)/g];
        const actual = extractFilters(filters, symbolPatterns);
        const expected = ["++value"];

        assert.deepEqual(actual, expected);
    });
});
