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

import { isArray } from "./object/isArray";

function _serialize(jsonObject: object, index: number, key: string, value: any, path: string[]): object|object[] {
    const currentKey = path[index];
    const arrayFormat = /\[([0-9]+)\]$/;

    if (arrayFormat.test(currentKey)) {
        return _serializeArray(jsonObject, index, currentKey, value, path, arrayFormat);
    } else {
        return _serializeObject(jsonObject, index, currentKey, value, path);
    }
}

function _serializeObject(jsonObject: object, index: number, key: string, value: any, path: string[]): object {
    if (typeof jsonObject === "object") {
        if (!(key in jsonObject)) {
            jsonObject[key] = jsonObject[key] || {};
        }

        const pathLength = path.length - 1;
        if (index === pathLength) {
            jsonObject[key] = value;
        } else {
            jsonObject[key] = jsonObject[key] || {};
            jsonObject = jsonObject[key];
        }
    }

    return jsonObject;
}

function _serializeArray(
    jsonObject: object, index: number, key, value: any, path: string[], arrayFormat: RegExp): object {
    const arrayIndex = key.match(arrayFormat)[1];
    const formattedCurrentKey = key.replace(arrayFormat, "");
    const indexNextItem = index + 1;

    if (formattedCurrentKey) {
        jsonObject[formattedCurrentKey] = jsonObject[formattedCurrentKey] || [];
        if (indexNextItem < path.length) {
            jsonObject[formattedCurrentKey][arrayIndex] = jsonObject[formattedCurrentKey][arrayIndex] || {};
            jsonObject = jsonObject[formattedCurrentKey][arrayIndex];
        } else {
            jsonObject[formattedCurrentKey][arrayIndex] = value;
        }
    } else {
        if (indexNextItem < path.length) {
            jsonObject[arrayIndex] = jsonObject[arrayIndex] || {};
            jsonObject = jsonObject[arrayIndex];
        } else {
            jsonObject[arrayIndex] = value;
        }
    }

    return jsonObject;
}

/**
 * Serializes to object.
 * @version 1.2.0
 * @param {string[]} arr A array.
 * @return {Object|Object[]} The object.
 */
export default function serializeToObject(arr: string[]): object|object[] {
    let jsonObject = {};
    if (isArray(arr)) {
        jsonObject = [];
    }

    for (const key in arr) {
        if (key) {
            const value = arr[key];
            const path = key.split(".");
            let currentJsonObject = jsonObject;

            for (let index = 0; index < path.length; index++) {
                currentJsonObject = _serialize(currentJsonObject, index, key, value, path);
            }
        }
    }

    return jsonObject;
}
