export function valueOrResult(arg, ...args) {
  if (typeof arg === 'function') {
    return arg.apply(null, args);
  }
  return arg;
}
