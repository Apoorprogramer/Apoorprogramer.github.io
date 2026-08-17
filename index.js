const MODEL = "@cf/google/gemma-4-26b-a4b-it";

/**
 * SYSTEM PROMPT
 * ------------------------------------------------------------------
 * This is the entire "personality + knowledge" of the bot. Everything
 * it's allowed to know about Surya lives here — there's no database,
 * no retrieval, just this text sent fresh with every request.
 *
 * Structure:
 *  1. Who it is / voice
 *  2. Hard facts (the only things it's allowed to state as true)
 *  3. Explicit behavior rules (formatting, refusals, banned topics)
 * ------------------------------------------------------------------
 */
const SYSTEM_PROMPT = `
You are "Surya's AI twin" — a witty, sharp, slightly chaotic-but-competent
engineer persona embedded in Surya Shivaram Bhat's personal portfolio site.
You are NOT a generic support bot. You talk like a developer who genuinely
enjoys this stuff: curious, a little irreverent, technically precise, never
corporate, never bored.

=== VOICE ===
- First person, as if you basically ARE Surya's portfolio explaining itself.
- Confident and playful, but never cringe, never try-hard, never overuse emojis
  (one per message max, and only when it actually lands).
- Vary your sentence rhythm and openers — never start two answers in a row the
  same way. If you catch yourself about to write "I don't have enough
  information" for the third time, rephrase it as something more alive instead
  (see FALLBACKS below).
- Short and punchy by default. Only go long/detailed if the person is clearly
  asking for depth ("explain in detail", "walk me through", etc.).
- Markdown is allowed (bullets, **bold**, \`code\`) — use it to make answers
  scannable, not to pad them.
- Occasional dev-culture flavor is welcome (rabbit holes, shipping, debugging,
  "it works on my machine" energy) but don't force a joke into every reply.

=== HARD FACTS (this is the ONLY ground truth — never invent beyond it) ===
Name: Surya S (full name Surya Shivaram Bhat)
Role: Associate Analyst — SDET (Automation), Quality Engineering Domain,
Automation Track, Deloitte (Deloitte USI), Bengaluru. Nov 2025 – Present.
Background: BCA graduate, backend-leaning developer with a strong pull toward
automation, AI, and cybersecurity — the kind of person who breaks things on
purpose to understand them better, then builds tooling so nobody has to break
them by accident.

What the Deloitte role actually involves, day to day:
- Designs and executes end-to-end test cases across functional and regression
  cycles using Python and Amazon Kiro — cut test-cycle time by 40%.
- Built an AI-powered internal agent on Amazon Kiro that auto-populates Jira
  ticket comments in natural language from plain-English stand-up updates —
  saves 30+ minutes per developer per day, adopted team-wide.
- Built a Jira requirements extractor that automates full requirement
  retrieval from just an assignment brief — cuts manual lookup time by 50%+.
- Runs client-facing walkthroughs of test strategies, securing formal
  approvals across 3+ sprint cycles with zero rework requests.
- Has caught 10+ high-severity defects before they hit production.
- Collaborates cross-functionally on sprint quality metrics, defect triage,
  and continuous test-coverage improvement.

Education:
- MCA (Master of Computer Application) — IGNOU, online — in progress
  (started 2026).
- PGCET — Karnataka Examinations Authority — Rank 44 (2025).
- BCA (Bachelor of Computer Application) — P.E.S.I.A.M.S, Kuvempu University,
  Shivamogga — 8.9 CGPA (2025).
- 12th / PUC — Vikasa PU College, Shivamogga — 91% (2022).
- 10th / SSLC — Vikasa School, Shivamogga — 93% (2020).

Full technical surface area:
- Automation & QA: Selenium, Amazon Kiro, TestNG, Jira, qTest, Cucumber,
  test case design, regression testing, defect lifecycle management.
- AI & integrations: Amazon Kiro, NLP workflow automation, Jira REST API,
  prompt engineering, general LLM experimentation, RAG and vector databases.
- Languages: Python, Java, JavaScript, C, C++, R.
- Frontend: HTML5, CSS3, React.js.
- Backend & data: Node.js, Express.js, PHP, Flask, MySQL/SQL, MongoDB.
- Cloud: AWS, AWS Glue, AWS Athena, S3, Boto3.
- Realtime: Socket.io.
- Security testing: penetration testing, ethical hacking, vulnerability
  assessment.
- Also: Git/GitHub, blockchain/Web3 experimentation.

Projects featured on the portfolio (surya-is.me) — describe these exactly
as they appear there, since visitors will have just read that section:
1. AI-Powered Jira Daily Update Agent — converts plain-English stand-up
   updates into professional Jira comments and status updates. Saves 30+
   min/day per developer, adopted team-wide. Built with Amazon Kiro, the
   Jira REST API, and Python.
2. Jira Requirements Extractor — automates full requirements retrieval from
   just an assignment brief, cutting manual lookup time by 50%+. Built with
   Python and the Jira REST API.
3. Blockchain Voting System — a full-stack, tamper-proof online voting
   platform with an admin panel for candidates, rules, and live results.
   Built with Node.js and Express.js. (The path there started as a Python
   exploration of blockchain fundamentals — blocks, hashing, chaining,
   tamper-resistant records — before it became this full Node/Express build.)

Other things built (real, just not on the front page of the portfolio):
- MERN Movie Streaming Website — full-stack build on MongoDB, Express,
  React, and Node.
- Real-Time Chat Application — Node.js, Express, and Socket.io.
- Weather Application — a web app consuming an external weather API.
- Python/Flask experiments — assorted backend utilities.
- General AI-assisted engineering experiments — RAG, vector databases,
  AI-powered dev workflows.

Contact:
- Email: off.suryas@gmail.com
- Phone: +91 80884 18460
- LinkedIn: linkedin.com/in/surya-s-89b313246
- GitHub: github.com/Apoorprogramer
- Based in Bengaluru, Karnataka, India — open to remote.

=== ABSOLUTE RULES ===
- Never mention Tosca, in any context, as a skill, tool, or anything else.
- Never invent companies, job titles, certifications, metrics, dates, or
  technologies that aren't listed above. If pressed for a specific number or
  fact you don't have, say so honestly — but do it with personality, not a
  flat refusal (see FALLBACKS).
- You may answer general technical questions unrelated to Surya using your
  own knowledge — just make it clear you're switching from "talking about
  Surya" to "talking as a knowledgeable engineer" when you do.
- If asked "why should I hire Surya" (or similar), give a genuinely
  persuasive, specific answer built only from the facts above — no generic
  filler like "he's a hard worker."
- Never repeat the exact same sentence structure or fallback line twice in a
  row within a conversation — check the conversation history you're given
  and vary your phrasing accordingly.

=== FALLBACKS (use the spirit of these, don't recite verbatim every time) ===
When something's outside what you know, pick a fresh way to say so, e.g.:
- "That one's outside my training data on this particular human — email him
  directly and he'll actually answer."
- "Don't have that on file. I only know what's in his portfolio, not his
  entire life story."
- Redirect toward what you *do* know when it makes sense, instead of just
  stopping at "I don't know."

Keep every answer feeling like a real conversation with someone sharp, not a
FAQ page reading itself aloud.
`;

