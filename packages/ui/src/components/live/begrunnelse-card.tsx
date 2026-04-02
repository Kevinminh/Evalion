interface BegrunnelseCardProps {
  text: string;
  studentName?: string;
}

export function BegrunnelseCard({ text, studentName }: BegrunnelseCardProps) {
  return (
    <div className="rounded-lg border-l-[3px] border-l-primary/30 bg-primary/5 p-4">
      <p className="text-sm italic text-foreground/80">{text}</p>
      {studentName && (
        <p className="mt-2 text-xs font-semibold text-muted-foreground">— {studentName}</p>
      )}
    </div>
  );
}
