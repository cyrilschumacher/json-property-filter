import * as commander from "commander";

import { apply } from ".";
import { readFile, writeFileAsync } from "./util";

import debug from "debug";

const log = debug("json-property-filter:cli");

interface Options {
    encoding: BufferEncoding;
    filters: string[];
    out?: string;
    pretty: boolean;
    prettySpace: string;
}

async function handle(file: string, options: Options) {
    log("Read file: %s", file);
    const buffer = await readFile(file);
    const content = buffer.toString(options.encoding);
    const jsonContent = JSON.parse(content);

    log("Apply filters: %o", options.filters);
    const result = apply(jsonContent, options.filters);
    const data = options.pretty ? JSON.stringify(result, void 0, +options.prettySpace) : JSON.stringify(result);
    if (options.out) {
        log("Write file: %s", file);
        await writeFileAsync(options.out, data);
    } else {
        process.stdout.write(data);
    }
}

commander
    .version("2.0.0")
    .description("Filter a JSON object by including and excluding properties.")
    .requiredOption("--in <file>", "File to filter.")
    .requiredOption("-f, --filters <filters...>", "Add include and exclude filters.")
    .option("--out <file>", "Specifies the output file.")
    .option("-p, --pretty", "Display results in an easy-to-read format.", false)
    .option("--pretty-space <number>", "Specifies the space.", "4")
    .option("--encoding", "Specifies encodage.", "utf8")
    .option("--debug", "Enable debug mode.", false)
    .parse(process.argv);

if (commander.debug) {
    debug.enable("json-property-filter:*");
}

handle(commander.in, {
    encoding: commander.encoding,
    filters: commander.filters,
    out: commander.out,
    pretty: commander.pretty,
    prettySpace: commander.prettySpace,
});
