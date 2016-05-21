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

import {JsonPropertyFilter} from "../src/jsonPropertyFilter";
import {assert} from "chai";

describe("JsonPropertyFilter", () => {
    const source = {
        id: 1,
        type: "articles",
        attributes: {
            title: "JSON API paints my bikeshed!",
            body: "The shortest article. Ever.",
            created: "2015-05-22T14:56:29.000Z",
            updated: "2015-05-22T14:56:28.000Z",
        },
        relationships: {
            author: {
                id: 42,
                type: "people"
            }
        }
    };

    const extendSource = {
        current: 1,
        totalPage: 1,
        content: [
            {
                id: 1,
                attributes: {
                    title: "JSON API paints my bikeshed!",
                    body: "The shortest article. Ever.",
                    created: "2015-05-22T14:56:29.000Z",
                    updated: "2015-05-22T14:56:28.000Z",
                }
            },
            {
                id: 2,
                attributes: {
                    title: "JSON API paints my bikeshed!",
                    body: "The shortest article. Ever.",
                    created: "2015-05-22T14:56:29.000Z",
                    updated: "2015-05-22T14:56:28.000Z",
                }
            }
        ]
    };

    it("should return empty object", () => {
        const properties = [""];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = {};

        assert.deepEqual(filtered, expected);
    });

    it("should return the all properties", () => {
        const properties = ["**"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);

        assert.deepEqual(source, filtered);
    });

    it("should return the all root properties", () => {
        const properties = ["*"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = { id: 1, type: "articles" };

        assert.deepEqual(filtered, expected);
    });

    it("should return 'id' property", () => {
        const properties = ["id"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = { id: 1 };

        assert.deepEqual(filtered, expected);
    });

    it("should return 'id' and 'type' properties", () => {
        const properties = ["id", "type"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = { id: 1, type: "articles" };

        assert.deepEqual(filtered, expected);
    });

    it("should return the all properties expected 'created' and 'updated' properties of 'attributes' object", () => {
        const properties = ["attributes", "attributes.body", "attributes.title"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = { attributes: { body: "The shortest article. Ever.", title: "JSON API paints my bikeshed!" } };

        assert.deepEqual(filtered, expected);
    });

    it("should return the root properties and 'attributes.title' property of 'attributes' object", () => {
        const properties = ["*", "attributes.title"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = { id: 1, type: "articles", attributes: { title: "JSON API paints my bikeshed!" } };

        assert.deepEqual(filtered, expected);
    });

    it("should return the 'id' property of 'author' of 'relationships' property", () => {
        const properties = ["relationships.author.id"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = { relationships: { author: { id: 42 } } };

        assert.deepEqual(expected, filtered);
    });

    it("sould return the 'id' property of 'content' array", () => {
        const properties = ["content.*"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(extendSource);
        const expected = { content: [{ id: 1 }, { id: 2 }] };

        assert.deepEqual(filtered, expected);
    });

    it("sould return the 'attributes' property of 'content' array", () => {
        const properties = ["content.attributes"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(extendSource);
        const expected = {};

        assert.deepEqual(filtered, expected);
    });

    it("sould return the 'title' property of 'attributes' property of 'content' array", () => {
        const properties = ["content.attributes.title"];
        let filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(extendSource);
        const expected = { content: [{ attributes: { title: "JSON API paints my bikeshed!" } }, { attributes: { title: "JSON API paints my bikeshed!" } }] };

        assert.deepEqual(filtered, expected);
    });
});
