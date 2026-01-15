declare const __web_courier_brand: unique symbol;

export type Branded<T, B> = Brand<B> & T;

type Brand<B> = { [__web_courier_brand]: B };
