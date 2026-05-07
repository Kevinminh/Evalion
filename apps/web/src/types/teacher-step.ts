import type { ReactNode } from "react";

export interface TeacherStep {
  main: ReactNode;
  panel: ReactNode;
  panelFooter?: ReactNode;
}
