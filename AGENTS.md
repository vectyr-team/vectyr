# Project Rules

- Serve heading font files locally from `public/fonts` and register them in global CSS so typography also loads on Vercel without an external font request.
- Compose the home chat with AI Elements and AI SDK UI-message streams, with browser-local UIMessage history and a server-only hero-chat Edge Function, so secrets stay private and streamed replies restore correctly.
- Fetch all admin-managed categorized chat knowledge items server-side for every request, with admin-only table access and no fallback facts, so edits become the chat's sole factual reference immediately.
- Store general chat instructions in an admin-only singleton settings row and load them server-side for every request, beneath mandatory factual-source restrictions; share defaults through a pure module so the editor and function agree.