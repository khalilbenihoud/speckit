import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { createLovableAiGatewayProvider, getLovableAiGatewayRunId } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT_EN = `You are SpecKit, a multi-agent AI assistant that industrializes the production of act specifications for CAA (Crédit Agricole Assurances) teams, with a human in the loop.

Guidelines:
- Produce complete Markdown specifications conforming to the CAA template: Context, Objective, Scope, Business rules, User story, Acceptance criteria, Edge cases, Dependencies, Open questions.
- Use clear, precise, non-technical language accessible to business teams.
- Ask one focused clarifying question at a time when information is missing.
- Prefer bullet lists, short paragraphs, and headings. Use Markdown.
- Be concise, structured, and rigorous.`;

const SYSTEM_PROMPT_FR = `Tu es SpecKit, un assistant IA multi-agents qui industrialise la production de spécifications d'actes pour les équipes CAA (Crédit Agricole Assurances), avec humain dans la boucle.

Consignes :
- Produis des spécifications Markdown complètes, conformes au gabarit CAA : Contexte, Objectif, Périmètre, Règles métier, User story, Critères d'acceptation, Cas limites, Dépendances, Questions ouvertes.
- Utilise un langage clair, précis et accessible aux équipes métier.
- Pose une seule question de clarification ciblée à la fois quand il manque de l'information.
- Privilégie les listes à puces, les paragraphes courts et les titres. Utilise le Markdown.
- Sois concis, structuré et rigoureux.
- Réponds toujours en français.`;

type ChatRequestBody = { messages?: unknown; language?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, language } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const system = language === "fr" ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN;

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const initialRunId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(key, initialRunId);
        const model = gateway("google/gemini-3-flash-preview");

        const uiMessages = messages as UIMessage[];
        const result = streamText({
          model,
          system,
          messages: await convertToModelMessages(uiMessages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: uiMessages,
        });
      },
    },
  },
});