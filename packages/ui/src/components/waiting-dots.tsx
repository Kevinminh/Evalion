import { cn } from "@workspace/ui/lib/utils";

interface WaitingDotsProps {
  className?: string;
}

/**
 * Three pulsing dots used next to "waiting..." messages.
 * Animation keyframes live in globals.css (@keyframes dotPulse).
 */
export function WaitingDots({ className }: WaitingDotsProps) {
  return (
    <span className={cn("ml-1 inline-flex gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2.5 rounded-full bg-primary/40"
          style={{
            animation: "dotPulse 1.4s ease-in-out infinite both",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </span>
  );
}
