export function StatementCard({ statement }: { statement: { text: string } }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border-[1.5px] border-blue-200 bg-blue-50 p-5">
      <p className="text-center text-base font-bold text-foreground">{statement.text}</p>
    </div>
  );
}
