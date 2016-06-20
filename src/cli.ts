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

import * as program from "commander";
import * as fs from "fs";
import {JsonPropertyFilter} from "./jsonPropertyFilter";

program
    .version('1.0.0')
    .description('Filter a JSON file by including or excluding properties.')
    .usage('<file>')
    .option('-f, --filters <filters>', 'Add include and exclude filters.')
    .option('-o, --out <file>', 'Specifies the output file.')
    .option('-p, --pretty', 'Display results in an easy-to-read format.')
    .action(_apply)
    .parse(process.argv);

if (!program.args.length) {
    program.help();
}

function _apply(file, options) {
    fs.readFile(file, (error, data) => {
        _assertReadFile(file, error);

        const jsonObject = _transformToJsonObject(data);
        const jsonPropertyFilter = new JsonPropertyFilter(options.filters);
        const filteredJsonObject = _filterJsonObject(jsonPropertyFilter, jsonObject);
        const formattedJsonObject = _format(filteredJsonObject, options.pretty);
        _out(formattedJsonObject, options.out);
    });
}

function _assertReadFile(file, error) {
    if (error) {
        throw new Error(`An error occurred while the reading of file: ${file}`);
    }
}

function _assertWriteFile(error) {
    if (error) {
        throw new Error("An error occurred while saving of filtered JSON object.");
    }
}

function _filterJsonObject(jsonPropertyFilter, jsonObject) {
    return jsonPropertyFilter.apply(jsonObject);
}

function _format(filteredJsonObject, pretty) {
    if (pretty) {
        return JSON.stringify(filteredJsonObject, null, 2);
    } else {
        return JSON.stringify(filteredJsonObject);
    }
}

function _out(jsonObject, outputFile) {
    if (outputFile) {
        _writeResult(outputFile, jsonObject);
    } else {
        console.log(jsonObject);
    }
}

function _transformToJsonObject(data) {
    const fileContent = data.toString();

    try {
        return JSON.parse(fileContent);
    } catch (e) {
        throw new Error("An error occurred while processing of file content in a JSON object.")
    }
}

function _writeOutputFile(error) {
    _assertWriteFile(error);
}

function _writeResult(outputFile, data) {
    fs.writeFile(outputFile, data, _writeOutputFile);
}
