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

function createRelativePath(propertyName: string, source: object, context: Context) {
    if (!Array.isArray(source)) {
        return context.relativePath ? `${context.relativePath}.${propertyName}` : propertyName;
    }

    return context.relativePath;
}
