export type CallbackRef<Args extends unknown[], Result> = {
  current: (...args: Args) => Result;
};

export function createStableCallbackProxy<Args extends unknown[], Result>(
  callbackRef: CallbackRef<Args, Result>,
) {
  return (...args: Args) => callbackRef.current(...args);
}
