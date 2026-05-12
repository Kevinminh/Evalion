import { cn } from "@workspace/ui/lib/utils";

const SIZE_CLASSES = {
  xs: "size-6 text-xs",
  sm: "size-8 text-sm",
  lg: "size-16 text-2xl",
} as const;

export function StudentAvatar({
  name,
  avatarColor,
  size = "lg",
}: {
  name: string;
  avatarColor: string;
  size?: keyof typeof SIZE_CLASSES;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-bold text-white",
        SIZE_CLASSES[size],
        avatarColor,
      )}
    >
      {name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}
