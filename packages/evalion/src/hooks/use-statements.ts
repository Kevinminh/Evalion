import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";

import type { Fasit } from "@workspace/ui/lib/types";

export interface StatementWithId {
  id: string;
  text: string;
  fasit: Fasit;
  explanation: string;
}

function createStatement(
  text = "",
  fasit: Fasit = "sant",
  explanation = "",
): StatementWithId {
  return { id: crypto.randomUUID(), text, fasit, explanation };
}

/**
 * Local state + handlers for a drag-and-droppable list of FagPrat statements.
 * Pairs with @dnd-kit/sortable in the caller.
 */
export function useStatements(initial: StatementWithId[] = []) {
  const [statements, setStatements] = useState<StatementWithId[]>(initial);

  const addStatement = () => {
    setStatements((prev) => [...prev, createStatement()]);
  };

  const updateStatement = (
    index: number,
    field: "text" | "fasit" | "explanation",
    value: string,
  ) => {
    setStatements((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeStatement = (index: number) => {
    setStatements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setStatements((prev) => {
        const oldIndex = prev.findIndex((s) => s.id === active.id);
        const newIndex = prev.findIndex((s) => s.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return {
    statements,
    setStatements,
    addStatement,
    updateStatement,
    removeStatement,
    handleDragEnd,
  };
}

/** Convert raw data (from API or draft JSON) into StatementWithId[] */
export function toStatementsWithId(
  raw: { text: string; fasit: string; explanation: string }[],
): StatementWithId[] {
  return raw.map((s) =>
    createStatement(s.text, (s.fasit as Fasit) ?? "sant", s.explanation),
  );
}

/** Convert StatementWithId[] back to the API format */
export function toStatementPayload(
  statements: StatementWithId[],
): { text: string; fasit: Fasit; explanation: string }[] {
  return statements.map((s) => ({
    text: s.text,
    fasit: s.fasit,
    explanation: s.explanation,
  }));
}
