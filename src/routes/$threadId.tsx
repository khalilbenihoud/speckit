import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { threadsStore, deriveTitle, type Thread } from "@/lib/threads-store";
import { getSuggestions, t, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/$threadId")({
  component: ThreadPage,
});

function ThreadPage() {
  const { threadId } = Route.useParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <ChatWindow key={threadId} threadId={threadId} />;
}

function ChatWindow({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const [initial, setInitial] = useState<Thread | null | undefined>(undefined);

  useEffect(() => {
    const existing = threadsStore.get(threadId);
    if (existing) {
      setInitial(existing);
    } else {
      // Auto-create thread with this id so a fresh URL works.
      const t: Thread = {
        id: threadId,
        title: "New spec",
        updatedAt: Date.now(),
        messages: [],
      };
      threadsStore.upsert(t);
      setInitial(t);
    }
  }, [threadId]);

  if (initial === undefined) return null;
  if (initial === null) return null;
  return <ChatInner threadId={threadId} initialMessages={initial.messages} navigate={navigate} />;
}

function ChatInner({
  threadId,
  initialMessages,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [lang] = useLang();
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({ language: lang }),
      }),
    [lang],
  );
  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    },
  });

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Persist messages to localStorage on every change.
  useEffect(() => {
    if (messages.length === 0) return;
    const existing = threadsStore.get(threadId);
    const nextTitle =
      existing && existing.title !== "New spec" ? existing.title : deriveTitle(messages);
    threadsStore.upsert({
      id: threadId,
      title: nextTitle,
      updatedAt: Date.now(),
      messages,
    });
  }, [messages, threadId]);

  // Focus composer on mount/thread change and after stream finishes.
  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, status]);

  // Auto-send a pending message coming from the landing composer.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `speckit.pending.${threadId}`;
    const pending = window.sessionStorage.getItem(key);
    if (pending) {
      window.sessionStorage.removeItem(key);
      sendMessage({ text: pending });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const isBusy = status === "submitted" || status === "streaming";

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text?.trim();
    if (!text || isBusy) return;
    sendMessage({ text });
    setInput("");
  };

  const sendSuggestion = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4">
          {messages.length === 0 && (
            <EmptyState onPick={sendSuggestion} />
          )}

          {messages.map((m) => {
            const text = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            return (
              <Message key={m.id} from={m.role === "user" ? "user" : "assistant"}>
                <MessageContent>
                  {m.role === "assistant" ? (
                    <MessageResponse>{text}</MessageResponse>
                  ) : (
                    <p className="whitespace-pre-wrap">{text}</p>
                  )}
                </MessageContent>
              </Message>
            );
          })}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>{t("thinking", lang)}</Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t bg-background">
        <div className="mx-auto w-full max-w-3xl p-4">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder={t("placeholder", lang)}
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit
                status={status}
                disabled={!input.trim() && !isBusy}
                onClick={(e) => {
                  if (isBusy) {
                    e.preventDefault();
                    stop();
                  }
                }}
              />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            {t("disclaimer", lang)}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (t: string) => void }) {
  const [lang] = useLang();
  const suggestions = getSuggestions(lang);
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Sparkles className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-xl font-semibold">{t("emptyTitle", lang)}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{t("emptyLede", lang)}</p>
      <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-1">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-lg border bg-card px-4 py-3 text-left text-sm text-card-foreground transition hover:bg-accent"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}