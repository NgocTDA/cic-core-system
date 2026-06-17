@label: Confluence v1 — chuyển trung thực
You are given the ACTUAL content of an existing document (a Confluence page) converted to markdown.
Your task is to MAP that content into the JSON structure below — faithfully, WITHOUT altering it.

STRICT RULES:
- Do NOT rewrite, summarize, paraphrase, translate, reorder ideas, or invent anything. Preserve the original wording and values VERBATIM (keep the source language).
- Only fill a field if the source actually contains that information. If it is absent, use an empty string "" or an empty array []. Do NOT fabricate. Do NOT enforce any minimum number of items.
- For tables/lists in the source, copy each row as-is into the matching array (do not merge, split, or summarize rows).
- Map by meaning to the closest key; if content does not fit any key, omit it rather than distort other fields.
- Return ONLY a single valid JSON object. No markdown, no backticks, no explanation. Start with { and end with }.

JSON keys (must match the Word template):
- funcName (string) — the screen/feature title from the page
- screenCode (string)
- module (string)
- purpose (string)
- scope (array of strings)
- screenType (one of: Form nhập liệu | Danh sách | Xem chi tiết | Báo cáo | Khác; "" if not stated)
- accessRoles (string)
- parentScreen (string or null)
- childScreens (string or null)
- components (array; each: { stt, name, type, required, desc, validation })
- flow (array; each: { step, actor, action, result })
- errors (array; each: { situation, message, action })
- businessRules (array of strings)
- openQuestions (array of objects, each: { topic, content })

RETURN ONLY VALID JSON. NO OTHER TEXT.
