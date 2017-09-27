/**
 * sExample that includes all JSON keys.
 */

const fs = require("fs");
const lib = require("../../lib/jsonPropertyFilter");

const buffer = fs.readFileSync("source.json");
const source = JSON.parse(buffer.toString());

const filter = new lib.JsonPropertyFilter(["**"]);
const filtered = filter.apply(source);

console.log(filtered); // { key1: 'value1', key2: { key3: 'value2', key4: 'value3', key5: { key6: 'value4' } } }
