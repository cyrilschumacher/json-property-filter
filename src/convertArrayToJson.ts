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
 * Converts the {@link Array} to the JSON object.
 * @param 	{[]} 		element 	The array.
 * @return 	{object} 				The JSON object.
 */
export default function convertArrayToJson(arr: Array<string>): Object {
    let jsonObject = {};
    for (const key in arr) {
        const value = arr[key];
        const path = key.split(".");
        let temporaryObject = jsonObject;

        for (let j = 0; j < path.length; j++) {
            const currentKey = path[j];

            if (!(currentKey in jsonObject)) {
                temporaryObject[currentKey] = {};
            }
            if (j === (path.length - 1)) {
                temporaryObject[currentKey] = value;
            } else {
                temporaryObject = temporaryObject[currentKey];
            }
        }
    }

    return jsonObject;
}
