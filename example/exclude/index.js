/**
 * Example that excludes given JSON keys.
 */

const fs = require("fs");
const lib = require("../../lib/jsonPropertyFilter");

const buffer = fs.readFileSync("source.json");
const source = JSON.parse(buffer.toString());

const filter = new lib.JsonPropertyFilter(["-$schema", "-key2.key3", "-key2.key5.key6"]);
const filtered = filter.apply(source);

console.log(filtered); // { key1: 'value1', key2: { key4: 'value3' } }
