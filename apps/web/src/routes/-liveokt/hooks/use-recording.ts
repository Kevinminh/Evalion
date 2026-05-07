import { useEffect, useState } from "react";

export interface RecordingState {
  recording: boolean;
  setRecording: (b: boolean) => void;
  recordElapsed: number;
}

export function useRecording(): RecordingState {
  const [recording, setRecording] = useState(false);
  const [recordElapsed, setRecordElapsed] = useState(0);

  useEffect(() => {
    if (!recording) {
      setRecordElapsed(0);
      return;
    }
    const interval = setInterval(() => setRecordElapsed((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [recording]);

  return { recording, setRecording, recordElapsed };
}
