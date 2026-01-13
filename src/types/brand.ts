declare const __brand: unique symbol;

export type Branded<T, B> = Brand<B> & T;

type Brand<B> = { [__brand]: B };
