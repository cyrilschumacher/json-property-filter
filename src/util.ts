import * as fs from "fs";

export interface Context {
    absolutePath: string;
    segments: string[];
    relativePath: string;
}

export const EMPTY_CONTEXT = { absolutePath: "", segments: [], relativePath: "" };

export function createContext(context: Context, source: object, propertyName: string) {
    const segments = context.segments ? context.segments.concat(propertyName) : [propertyName];
    const absolutePath = segments.join(".");
    const relativePath = createRelativePath(propertyName, source, context);

    return { absolutePath, relativePath, segments };
}

export function readFileAsync(file: string) {
    return new Promise<Buffer>((resolve, reject) =>
        fs.readFile(file, (error, data) => (error ? reject(error) : resolve(data))),
    );
}

export function readStdinAsync(encoding: BufferEncoding) {
    const chunks: Buffer[] = [];
    return new Promise<string>((resolve, reject) => {
        process.stdin.on("data", (chunk) => chunks.push(chunk));
        process.stdin.on("error", reject);
        process.stdin.on("end", () => {
            const data = Buffer.concat(chunks);
            const content = data.toString(encoding);
            resolve(content);
        });
    });
}

export function writeFileAsync(file: string, data: string) {
    return new Promise((resolve, reject) => fs.writeFile(file, data, (error) => (error ? reject(error) : resolve(void 0))));
}

function createRelativePath(propertyName: string, source: object, context: Context) {
    if (!Array.isArray(source)) {
        return context.relativePath ? `${context.relativePath}.${propertyName}` : propertyName;
    }

    return context.relativePath;
}
