import { cn } from "@workspace/ui/lib/utils";

export function StudentAvatar({
  name,
  avatarColor,
  size = "lg",
}: {
  name: string;
  avatarColor: string;
  size?: "sm" | "lg";
}) {
  const sizeClasses =
    size === "sm" ? "size-8 text-sm" : "size-16 text-2xl";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-bold text-white",
        sizeClasses,
        avatarColor,
      )}
    >
      {name[0]}
    </div>
  );
}
