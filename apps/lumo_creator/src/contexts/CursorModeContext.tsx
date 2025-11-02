// CursorModeContext.tsx
import React, { createContext, useContext, useState } from "react";

export type CursorMode = "resize" | "drag" | "edit" | null;

interface CursorModeContextProps {
  cursorMode: CursorMode;
  setCursorMode: (mode: CursorMode) => void;
}

const CursorModeContext = createContext<CursorModeContextProps>({
  cursorMode: null,
  setCursorMode: () => {},
});

export const CursorModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [cursorMode, setCursorMode] = useState<CursorMode>(null);
  return (
    <CursorModeContext.Provider value={{ cursorMode, setCursorMode }}>
      {children}
    </CursorModeContext.Provider>
  );
};

export const useCursorMode = () => useContext(CursorModeContext);
