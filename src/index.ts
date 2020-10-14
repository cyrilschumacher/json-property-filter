import * as exclusion from "./exclusion";
import * as inclusion from "./inclusion";

/**
 * Apply filters on a given source.
 *
 * The function will first extract the inclusive and exclusive filters. The inclusive filters will be applied first,
 * then the exclusive filters.
 *
 * @param source    source to filter.
 * @param filters   filters to apply.
 * @return filtered source.
 */
export function apply(source: object, filters: string[]) {
    const inclusionFilters = inclusion.extract(filters);
    const exclusionFilters = exclusion.extract(filters);

    const result = inclusionFilters.length ? inclusion.filter(source, inclusionFilters) : source;
    return exclusionFilters.length ? exclusion.filter(result, exclusionFilters) : result;
}
