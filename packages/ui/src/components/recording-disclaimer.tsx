import { Mic } from "lucide-react";

export function RecordingDisclaimer() {
  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 p-4">
      <Mic className="size-5 shrink-0 text-orange-500" />
      <p className="text-xs font-semibold text-orange-700">
        Diskusjonen kan bli tatt opp for læringsformål.
      </p>
    </div>
  );
}
