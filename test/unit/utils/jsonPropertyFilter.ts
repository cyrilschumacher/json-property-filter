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

/// <reference types="mocha" />

import { assert } from "chai";
import { JsonPropertyFilter } from "../../../src/jsonPropertyFilter";

describe("JsonPropertyFilter", () => {
    it("should return filters, initialized from the constructor with a array", () => {
        const filter = new JsonPropertyFilter(["root.key1", "-root.key2", "-root.key3"]);

        assert.deepEqual(filter.includeFilters, ["root.key1"]);
        assert.deepEqual(filter.excludeFilters, ["root.key2", "root.key3"]);
    });

    it("should return filters, initialized from the constructor with a string", () => {
        const filter = new JsonPropertyFilter("root.key1,-root.key2,-root.key3");

        assert.deepEqual(filter.includeFilters, ["root.key1"]);
        assert.deepEqual(filter.excludeFilters, ["root.key2", "root.key3"]);
    });

    it("should return filters, initialized from the constructor with a string, a separator and a exclude pattern", () => {
        const filter = new JsonPropertyFilter(["root.key1", "!root.key2", "!root.key3"], undefined, [/^(!)/g], []);

        assert.deepEqual(filter.includeFilters, []);
        assert.deepEqual(filter.excludeFilters, ["root.key2", "root.key3"]);
    });

    it("should return filters, initialized from the constructor with a string, a separator and a include pattern", () => {
        const filter = new JsonPropertyFilter(["+root.key1", "root.key2", "root.key3"], undefined, [], [/^(\+)/g]);

        assert.deepEqual(filter.includeFilters, ["root.key1"]);
        assert.deepEqual(filter.excludeFilters, []);
    });

    it("should return filters, initialized from the constructor with a string and a separator", () => {
        const filter = new JsonPropertyFilter("root.key1;-root.key2;-root.key3", ";");

        assert.deepEqual(filter.includeFilters, ["root.key1"]);
        assert.deepEqual(filter.excludeFilters, ["root.key2", "root.key3"]);
    });

    it("should return include filters only", () => {
        const filter = new JsonPropertyFilter();

        filter.setIncludeFilters(["root.key1", "-root.key2", "-root.key3"]);
        assert.deepEqual(filter.includeFilters, ["root.key1"]);
    });

    it("should return exclude filters only", () => {
        const filter = new JsonPropertyFilter();

        filter.setExcludeFilters(["root.key1", "-root.key2", "-root.key3"]);
        assert.deepEqual(filter.excludeFilters, ["root.key2", "root.key3"]);
    });

    it("should return default include filters", () => {
        const filter = new JsonPropertyFilter();
        assert.deepEqual(filter.includeFilters, []);
    });

    it("should return default exclude filters", () => {
        const filter = new JsonPropertyFilter();
        assert.deepEqual(filter.excludeFilters, []);
    });
});
