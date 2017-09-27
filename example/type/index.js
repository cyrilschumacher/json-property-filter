/**
 * Example that supports types: Date, String, Number and Array.
 */

const lib = require("../../lib/jsonPropertyFilter");

const source = {
    key1: "value",
    key2: new Date(),
    key3: ["a", "b", "c"],
    key4: 123,
    key5: function () {
        console.log("value")
    }
};

const filter = new lib.JsonPropertyFilter(["**"]);
const filtered = filter.apply(source);

console.log(filtered); // { key1: 'value', key2: 2017-09-27T16:15:25.674Z, key3: [ 'a', 'b', 'c' ], key4: 123, key5: [Function: key5] }
