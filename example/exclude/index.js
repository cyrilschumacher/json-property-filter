/**
 * Example that excludes given JSON keys.
 */

const fs = require("fs");
const lib = require("../../lib/jsonPropertyFilter");

const buffer = fs.readFileSync("source.json");
const source = JSON.parse(buffer.toString());

const filter = new lib.JsonPropertyFilter(["-**", "+key1", "+key2.key4"]);
const filtered = filter.apply(source);

console.log(filtered); // { key1: 'value1', key2: { key4: 'value3' } }