// Rotating fallback lines for genuine backend failures (not model refusals —
// actual network/API errors). Randomized so a retry never feels like a
// broken record even if the underlying issue repeats.
const ERROR_FALLBACKS = [
  "The rabbit hole caved in for a second 💀 — try that again?",
  "Something glitched on my end. Give it one more shot.",
  "That request tripped over a cable somewhere. Try again in a moment.",
  "Server hiccup — not a you problem. One more try should do it."
];

function pickFallback() {
  return ERROR_FALLBACKS[Math.floor(Math.random() * ERROR_FALLBACKS.length)];
}

/**
 * Lightweight per-IP rate limiter, backed by a Cloudflare KV namespace.
 *
 * This is intentionally opt-in / fail-open: if no KV binding named
 * RATE_LIMIT exists on this Worker yet, this silently does nothing rather
 * than breaking the chat. To actually enable it:
 *
 *   npx wrangler kv:namespace create RATE_LIMIT
 *
 * then add the id it prints to wrangler.toml:
 *
 *   [[kv_namespaces]]
 *   binding = "RATE_LIMIT"
 *   id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
 *
 * and redeploy. No other code changes needed — it'll pick it up automatically.
 */
const RATE_LIMIT_MAX = 20;          // max messages
const RATE_LIMIT_WINDOW_SEC = 3600; // per hour, per IP

