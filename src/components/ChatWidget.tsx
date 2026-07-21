import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const MARKER_ATTR = "data-vectyr-chat-widget";

const removeInjected = () => {
  document.querySelectorAll(`[${MARKER_ATTR}]`).forEach((el) => el.remove());
  // Also remove widget DOM that third-party loaders (e.g. LeadConnector) inject
  // outside of our marked script tags. Without this, toggling off leaves the
  // rendered chat bubble/iframe in place until a full page reload.
  const externalSelectors = [
    "lc-live-chat",
    "[id^='lc_text']",
    "[id^='lead-connector']",
    "[class*='LeadConnector']",
    "iframe[src*='leadconnectorhq']",
    "iframe[src*='chat-widget']",
    "div[id*='chat-widget']",
  ];
  document.querySelectorAll(externalSelectors.join(",")).forEach((el) => el.remove());
};

const injectFromHtml = (html: string) => {
  removeInjected();
  if (!html.trim()) return;

  const template = document.createElement("template");
  template.innerHTML = html;

  template.content.childNodes.forEach((node) => {
    if (node.nodeType !== 1) return;
    const el = node as HTMLElement;

    if (el.tagName === "SCRIPT") {
      const script = document.createElement("script");
      for (const attr of Array.from(el.attributes)) {
        script.setAttribute(attr.name, attr.value);
      }
      script.text = el.textContent || "";
      script.setAttribute(MARKER_ATTR, "");
      document.body.appendChild(script);
    } else {
      const clone = el.cloneNode(true) as HTMLElement;
      clone.setAttribute(MARKER_ATTR, "");
      document.body.appendChild(clone);
    }
  });
};

const ChatWidget = () => {
  const location = useLocation();
  const isBackend = location.pathname.startsWith("/backend");

  useEffect(() => {
    if (isBackend) {
      removeInjected();
      return;
    }

    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_widgets")
        .select("chat_widget_code, enabled")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (data && data.enabled && data.chat_widget_code) {
        injectFromHtml(data.chat_widget_code);
      } else {
        removeInjected();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isBackend]);

  return null;
};

export default ChatWidget;