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

/**
 * JSON Serializer.
 * @class
 */
export default class JsonSerializer {
    /**
     * Serializes to array.
     * @static
     * @param {Object} jsonObject A JSON object.
     * @param {string[]} keys Keys.
     * @param {string} path A path.
     * @return {string[]} The array.
     */
    public static serializeToArray(jsonObject: Object, keys?: Array<string>, path?: string): Array<string> {
        keys = keys || [];
        path = path || "";

        if (jsonObject instanceof Array) {
            if (jsonObject.length) {
                for (const keyName in jsonObject) {
                    if (keyName) {
                        const keyValue = jsonObject[keyName];
                        const elementName = `${path}[${keyName}]`;

                        JsonSerializer.serializeToArray(keyValue, keys, elementName);
                    }
                }
            } else {
                keys[path] = jsonObject;
            }
        } else if (jsonObject instanceof Object) {
            for (const keyName in jsonObject) {
                if (keyName) {
                    const keyValue = jsonObject[keyName];
                    let elementName = `${keyName}`;
                    if (path && typeof path === "string") {
                        elementName = `${path}.${keyName}`;
                    }

                    JsonSerializer.serializeToArray(keyValue, keys, elementName);
                }
            }
        } else {
            keys[path] = jsonObject;
        }

        return keys;
    }

    /**
     * Serializes to object.
     * @static
     * @param {string[]} arr A array.
     * @return {Object} The object.
     */
    public static serializeToObject(arr: Array<string>): Object {
        let jsonObject = {};

        for (const key in arr) {
            if (key) {
                const value = arr[key];
                const path = key.split(".");
                let temporaryObject = jsonObject;

                for (let pathIndex = 0; pathIndex < path.length; pathIndex++) {
                    const currentKey = path[pathIndex];
                    const isArray = /\[([0-9]+)\]$/;

                    if (isArray.test(currentKey)) {
                        const arrayIndex = currentKey.match(isArray)[1];
                        const formattedCurrentKey = currentKey.replace(isArray, "");

                        temporaryObject[formattedCurrentKey] = temporaryObject[formattedCurrentKey] || [];
                        if (pathIndex + 1 < path.length) {
                            temporaryObject[formattedCurrentKey][arrayIndex] = temporaryObject[formattedCurrentKey][arrayIndex] || {};
                            temporaryObject = temporaryObject[formattedCurrentKey][arrayIndex];
                        } else {
                            temporaryObject[formattedCurrentKey][arrayIndex] = value;
                        }

                    } else {
                        if (!(currentKey in jsonObject)) {
                            temporaryObject[currentKey] = temporaryObject[currentKey] || {};
                        }

                        if (pathIndex === (path.length - 1)) {
                            temporaryObject[currentKey] = value;
                        } else {
                            temporaryObject[currentKey] = temporaryObject[currentKey] || {};
                            temporaryObject = temporaryObject[currentKey];
                        }
                    }
                }
            }
        }

        return jsonObject;
    }
}
