"use strict";
function convertArrayToJson(arr) {
    let jsonObject = {};
    for (const key in arr) {
        const value = arr[key];
        const path = key.split(".");
        let temporaryObject = jsonObject;
        for (let j = 0; j < path.length; j++) {
            const currentKey = path[j];
            const isArray = /\[([0-9]+)\]$/;
            if (isArray.test(currentKey)) {
                const index = currentKey.match(isArray)[1];
                const formattedCurrentKey = currentKey.replace(isArray, "");
                temporaryObject[formattedCurrentKey] = temporaryObject[formattedCurrentKey] || [];
                temporaryObject[formattedCurrentKey][index] = temporaryObject[formattedCurrentKey][index] || {};
                temporaryObject = temporaryObject[formattedCurrentKey][index];
            }
            else {
                if (!(currentKey in jsonObject)) {
                    temporaryObject[currentKey] = {};
                }
                if (j === (path.length - 1)) {
                    temporaryObject[currentKey] = value;
                }
                else {
                    temporaryObject = temporaryObject[currentKey];
                }
            }
        }
    }
    return jsonObject;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = convertArrayToJson;
