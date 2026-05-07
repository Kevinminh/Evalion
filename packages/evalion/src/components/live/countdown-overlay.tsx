export function CountdownOverlay({
  visible,
  number,
}: {
  visible: boolean;
  number: number;
}) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(20, 8, 40, 0.78)" }}
    >
      <span
        key={number}
        className="font-extrabold text-white tabular-nums"
        style={{
          fontSize: "clamp(7rem, 22vw, 14rem)",
          textShadow: "0 0 64px rgba(108, 63, 197, 0.6)",
          animation: "countdown-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
      >
        {number}
      </span>
    </div>
  );
}
