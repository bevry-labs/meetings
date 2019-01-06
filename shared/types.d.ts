// JSX
export type Children = Array<string | JSX.Element>

// https://stackoverflow.com/a/52678379/130638
// https://github.com/andnp/SimplyTyped/issues/76#issue-396291343
type UnionKeys<T> = T extends any ? keyof T : never
type StrictUnionHelper<T, TAll> = T extends any
	? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>>
	: never
export type StrictUnion<T> = StrictUnionHelper<T, T>
