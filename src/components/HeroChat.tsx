import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Square } from "lucide-react";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { readHeroChatHistory, saveHeroChatHistory } from "@/lib/hero-chat-history";
import { parseChatCalendars } from "@/lib/chat-calendar";
import { ChatCalendar } from "@/components/ChatCalendar";
import { parseChatFollowUps } from "@/lib/chat-follow-ups";

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
  const conversation = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLDivElement>(null);
  const [conversationClip, setConversationClip] = useState(0);
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
  const askQuestion = (question: string) => {
    if (busy || !question.trim()) return;
    clearError();
    followLatest.current = true;
    void sendMessage({ text: question.trim() });
    setText("");
    focusComposer();
  };

  useEffect(() => {
    const content = conversation.current;
    const input = composer.current;
    if (!content || !input) return;

    const updateClip = () => {
      setConversationClip(Math.max(0, content.getBoundingClientRect().bottom - input.getBoundingClientRect().top));
    };
    const observer = new ResizeObserver(updateClip);
    observer.observe(content);
    observer.observe(input);
    window.addEventListener("scroll", updateClip, { passive: true });
    window.addEventListener("resize", updateClip);
    updateClip();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateClip);
      window.removeEventListener("resize", updateClip);
    };
  }, [messages.length]);

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
      const frame = requestAnimationFrame(() => window.scrollTo({ top: messages.length > 0 ? document.documentElement.scrollHeight : 0, behavior: "instant" }));
      return () => cancelAnimationFrame(frame);
    }
  }, [messages]);

  return (
    <div ref={root} className="hero-chat flex min-h-[calc(100dvh-7rem)] w-full max-w-[720px] flex-col justify-end pb-56 text-left" aria-label="Vectyr AI chat">
      {messages.length > 0 && (
        <div ref={conversation} style={{ clipPath: `inset(0 0 ${conversationClip}px 0)` }}>
          <Conversation className="mb-5 flex-none overflow-visible [&>div]:!overflow-visible">
            <ConversationContent className="gap-6 px-0 py-3">
              {messages.map((message) => (
                <Message key={message.id} from={message.role} className={message.role === "assistant" ? "max-w-full" : undefined}>
                  <MessageContent className="font-body leading-relaxed break-words text-lg group-[.is-assistant]:w-full">
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        if (message.role !== "assistant") return <MessageResponse key={index}>{part.text}</MessageResponse>;
                        return parseChatCalendars(part.text).map((segment, segmentIndex) => segment.type === "calendar"
                          ? <ChatCalendar key={`${index}-${segmentIndex}-${segment.src}`} src={segment.src} />
                          : parseChatFollowUps(segment.text).map((followUp, followUpIndex) => followUp.type === "text"
                            ? <MessageResponse key={`${index}-${segmentIndex}-${followUpIndex}`} isAnimating={busy}>{followUp.text}</MessageResponse>
                            : <div key={`${index}-${segmentIndex}-${followUpIndex}`} className="flex flex-col items-start gap-2 py-2">
                                {followUp.questions.map((question, questionIndex) => (
                                  <Button key={`${questionIndex}-${question}`} type="button" variant="outline" disabled={busy} onClick={() => askQuestion(question)} className="h-auto max-w-full justify-start whitespace-normal text-left text-base leading-relaxed px-4 py-3">
                                    {question}
                                  </Button>
                                ))}
                              </div>));
                      }
                      if (part.type === "reasoning") return <Reasoning key={index} defaultOpen={false}><ReasoningTrigger /><ReasoningContent>{part.text}</ReasoningContent></Reasoning>;
                      return null;
                    })}
                  </MessageContent>
                </Message>
              ))}
              {status === "submitted" && <div role="status" aria-label="Waiting for AI reply" className="space-y-2"><Skeleton className="h-3 w-40" /><Skeleton className="h-3 w-24" /></div>}
            </ConversationContent>
          </Conversation>
        </div>
      )}
      <div ref={composer} className={`theme-light fixed inset-x-0 z-20 px-6 ${messages.length === 0 ? "top-1/2 -translate-y-1/2" : "bottom-0 pb-[max(1.5rem,env(safe-area-inset-bottom))]"}`}>
      <div className="relative mx-auto w-full max-w-[720px]">
      {messages.length === 0 && (
        <h1 className="absolute bottom-full mb-8 w-full text-center text-4xl font-bold text-foreground text-balance">
          We Build New Brands and Fix Broken Ones
        </h1>
      )}
      {error && <p role="alert" className="mb-3 text-sm text-foreground">{error.message}</p>}
      {storageError && <p role="alert" className="mb-3 text-sm text-muted-foreground">This browser could not save your conversation.</p>}
      <PromptInput className="[&_[data-slot=input-group]]:bg-background" onSubmit={({ text: input }) => {
        askQuestion(input);
      }}>
        <PromptInputTextarea aria-label="Message Vectyr AI" placeholder="What's on your mind about your brand?" value={text} onChange={(event) => setText(event.target.value)} className="min-h-[84px] text-base px-5 pt-5 focus-visible:ring-offset-0 focus-visible:shadow-none" />
        <PromptInputFooter className="justify-between px-4 pb-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" disabled={busy || messages.length === 0} className="h-9 px-2 font-mono text-[10px] text-muted-foreground">CLEAR CHAT</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="hero-chat theme-dark">
              <AlertDialogHeader><AlertDialogTitle>Clear This Conversation?</AlertDialogTitle><AlertDialogDescription>This removes the saved messages from this browser.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { setMessages([]); clearError(); focusComposer(); }}>Clear Conversation</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <PromptInputSubmit status={status} onStop={() => { stop(); focusComposer(); }} disabled={!busy && !text.trim()} className="h-9 w-9 p-0 shrink-0" aria-label={busy ? "Stop reply" : "Send message"}>
                {busy ? <Square className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
              </PromptInputSubmit>
            </TooltipTrigger>
            <TooltipContent className="hero-chat">{busy ? "Stop reply" : "Send message"}</TooltipContent>
          </Tooltip>
        </PromptInputFooter>
      </PromptInput>
      </div>
      </div>
    </div>
  );
};

export default HeroChat;