"use client";

import type { Dispatch, SetStateAction } from "react";

import { DropIndicator, useDragAndDrop } from "react-aria-components";

export function useKanbanTableDnd(setOrder: Dispatch<SetStateAction<string[]>>) {
  return useDragAndDrop({
    getItems: (keys) => [...keys].map((key) => ({ "text/plain": String(key) })),
    getAllowedDropOperations: () => ["move"],
    renderDropIndicator: (target) => (
      <DropIndicator target={target} className="data-drop-target:outline-2 data-drop-target:outline-ring" />
    ),
    onReorder: (event) => {
      setOrder((current) => {
        const keys = new Set([...event.keys].map(String));
        const target = String(event.target.key);
        if (keys.has(target)) {
          return current;
        }

        const moved = current.filter((id) => keys.has(id));
        const remaining = current.filter((id) => !keys.has(id));
        const index = remaining.indexOf(target);
        if (index === -1) {
          return current;
        }

        const offset = event.target.dropPosition === "after" ? 1 : 0;
        remaining.splice(index + offset, 0, ...moved);
        return remaining;
      });
    },
  });
}
