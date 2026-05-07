import { cn } from "@workspace/ui/lib/utils";

interface StatementCardProps {
  statement: { text: string };
  size?: "sm" | "lg";
  className?: string;
}

export function StatementCard({ statement, size = "sm", className }: StatementCardProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full rounded-2xl border-[1.5px] border-blue-200 bg-blue-50",
        size === "lg" ? "max-w-2xl p-6" : "max-w-md p-5",
        className,
      )}
    >
      <p
        className={cn(
          "text-center font-bold text-foreground",
          size === "lg" ? "text-lg" : "text-base",
        )}
      >
        {statement.text}
      </p>
    </div>
  );
}
