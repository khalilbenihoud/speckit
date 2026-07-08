import { useEffect, useState } from "react";

export type Lang = "en" | "fr";
const KEY = "speckit.lang.v1";

export function getLang(): Lang {
  if (typeof window === "undefined") return "fr";
  const v = window.localStorage.getItem(KEY);
  return v === "en" ? "en" : "fr";
}

export function setLang(lang: Lang) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, lang);
  window.dispatchEvent(new Event("speckit:lang"));
}

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>("fr");
  useEffect(() => {
    setLangState(getLang());
    const onChange = () => setLangState(getLang());
    window.addEventListener("speckit:lang", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("speckit:lang", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return [lang, (l: Lang) => setLang(l)];
}

type Dict = Record<string, { en: string; fr: string }>;

const dict: Dict = {
  appTagline: {
    en: "Industrialize your specifications with AI",
    fr: "Industrialisez vos spécifications avec l'IA",
  },
  heroTitle: {
    en: "What do you want to spec?",
    fr: "Que voulez-vous spécifier ?",
  },
  modeGenerate: { en: "Generate", fr: "Générer" },
  modePaste: { en: "Paste a brief", fr: "Coller un brief" },
  actionTemplates: { en: "Templates", fr: "Gabarits" },
  actionBlank: { en: "Blank canvas", fr: "Page blanche" },
  actionVoice: { en: "Use voice", fr: "Dicter à la voix" },
  upload: { en: "Upload", fr: "Ajouter un fichier" },
  send: { en: "Send", fr: "Envoyer" },
  welcome: { en: "Welcome to SpecKit", fr: "Bienvenue sur SpecKit" },
  landingLede: {
    en: "Describe an act, a rule, or a need. SpecKit's multi-agent AI drafts a complete specification — human in the loop.",
    fr: "Décrivez un acte, une règle ou un besoin. Le système multi-agents de SpecKit rédige une spécification complète — humain dans la boucle.",
  },
  startNew: { en: "New specification", fr: "Nouvelle spécification" },
  emptyTitle: {
    en: "What do you want to spec?",
    fr: "Que voulez-vous spécifier ?",
  },
  emptyLede: {
    en: "Describe the act, the rule, or the change. SpecKit will structure it into a Markdown specification conforming to the CAA template.",
    fr: "Décrivez l'acte, la règle ou l'évolution. SpecKit la structure en spécification Markdown conforme au gabarit CAA.",
  },
  placeholder: {
    en: "Describe it, or paste anything here.",
    fr: "Décrivez-le, ou collez n'importe quoi ici.",
  },
  thinking: { en: "Agents working…", fr: "Agents en cours…" },
  disclaimer: {
    en: "SpecKit is an AI assistant with a human in the loop. Review outputs before publishing.",
    fr: "SpecKit est un assistant IA avec humain dans la boucle. Vérifiez les livrables avant publication.",
  },
  language: { en: "Language", fr: "Langue" },
  sidebarTagline: { en: "Multi-agent spec assistant", fr: "Assistant multi-agents de specs" },
  newSpec: { en: "New specification", fr: "Nouvelle spécification" },
  recentChats: { en: "Recent conversations", fr: "Conversations récentes" },
  noConversations: {
    en: "No conversations yet. Start a new specification above.",
    fr: "Aucune conversation. Lancez une nouvelle spécification ci-dessus.",
  },
  deleteConversation: { en: "Delete conversation", fr: "Supprimer la conversation" },
  localOnly: {
    en: "Conversations are saved in this browser only.",
    fr: "Les conversations sont enregistrées uniquement dans ce navigateur.",
  },
  sampleReportsEyebrow: {
    en: "CAA Specification Assistant",
    fr: "Assistant CAA de spécification",
  },
  sampleReportsTitle: {
    en: "Markdown, user stories, acceptance criteria — all in one place.",
    fr: "Markdown, user stories, critères d'acceptation — le tout au même endroit.",
  },
  sampleReportsDescription: {
    en: "SpecKit compiles your requirements into structured, professional specifications and reports — formatted, consistent, and ready for review.",
    fr: "SpecKit compile vos exigences en spécifications et rapports structurés et professionnels — formatés, cohérents et prêts pour relecture.",
  },
  sampleReportsCta: {
    en: "Try it now",
    fr: "Essayer maintenant",
  },
};

const suggestionsByLang: Record<Lang, string[]> = {
  en: [
    "Draft a specification for a new life insurance act",
    "Structure the acceptance criteria for a claim reopening rule",
    "Turn this note into a CAA-compliant Markdown specification",
  ],
  fr: [
    "Rédige la spécification d'un nouvel acte d'assurance vie",
    "Structure les critères d'acceptation pour une règle de réouverture de sinistre",
    "Transforme cette note en spécification Markdown conforme au gabarit CAA",
  ],
};

export function t(key: keyof typeof dict, lang: Lang): string {
  return dict[key][lang];
}

export function getSuggestions(lang: Lang): string[] {
  return suggestionsByLang[lang];
}