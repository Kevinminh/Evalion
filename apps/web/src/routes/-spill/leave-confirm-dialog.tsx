interface LeaveConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LeaveConfirmDialog({ open, onCancel, onConfirm }: LeaveConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
        <h2 className="text-lg font-bold text-foreground">Forlat spill?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Er du sikker på at du vil forlate spillet?
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            Avbryt
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-destructive px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-destructive/90"
          >
            Ja, forlat
          </button>
        </div>
      </div>
    </div>
  );
}
