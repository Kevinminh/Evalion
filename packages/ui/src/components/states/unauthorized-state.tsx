interface UnauthorizedStateProps {
  message?: string;
  className?: string;
}

export function UnauthorizedState({
  message = "Du har ikke tilgang til denne FagPraten.",
  className = "flex min-h-[50vh] items-center justify-center",
}: UnauthorizedStateProps) {
  return (
    <div className={className}>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
