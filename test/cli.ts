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

/// <reference types="mocha"/>
/// <reference types="node"/>

import {assert} from "chai";
import * as child_process from "child_process";
import * as path from "path";

describe("cli", () => {
    let executable;
    before(() => {
        executable = path.join(__dirname, "..", "bin", "json-property-filter.js");
    });

    it("should print usage", done => {
        const process = child_process.spawn("node", [executable]);
        process.stdout.on("data", message => {
            const usage = message;
        });

        process.on("close", status => {
            assert.equal(status, 0);
            done();
        });
    });

    it("should print help", done => {
        const process = child_process.spawn("node", [executable, "--help"]);
        process.stdout.on("data", message => {
            const usage = message;
        });

        process.on("close", status => {
            assert.equal(status, 0);
            done();
        });
    });

    it("should print error for 'filters' argument", done => {
        const process = child_process.spawn("node", [executable, "custom", "-f"]);
        process.stdout.on("data", message => {
          const empty = message;
          assert.equal(empty, "");
        });

        process.on("close", status => {
            assert.notEqual(status, 0);
            done();
        });
    });

    it("should print error for 'file' argument", () => {
    });

    it("should print default JSON", () => {
    });

    it("should print filtered JSON", () => {
    });

    it("should print pretty JSON", () => {
    });

    it("should print pretty JSON with specific space", () => {
    });
});
