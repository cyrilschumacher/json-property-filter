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

import * as fs from "fs";

import { JsonPropertyFilter } from "../jsonPropertyFilter";
import { assertReadFile } from "./assertion/readFile";
import { format } from "./format";
import { getPrettySpace } from "./getPrettySpace";
import { ICliOptions } from "./options";
import { out } from "./out";
import { readFile } from "./readFile";

/**
 * Handle sub-commands.
 *
 * @version 1.3.0
 * @param {string}      file    A file.
 * @param {ICliOptions} options CLI options.
 */
export function handle(file: string, options: ICliOptions) {
    const encoding = options.encoding || "utf8";
    fs.readFile(file, { encoding }, (error: NodeJS.ErrnoException, data: Buffer) => {
        assertReadFile(error, file);

        const jsonObject = readFile(data, options.encoding);
        const jsonPropertyFilter = new JsonPropertyFilter(options.filters);
        const filteredJsonObject = jsonPropertyFilter.apply(jsonObject);
        const space = getPrettySpace(options.prettySpace);
        const formattedJsonObject = format(filteredJsonObject, options.pretty, space);

        out(formattedJsonObject, options.out, options.encoding);
    });
}
