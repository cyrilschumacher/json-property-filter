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

import * as program from "commander";
import * as fs from "fs";

import { assertReadFile } from "./cli/assertion/readFile";
import { format } from "./cli/format";
import { getPrettySpace } from "./cli/getPrettySpace";
import { out } from "./cli/out";
import { readFile } from "./cli/readFile";
import { JsonPropertyFilter } from "./jsonPropertyFilter";

import pkginfo = require("pkginfo");

pkginfo(module, "version");

program
    .version(module.exports.version)
    .description("Filter a JSON file by including or excluding properties.")
    .usage("<file>")
    .option("-f, --filters <filters>", "Add include and exclude filters.")
    .option("-o, --out <file>", "Specifies the output file.")
    .option("-p, --pretty", "Display results in an easy-to-read format.")
    .option("--pretty-space <number>", "Specifies the space.")
    .option("--encoding", "Specifies encodage. Default: utf8.")
    .action(_apply)
    .parse(process.argv);

if (!program.args.length) {
    program.help();
}

function _apply(file, options) {
    const encoding = options.encoding || "utf8";
    fs.readFile(file, { encoding }, (error, data) => {
        assertReadFile(error, file);

        const jsonObject = readFile(data);
        const jsonPropertyFilter = new JsonPropertyFilter(options.filters);
        const filteredJsonObject = jsonPropertyFilter.apply(jsonObject);
        const space = getPrettySpace(options.prettySpace);
        const formattedJsonObject = format(filteredJsonObject, options.pretty, space);
        out(formattedJsonObject, options.out);
    });
}
