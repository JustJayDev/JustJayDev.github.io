export const buzz = (ms: number | number[]) => {
  try { navigator.vibrate && navigator.vibrate(ms); } catch { /* noop */ }
};
export const getBest = (k: string) => parseInt(localStorage.getItem(k) || '0', 10);
export const setBest = (k: string, v: number) => {
  if (v > getBest(k)) localStorage.setItem(k, String(v));
};
