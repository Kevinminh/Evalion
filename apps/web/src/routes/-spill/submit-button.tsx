import { cn } from "@workspace/ui/lib/utils";

interface SubmitButtonProps {
  sent: boolean;
  disabled?: boolean;
  onClick: () => void;
  label?: string;
  sentLabel?: string;
}

export function SubmitButton({
  sent,
  disabled,
  onClick,
  label = "Send inn",
  sentLabel = "Sendt!",
}: SubmitButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={sent || disabled}
      className={cn(
        "self-center rounded-2xl px-8 py-3 text-[15px] font-bold text-white transition-all active:translate-y-0.5 active:shadow-[0_2px_0]",
        sent
          ? "pointer-events-none bg-green-500 shadow-[0_4px_0_#2E7D32]"
          : "bg-primary shadow-[0_4px_0_var(--color-primary-700,theme(colors.purple.700))]",
        disabled && !sent && "pointer-events-none opacity-50",
      )}
    >
      {sent ? sentLabel : label}
    </button>
  );
}
