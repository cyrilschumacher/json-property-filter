import * as commander from "commander";

import { apply } from ".";
import { readFileAsync, readStdinAsync, writeFileAsync } from "./util";

import debug from "debug";

interface Options {
    debug: boolean;
    encoding: BufferEncoding;
    filters: string[];
    in?: string;
    out?: string;
    pretty: boolean;
    prettySpace: string;
}

async function readInputAsync(command: commander.Command) {
    if (process.stdin.isTTY) {
        const options = command.opts() as Options;
        const encoding = options.encoding;
        const filePath = options.in;

        const buffer = await readFileAsync(filePath!);
        return buffer.toString(encoding);
    } else {
        return await readStdinAsync("utf-8");
    }
}

async function handle(command: commander.Command) {
    const options = command.opts() as Options;
    if (options.debug) {
        debug.enable("json-property-filter:*");
    }

    const content = await readInputAsync(command);
    const jsonContent = JSON.parse(content);

    const log = debug("json-property-filter:cli");
    log("Apply filters: %o", options.filters);
    const result = apply(jsonContent, options.filters);
    const data = options.pretty ? JSON.stringify(result, void 0, +options.prettySpace) : JSON.stringify(result);

    if (options.out) {
        log("Write file: %s", options.out);
        await writeFileAsync(options.out, data);
    } else {
        process.stdout.write(data);
    }
}

const program = new commander.Command();
if (process.stdin.isTTY) {
    program.requiredOption("--in <file>", "File to filter.");
}

program
    .version("2.0.0")
    .description("Filter a JSON object by including and excluding properties.")
    .requiredOption("-f, --filters <filters...>", "Add include and exclude filters.")
    .option("--out <file>", "Specifies the output file.")
    .option("-p, --pretty", "Display results in an easy-to-read format.", false)
    .option("--pretty-space <number>", "Specifies the space.", "4")
    .option("--encoding", "Specifies encodage.", "utf8")
    .option("--debug", "Enable debug mode.", false)
    .parse(process.argv);

handle(program);
