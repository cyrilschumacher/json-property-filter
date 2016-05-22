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
        name: "master",
        protection: {
            enabled: false,
            required_status_checks: {
                enforcement_level: "off",
                contexts: []
            }
        },
        commit: {
            sha: "7fd1a60b01f91b314f59955a4e4d4e80d8edf11d",
            commit: {
                author: {
                    name: "The Octocat",
                    date: "2012-03-06T15:06:50-08:00",
                    email: "octocat@nowhere.com"
                },
                url: "https://api.github.com/repos/octocat/Hello-World/git/commits/7fd1a60b01f91b314f59955a4e4d4e80d8edf11d",
                message: "Merge pull request #6 from Spaceghost/patch-1\n\nNew line at end of file.",
                tree: {
                    sha: "b4eecafa9be2f2006ce1b709d6857b07069b4608",
                    url: "https://api.github.com/repos/octocat/Hello-World/git/trees/b4eecafa9be2f2006ce1b709d6857b07069b4608"
                },
                committer: {
                    name: "The Octocat",
                    date: "2012-03-06T15:06:50-08:00",
                    email: "octocat@nowhere.com"
                }
            },
            author: {
                gravatar_id: "",
                avatar_url: "https://secure.gravatar.com/avatar/7ad39074b0584bc555d0417ae3e7d974?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-140.png",
                url: "https://api.github.com/users/octocat",
                id: 583231,
                login: "octocat"
            },
            parents: [
                {
                    sha: "553c2077f0edc3d5dc5d17262f6aa498e69d6f8e",
                    url: "https://api.github.com/repos/octocat/Hello-World/commits/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e"
                },
                {
                    sha: "762941318ee16e59dabbacb1b4049eec22f0d303",
                    url: "https://api.github.com/repos/octocat/Hello-World/commits/762941318ee16e59dabbacb1b4049eec22f0d303"
                }
            ],
            url: "https://api.github.com/repos/octocat/Hello-World/commits/7fd1a60b01f91b314f59955a4e4d4e80d8edf11d",
            committer: {
                gravatar_id: "",
                avatar_url: "https://secure.gravatar.com/avatar/7ad39074b0584bc555d0417ae3e7d974?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-140.png",
                url: "https://api.github.com/users/octocat",
                id: 583231,
                login: "octocat"
            }
        },
        _links: {
            html: "https://github.com/octocat/Hello-World/tree/master",
            self: "https://api.github.com/repos/octocat/Hello-World/branches/master"
        }
    };

    it("should return the empty object with a empty array", () => {
        const properties = [];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = {};

        assert.deepEqual(filtered, expected);
    });

    it("should return the empty object with a array contains empty string", () => {
        const properties = [];
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
        const expected = { name: "master" };

        assert.property(filtered, "name");
    });

    it("should return the 'name' property", () => {
        const properties = ["name"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = { name: 1 };

        assert.property(filtered, "name");
    });

    it("should return the 'name' property and 'enabled' property of 'protection' object", () => {
        const properties = ["name", "protection.enabled"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);

        assert.property(filtered, "name");
        assert.deepProperty(filtered, "protection.enabled");
    });

    it("should return the 'enabled' property of 'protection' object to using the include symbol", () => {
        const properties = ["+protection.enabled"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);

        assert.deepProperty(filtered, "protection.enabled");
    });

    it("should return the all properties expected 'gravatar_id', 'avatar_url' and 'login' properties of 'author' object", () => {
        const properties = ["commit", "commit.author.url", "commit.author.id"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);

        assert.deepProperty(filtered, "commit.author.url");
        assert.deepProperty(filtered, "commit.author.id");
    });

    it("should return the root properties and 'sha' property of 'commit' object", () => {
        const properties = ["*", "commit.sha"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);

        assert.property(filtered, "name");
        assert.deepProperty(filtered, "commit.sha");
    });

    it("should return the 'id' property of 'author' object of 'commit' object", () => {
        const properties = ["commit.author.id"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);

        assert.deepProperty(filtered, "commit.author.id");
    });

    it("should return the 'id' property of 'content' array", () => {
        const properties = ["commit.parents.*"];
        const filter = new JsonPropertyFilter(properties);
        const filtered = filter.apply(source);
        const expected = { commit: { parents: [{ sha: "553c2077f0edc3d5dc5d17262f6aa498e69d6f8e", url: "https://api.github.com/repos/octocat/Hello-World/commits/553c2077f0edc3d5dc5d17262f6aa498e69d6f8e" }, { sha: "762941318ee16e59dabbacb1b4049eec22f0d303", url: "https://api.github.com/repos/octocat/Hello-World/commits/762941318ee16e59dabbacb1b4049eec22f0d303" }] } }

        assert.deepEqual(filtered, expected);
    });
});
