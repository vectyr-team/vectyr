# Hero AI chat

- [x] Add centered hero chat with streaming replies and browser-local history.
- [x] Connect and verify Lovable AI, including a follow-up and reload.
- [x] Check layout and project diagnostics.

# Chat Knowledgebase

- [x] Add admin-only Markdown/XML knowledge textarea.
- [x] Restrict replies to current saved knowledge and fail closed when unavailable.
- [x] Verify admin save/reload and grounded chat replies.

# Categorized Chat Knowledge

- [x] Preserve existing knowledge in categorized storage with admin-only access.
- [x] Add category table with add, edit, save and confirmed deletion.
- [x] Use current categorized details for chat replies and verify the flow.

# Chat Instructions

- [x] Add admin-only general instructions editor and saved settings.
- [x] Apply saved instructions on each chat request without weakening knowledge restrictions.
- [x] Verify chat replies and instruction safeguards with tests.
- [ ] Verify admin save/reload and changed reply behavior. Blocked until the user signs into the preview, no matching managed test session is available.

# Claude Website Chat

- [ ] Switch website replies to Claude while preserving instructions, knowledge restrictions, streaming and browser history. Blocked: Claude is in the authenticated model catalog, but this project's supplied integration contract supports only OpenAI/Google chat and no native Claude Messages guide is available.

# Chat Calendar Repair

- [x] Safely display calendar embeds in assistant replies, including saved conversations.
- [x] Verify a real calendar reply, selectable dates and time slots, reload persistence, and mobile layout.

# Chat Lists And Follow-Ups

- [x] Restore list markers and indentation.
- [x] Turn follow-up choices into buttons using the existing question action.
- [x] Verify parsing and clicking a follow-up through the chat.