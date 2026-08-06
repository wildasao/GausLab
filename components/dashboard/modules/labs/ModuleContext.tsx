"use client";

import { createContext, useContext } from "react";

/**
 * Tiny context so labs know which module they live inside — used when saving
 * a student-created problem so it can be grouped by module_slug.
 */
const ModuleContext = createContext<string>("");

export function ModuleProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  return <ModuleContext.Provider value={slug}>{children}</ModuleContext.Provider>;
}

export function useModuleContext() {
  return useContext(ModuleContext);
}
