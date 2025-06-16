// main.ts
import { Application, Router, send } from "https://deno.land/x/oak@v17.1.4/mod.ts";
import "jsr:@std/dotenv/load"; // For local development, loads .env file

// Load API Key from .env (for local testing) or environment (for Deno Deploy).
const api_key = Deno.env.get("OPENAI_API_KEY");
if (!api_key) {
  // This warning is now more critical as OpenAI API requires a key.
  // On Deno Deploy, ensure you set OPENAI_API_KEY in your project settings.
  console.error("❌ OPENAI_API_KEY is not set. This is required for OpenAI API calls.");
  // In a production app, you might want to throw an error or exit here.
}

const app = new Application();
const router = new Router();

// --- Rate Limiting Configuration ---
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;    // Max 15 requests per minute per IP

// Map to store request counts for each IP address
const ipRequestCounts = new Map<string, { count: number; lastReset: number }>();

// --- Rate Limiting Middleware ---
app.use(async (ctx, next) => {
    const ip = ctx.request.ip; // Get client IP address

    let entry = ipRequestCounts.get(ip);

    // If no entry, or window has expired, reset count
    if (!entry || (Date.now() - entry.lastReset > RATE_LIMIT_WINDOW_MS)) {
        entry = { count: 1, lastReset: Date.now() };
        ipRequestCounts.set(ip, entry);
    } else {
        // Increment count within the current window
        entry.count++;
        ipRequestCounts.set(ip, entry);
    }

    if (entry.count > MAX_REQUESTS_PER_WINDOW) {
        console.warn(`❌ Rate limit exceeded for IP: ${ip}. Request count: ${entry.count}`);
        ctx.response.status = 429; // Too Many Requests
        const timeLeftMs = RATE_LIMIT_WINDOW_MS - (Date.now() - entry.lastReset);
        ctx.response.body = { 
            reply: `Too many requests. Please try again after ${Math.ceil(timeLeftMs / 1000)} seconds.`,
            error: "rate_limited" // Add an error type for frontend handling
        };
        return; // Stop further processing for this request
    }

    await next(); // Continue to the next middleware (router)
});

// Serve static frontend files (e.g., index.html, styles.css) from the 'static' directory.
app.use(async (ctx, next) => {
  try {
    await send(ctx, ctx.request.url.pathname, {
      root: `${Deno.cwd()}/static`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

// Handle user queries by forwarding them to OpenAI.
router.post("/ask", async (ctx) => {
  if (!api_key) {
      ctx.response.status = 500;
      ctx.response.body = { reply: "AI service not configured: API key missing.", error: "api_key_missing" };
      return;
  }

  try {
    const body = ctx.request.body;
    const { messages } = await body.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      ctx.response.status = 400; // Bad Request
      ctx.response.body = { reply: "Messages array cannot be empty or invalid.", error: "invalid_input" };
      return;
    }

    const sanitizedMessages = messages.filter(msg => 
        typeof msg === 'object' && 
        typeof msg.role === 'string' && 
        typeof msg.content === 'string'
    );
    
    if (sanitizedMessages.length === 0) {
        ctx.response.status = 400;
        ctx.response.body = { reply: "Invalid message format in history.", error: "invalid_format" };
        return;
    }

    console.log("🟢 Received messages history:", sanitizedMessages);

    // --- Optional: Trim chat history to manage LLM context window and token usage ---
    const MAX_HISTORY_MESSAGES = 10; // Keep the last 10 messages (5 user, 5 assistant pairs)
    const trimmedHistory = sanitizedMessages.slice(Math.max(0, sanitizedMessages.length - MAX_HISTORY_MESSAGES));

    // Construct the full messages array for OpenAI, including a system prompt
    const messagesForLLM = [
      { role: "system", content: "You are a helpful assistant." },
      ...trimmedHistory,
    ];

    // --- Change: Forward the message to OpenAI's API ---
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${api_key}`, // Add OpenAI API key
      },
      body: JSON.stringify({
        model: "gpt-3.5", // You can change this to "gpt-4o", "gpt-4-turbo", etc., depending on your OpenAI access
        messages: messagesForLLM, 
        temperature: 0.7,
        stream: false,
      }),
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ OpenAI API error: ${response.status} - ${errorText}`);
        ctx.response.status = 502; // Bad Gateway
        ctx.response.body = { reply: `Failed to get response from OpenAI API: ${response.status}.`, error: "openai_api_error" };
        return;
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content?.trim() || "Sorry, I didn't get a coherent response from the AI.";

    // --- Post-process the reply to remove <think> tags (if model still generates them) ---
    const thinkPattern = /<think>.*?<\/think>/gms;
    reply = reply.replace(thinkPattern, '').trim();

    ctx.response.status = 200; // OK
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = { reply };

  } catch (err) {
    console.error("❌ Error in /ask endpoint:", err);
    ctx.response.status = 500; // Internal Server Error
    ctx.response.body = { reply: "Server error. Please try again.", error: "server_error" };
  }
});

// Register router middleware.
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 8000;
console.log(`🚀 Server running at http://localhost:${PORT}`);
console.log(`💡 Now configured to use OpenAI API.`);
console.log(`🔑 Ensure OPENAI_API_KEY is set in your .env for local testing, or as a secret in Deno Deploy.`);
await app.listen({ port: PORT });