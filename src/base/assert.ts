class AssertionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'AssertionError';
  }
}

/** An assertion that runs on browsers/mobile and in node. */
export function assert(value: boolean, message?: string): asserts value {
  if (!value) {
    throw new AssertionError(message);
  }
}
