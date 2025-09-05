type Handler = (v: number) => void;
const subs = new Set<Handler>();
let lastBalance = 0;

export function subscribePoints(h: Handler) {
  subs.add(h);
  return () => subs.delete(h);
}
export function publishPoints(v: number) {
  lastBalance = v;
  subs.forEach((fn) => fn(v));
}
export function getLastPoints() {
  return lastBalance;
}

