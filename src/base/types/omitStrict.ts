/**
 * A wrapper of `Omit` that requires the omitted keys are actually part of the given type.
 */
export type OmitStrict<T, K extends keyof T> = Omit<T, K>;
