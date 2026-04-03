interface ErrorStateProps {
  message?: string;
  className?: string;
}

export function ErrorState({
  message = "Noe gikk galt. Prøv å laste siden på nytt.",
  className = "flex min-h-[50vh] items-center justify-center",
}: ErrorStateProps) {
  return (
    <div className={className}>
      <p className="text-destructive">{message}</p>
    </div>
  );
}