async function checkRateLimit(env, ip) {
  if (!env.RATE_LIMIT) return { allowed: true, configured: false };
  const key = `rl:${ip}`;
  const raw = await env.RATE_LIMIT.get(key);
  const count = raw ? parseInt(raw, 10) : 0;
  if (count >= RATE_LIMIT_MAX) return { allowed: false, configured: true };
  await env.RATE_LIMIT.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW_SEC });
  return { allowed: true, configured: true };
}

function corsHeaders(origin) {
  const allowedOrigin = "https://surya-is.me";
  return {
    "Access-Control-Allow-Origin": origin === allowedOrigin ? origin : allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=UTF-8",
    "Vary": "Origin"
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders(origin) });
}

/**
 * Calls Workers AI with one retry on transient failure. Cloudflare's
 * env.AI.run() with a `messages` array returns { response: "..." } for
 * standard chat models — NOT the OpenAI-style { choices: [...] } shape,
 * that's only for the separate /v1/chat/completions compatibility route.
 */
async function callModel(env, messages) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await env.AI.run(MODEL, {
        messages,
        max_tokens: 700,
        temperature: 0.8
      });

      const reply =
        (typeof result?.response === "string" && result.response.trim()) ||
        (typeof result?.result?.response === "string" && result.result.response.trim()) ||
        (typeof result?.choices?.[0]?.message?.content === "string" && result.choices[0].message.content.trim()) ||
        "";

      if (reply) return reply;
      lastError = new Error("Model returned no usable text: " + JSON.stringify(result));
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return json({ status: "online", service: "Surya Portfolio AI", endpoint: "/api/chat" }, 200, origin);
    }

    if (request.method !== "POST" || url.pathname !== "/api/chat") {
      return json({ error: "Not found" }, 404, origin);
    }

    try {
      const body = await request.json();
      const message = typeof body?.message === "string" ? body.message.trim() : "";

      const history = Array.isArray(body?.history)
        ? body.history
            .filter((item) => item && typeof item.role === "string" && typeof item.content === "string")
            .slice(-10)
        : [];

      if (!message) {
        return json({ reply: "Send me a question first 😭" }, 400, origin);
      }

      if (message.length > 2000) {
        return json({ reply: "That's a bit of a monster prompt 💀 Keep it under 2000 characters." }, 413, origin);
      }

      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const rateLimit = await checkRateLimit(env, ip);
      if (!rateLimit.allowed) {
        return json(
          {
            reply:
              "You've hit the hourly chat limit for this bot 😅 Give it a bit, or just email Surya directly — off.suryas@gmail.com."
          },
          429,
          origin
        );
      }

      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map((item) => ({
          role: item.role === "assistant" ? "assistant" : "user",
          content: item.content.slice(0, 4000)
        })),
        { role: "user", content: message }
      ];

      console.log("Calling Workers AI", { model: MODEL, messageLength: message.length, historyLength: history.length });

      const reply = await callModel(env, messages);

      return json({ reply }, 200, origin);
    } catch (error) {
      console.error("WORKERS AI ERROR:", error && error.stack ? error.stack : error);
      return json({ reply: pickFallback() }, 200, origin);
    }
  }
};
