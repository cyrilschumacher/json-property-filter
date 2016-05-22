"use strict";
class JsonSerializer {
    static serializeToArray(jsonObject, keys, path) {
        keys = keys || [];
        path = path || "";
        if (jsonObject instanceof Array) {
            if (jsonObject.length) {
                for (const keyName in jsonObject) {
                    const keyValue = jsonObject[keyName];
                    const elementName = `${path}[${keyName}]`;
                    JsonSerializer.serializeToArray(keyValue, keys, elementName);
                }
            }
            else {
                keys[path.substring(1)] = jsonObject;
                keys.length++;
            }
        }
        else if (jsonObject instanceof Object) {
            for (const keyName in jsonObject) {
                const keyValue = jsonObject[keyName];
                const elementName = `${path}.${keyName}`;
                JsonSerializer.serializeToArray(keyValue, keys, elementName);
            }
        }
        else {
            keys[path.substring(1)] = jsonObject;
            keys.length++;
        }
        return keys;
    }
    static serializeToObject(arr) {
        let jsonObject = {};
        for (const key in arr) {
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
                    temporaryObject[formattedCurrentKey][arrayIndex] = temporaryObject[formattedCurrentKey][arrayIndex] || {};
                    temporaryObject = temporaryObject[formattedCurrentKey][arrayIndex];
                }
                else {
                    if (!(currentKey in jsonObject)) {
                        temporaryObject[currentKey] = temporaryObject[currentKey] || {};
                    }
                    if (pathIndex === (path.length - 1)) {
                        temporaryObject[currentKey] = value;
                    }
                    else {
                        temporaryObject[currentKey] = temporaryObject[currentKey] || {};
                        temporaryObject = temporaryObject[currentKey];
                    }
                }
            }
        }
        return jsonObject;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JsonSerializer;
