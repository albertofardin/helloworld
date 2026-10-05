import type { IDocCategory } from "./types";
import buttons from "./entries/buttons";
import data from "./entries/data";
import feedback from "./entries/feedback";
import forms from "./entries/forms";
import foundations from "./entries/foundations";
import layout from "./entries/layout";
import overlays from "./entries/overlays";

// Ordine di lettura della pagina: dalle primitive ai componenti composti.
// Per documentare un nuovo componente aggiungi la sua scheda al file della
// categoria in ./entries.
const categories: IDocCategory[] = [
  {
    id: "fondamenta",
    label: "Fondamenta",
    icon: "palette",
    entries: foundations,
  },
  { id: "pulsanti", label: "Pulsanti", icon: "target", entries: buttons },
  { id: "form", label: "Form", icon: "edit_note", entries: forms },
  { id: "dati", label: "Dati", icon: "list", entries: data },
  { id: "feedback", label: "Feedback", icon: "bell", entries: feedback },
  { id: "overlay", label: "Overlay", icon: "open_in_new", entries: overlays },
  {
    id: "layout",
    label: "Layout e animazioni",
    icon: "dashboard",
    entries: layout,
  },
];

export default categories;
