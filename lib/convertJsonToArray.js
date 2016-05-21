"use strict";
function convertJsonToArray(jsonObject, keys, path) {
    keys = keys || [];
    path = path || "";
    if (jsonObject instanceof Array) {
        for (const keyName in jsonObject) {
            const keyValue = jsonObject[keyName];
            const elementName = path + "[" + keyName + "]";
            convertJsonToArray(keyValue, keys, elementName);
        }
    }
    else if (jsonObject instanceof Object) {
        for (const keyName in jsonObject) {
            const keyValue = jsonObject[keyName];
            const elementName = path + "." + keyName;
            convertJsonToArray(keyValue, keys, elementName);
        }
    }
    else {
        keys[path.substring(1)] = jsonObject;
        keys.length++;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = convertJsonToArray;
