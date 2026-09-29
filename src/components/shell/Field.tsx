/** The Field — the one always-animating element. Data-reactive, low opacity,
 *  and completely removed under prefers-reduced-motion. */
export function Field() {
  return (
    <div className="field" aria-hidden="true">
      <div className="field__blob field__blob--a" />
      <div className="field__blob field__blob--b" />
    </div>
  );
}