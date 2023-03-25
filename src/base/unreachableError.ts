export class UnreachableError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(value: never) {
    super(value);
  }
}
