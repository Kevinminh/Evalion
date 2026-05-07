export function CountdownOverlay({
  visible,
  number,
}: {
  visible: boolean;
  number: number;
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <span
        key={number}
        className="text-[160px] font-extrabold text-white animate-[countdown-pop_0.8s_ease_both]"
      >
        {number}
      </span>
    </div>
  );
}
