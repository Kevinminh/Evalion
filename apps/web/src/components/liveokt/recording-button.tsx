import { RecordButton } from "@workspace/evalion/components/live/record-button";

import { useTeacherSession } from "./teacher-session-context";

const RECORDING_ACTIVE_STEPS = new Set([2, 4]);
const RECORDING_DISABLED_STEPS = new Set([1, 3, 5, 6]);

export function RecordingButton() {
  const { step, recording, setRecording, recordElapsed } = useTeacherSession();

  if (RECORDING_ACTIVE_STEPS.has(step)) {
    return (
      <RecordButton
        state={recording ? "recording" : "ready"}
        onToggle={() => setRecording(!recording)}
        elapsed={recordElapsed}
      />
    );
  }
  if (RECORDING_DISABLED_STEPS.has(step)) {
    return <RecordButton state="disabled" onToggle={() => {}} />;
  }
  return null;
}
