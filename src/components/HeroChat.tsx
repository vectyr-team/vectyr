import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Square, Trash2 } from "lucide-react";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { readHeroChatHistory, saveHeroChatHistory } from "@/lib/hero-chat-history";

const transport = new DefaultChatTransport({
  api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hero-chat`,
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
  },
});

const HeroChat = () => {
  const [initialMessages] = useState(() => typeof window === "undefined" ? [] : readHeroChatHistory(window.localStorage));
  const [text, setText] = useState("");
  const [storageError, setStorageError] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const followLatest = useRef(true);
  const focusComposer = () => root.current?.querySelector("textarea")?.focus({ preventScroll: true });
  const { messages, sendMessage, status, stop, error, setMessages, clearError } = useChat({
    id: "vectyr-hero", messages: initialMessages, transport,
    onFinish: ({ messages: completed }) => {
      try { saveHeroChatHistory(window.localStorage, completed); } catch { setStorageError(true); }
      focusComposer();
    },
    onError: () => focusComposer(),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => { focusComposer(); }, []);
  useEffect(() => {
    const trackScroll = () => {
      followLatest.current = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100;
    };
    window.addEventListener("scroll", trackScroll, { passive: true });
    return () => window.removeEventListener("scroll", trackScroll);
  }, []);
  useEffect(() => {
    try { saveHeroChatHistory(window.localStorage, messages); } catch { setStorageError(true); }
    if (followLatest.current) {
      const frame = requestAnimationFrame(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
      return () => cancelAnimationFrame(frame);
    }
  }, [messages]);

  return (
    <div ref={root} className="flex min-h-[calc(100dvh-7rem)] w-full max-w-[720px] flex-col justify-end pb-56 text-left" aria-label="Vectyr AI chat">
      {messages.length > 0 && (
        <>
          <div className="flex justify-end mb-1">
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon-sm" disabled={busy} aria-label="Clear conversation"><Trash2 className="h-4 w-4" /></Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Clear conversation</TooltipContent>
              </Tooltip>
              <AlertDialogContent className="theme-dark">
                <AlertDialogHeader><AlertDialogTitle>Clear This Conversation?</AlertDialogTitle><AlertDialogDescription>This removes the saved messages from this browser.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { setMessages([]); clearError(); focusComposer(); }}>Clear Conversation</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <Conversation className="mb-5 flex-none overflow-visible [&>div]:!overflow-visible">
            <ConversationContent className="gap-6 px-1 py-3">
              {messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent className={`font-body leading-relaxed break-words ${message.role === "assistant" ? "text-lg" : "text-base"}`}>
                    {message.parts.map((part, index) => {
                      if (part.type === "text") return <MessageResponse key={index} isAnimating={busy && message.role === "assistant"}>{part.text}</MessageResponse>;
                      if (part.type === "reasoning") return <Reasoning key={index} defaultOpen={false}><ReasoningTrigger /><ReasoningContent>{part.text}</ReasoningContent></Reasoning>;
                      return null;
                    })}
                  </MessageContent>
                </Message>
              ))}
              {status === "submitted" && <div role="status" aria-label="Waiting for AI reply" className="space-y-2"><Skeleton className="h-3 w-40" /><Skeleton className="h-3 w-24" /></div>}
            </ConversationContent>
          </Conversation>
        </>
      )}
      <div className="theme-dark fixed inset-x-0 bottom-0 z-20 px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-[720px]">
      {error && <p role="alert" className="mb-3 text-sm text-foreground">{error.message}</p>}
      {storageError && <p role="alert" className="mb-3 text-sm text-muted-foreground">This browser could not save your conversation.</p>}
      <PromptInput className="[&_[data-slot=input-group]]:bg-card/95" onSubmit={({ text: input }) => {
        if (!input.trim() || busy) return;
        clearError();
        followLatest.current = true;
        void sendMessage({ text: input.trim() });
        setText("");
        focusComposer();
      }}>
        <PromptInputTextarea aria-label="Message Vectyr AI" placeholder="What's on your mind about your brand?" value={text} onChange={(event) => setText(event.target.value)} className="min-h-[84px] text-base px-5 pt-5" />
        <PromptInputFooter className="justify-between px-4 pb-3">
          <span className="font-mono text-[10px] uppercase text-muted-foreground">Vectyr AI</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <PromptInputSubmit status={status} onStop={() => { stop(); focusComposer(); }} disabled={!busy && !text.trim()} className="h-9 w-9 p-0 shrink-0" aria-label={busy ? "Stop reply" : "Send message"}>
                {busy ? <Square className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
              </PromptInputSubmit>
            </TooltipTrigger>
            <TooltipContent>{busy ? "Stop reply" : "Send message"}</TooltipContent>
          </Tooltip>
        </PromptInputFooter>
      </PromptInput>
      </div>
      </div>
    </div>
  );
};

export default HeroChat;