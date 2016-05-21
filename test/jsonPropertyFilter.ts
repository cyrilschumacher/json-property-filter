/// <reference path="../typings/tsd.d.ts"/>

import JsonPropertyFilter from "../src/jsonPropertyFilter";
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

    it("should return the all properties", () => {
        let filter = new JsonPropertyFilter("**");
        const filtered = filter.apply(source);

        assert.deepEqual(source, filtered);
    });

    it("should return the all root properties", () => {
        let filter = new JsonPropertyFilter("*");
        const filtered = filter.apply(source);
        const expected = { id: 1, type: "articles" };

        assert.deepEqual(filtered, expected);
    });

    it("should return 'id' property", () => {
        let filter = new JsonPropertyFilter("id");
        const filtered = filter.apply(source);
        const expected = { id: 1 };

        assert.deepEqual(filtered, expected);
    });

    it("should return 'id' and 'type' properties", () => {
        let filter = new JsonPropertyFilter("id", "type");
        const filtered = filter.apply(source);
        const expected = { id: 1, type: "articles" };

        assert.deepEqual(filtered, expected);
    });

    it("should return the all properties expected 'created' and 'updated' properties of 'attributes' object", () => {
        let filter = new JsonPropertyFilter("attributes", "attributes.body", "attributes.title");
        const filtered = filter.apply(source);
        const expected = { attributes: { body: "The shortest article. Ever.", title: "JSON API paints my bikeshed!" } };

        assert.deepEqual(filtered, expected);
    });

    it("should return the root properties and 'attributes.title' property of 'attributes' object", () => {
        let filter = new JsonPropertyFilter("*", "attributes.title");
        const filtered = filter.apply(source);
        const expected = { id: 1, type: "articles", attributes: { title: "JSON API paints my bikeshed!" } };

        assert.deepEqual(filtered, expected);
    });

    it("should return the 'id' property of 'author' of 'relationships' property.", () => {
        let filter = new JsonPropertyFilter("relationships.author.id");
        const filtered = filter.apply(source);
        const expected = { relationships: { author: { id: 42 } } };

        assert.deepEqual(expected, filtered);
    });
});
