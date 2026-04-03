interface NotFoundStateProps {
  message?: string;
  className?: string;
}

export function NotFoundState({
  message = "FagPrat ikke funnet.",
  className = "flex min-h-[50vh] items-center justify-center",
}: NotFoundStateProps) {
  return (
    <div className={className}>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
