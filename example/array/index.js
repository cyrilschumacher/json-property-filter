/**
 * Example with array type.
 */

const fs = require("fs");
const lib = require("../../lib/jsonPropertyFilter");

const buffer = fs.readFileSync("source.json");
const source = JSON.parse(buffer.toString());

const filter = new lib.JsonPropertyFilter(["description", "-_private"]);
const filtered = filter.apply(source);

console.log(filtered); // [ { description: 'First item' }, { description: 'Second item' } ]
