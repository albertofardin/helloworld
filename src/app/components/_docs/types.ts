import type * as React from "react";

export interface IDocProp {
  name: string;
  type: string;
  def?: string;
  required?: boolean;
  description: string;
}

export interface IDocExample {
  title: string;
  description?: string;
  code: string;
  Demo: React.ComponentType;
  previewClassName?: string;
}

export interface IDocEntry {
  id: string;
  name: string;
  description: string;
  importCode: string;
  examples: IDocExample[];
  props: IDocProp[];
  notes?: string[];
}

export interface IDocCategory {
  id: string;
  label: string;
  icon: string;
  entries: IDocEntry[];
}

// Props ripetute identiche su quasi tutti i componenti.
export const pClassName: IDocProp = {
  name: "className",
  type: "string",
  description: "Classi Tailwind aggiuntive, unite a quelle di base con cn().",
};

export const pStyle: IDocProp = {
  name: "style",
  type: "React.CSSProperties",
  description: "Stile inline applicato all'elemento radice.",
};
