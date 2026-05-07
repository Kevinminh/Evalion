export function BegrunnelsePanel({
  begrunnelseText,
  setBegrunnelseText,
  begrunnelseSent,
  setBegrunnelseSent,
  onSubmit,
  draftKey,
}: {
  begrunnelseText: string;
  setBegrunnelseText: (text: string) => void;
  begrunnelseSent: boolean;
  setBegrunnelseSent: (sent: boolean) => void;
  onSubmit: (text: string) => Promise<void>;
  draftKey: string | null;
}) {
  return (
    <div className="w-full max-w-md">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Din begrunnelse
      </p>
      {begrunnelseSent ? (
        <div className="rounded-xl bg-primary/10 px-6 py-3">
          <p className="text-sm font-bold text-primary">Begrunnelse sendt!</p>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={begrunnelseText}
            onChange={(e) => setBegrunnelseText(e.target.value)}
            placeholder="Skriv hva du tenker om påstanden..."
            className="w-full rounded-xl border-2 border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-primary focus:ring-3 focus:ring-primary/20"
            rows={3}
          />
          <button
            onClick={async () => {
              if (!begrunnelseText.trim()) return;
              setBegrunnelseSent(true);
              try {
                await onSubmit(begrunnelseText.trim());
                // Draft is now persisted server-side; clear the
                // localStorage copy.
                if (draftKey) {
                  try {
                    localStorage.removeItem(draftKey);
                  } catch {
                    /* noop */
                  }
                }
              } catch {
                setBegrunnelseSent(false);
              }
            }}
            disabled={!begrunnelseText.trim()}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all disabled:opacity-50"
          >
            Send inn
          </button>
        </div>
      )}
    </div>
  );
}
