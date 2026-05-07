export function CountdownOverlay({
  visible,
  number,
}: {
  visible: boolean;
  number: number;
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay-countdown)]">
      <span
        key={number}
        className="animate-[countdown-pop_0.8s_cubic-bezier(0.34,1.56,0.64,1)_both] font-extrabold text-white tabular-nums"
        style={{
          fontSize: "clamp(7rem, 22vw, 14rem)",
          textShadow: "var(--shadow-countdown-glow)",
        }}
      >
        {number}
      </span>
    </div>
  );
}
