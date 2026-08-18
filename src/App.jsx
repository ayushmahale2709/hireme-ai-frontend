import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SUGGESTIONS = [
  "What are your strongest skills?",
  "Tell me about your experience.",
  "What projects have you worked on?",
  "What is your Java experience?",
  "What AI experience do you have?",
];

const CSS = `
:root, [data-theme="dark"] {
  --bg: #08090c;
  --bg-soft: #0d0f14;
  --surface: #14171f;
  --surface-2: #1a1e28;
  --border: rgba(255,255,255,0.08);
  --text: #e9ecf3;
  --text-dim: #99a0b0;
  --accent: #6d8cff;
  --accent-2: #a06bff;
  --user-bubble: linear-gradient(135deg, #2b3a72, #3a2f6b);
  --user-text: #eef1ff;
  --code-bg: #0b0d12;
  --shadow: 0 10px 40px rgba(0,0,0,0.5);
}

[data-theme="light"] {
  --bg: #f6f7fa;
  --bg-soft: #eef0f6;
  --surface: #ffffff;
  --surface-2: #f2f4f9;
  --border: rgba(10,15,40,0.10);
  --text: #14171f;
  --text-dim: #5b6376;
  --accent: #4c6ef5;
  --accent-2: #8552e6;
  --user-bubble: linear-gradient(135deg, #4c6ef5, #7a5af0);
  --user-text: #ffffff;
  --code-bg: #f0f2f8;
  --shadow: 0 10px 30px rgba(20,30,70,0.08);
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  overflow: hidden;
}

.hm-root {
  width: 100%;
  height: 100dvh;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(
      900px 500px at 80% -10%,
      color-mix(in oklab, var(--accent) 16%, transparent),
      transparent 70%
    ),
    radial-gradient(
      700px 400px at 0% 110%,
      color-mix(in oklab, var(--accent-2) 14%, transparent),
      transparent 70%
    ),
    var(--bg);
  color: var(--text);
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    Inter,
    sans-serif;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  overflow: hidden;
  text-align: left;
}

/* FULL WIDTH FLEXIBLE SHELL */

.hm-shell {
  width: 100%;
  max-width: none;
  height: 100%;
  margin: 0;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0 clamp(16px, 3vw, 48px);
}

/* HEADER */

.hm-header {
  width: 100%;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0 12px;
  border-bottom: 1px solid var(--border);
}

.hm-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.hm-title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.hm-sub {
  font-size: 12px;
  color: var(--text-dim);
  margin-top: 3px;
  letter-spacing: 0.01em;
}

.hm-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-dim);
  margin-left: 10px;
  letter-spacing: 0;
}

.hm-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 0 0 rgba(52,211,153,0.6);
  animation: hm-ping 2.2s infinite;
}

@keyframes hm-ping {
  70% {
    box-shadow: 0 0 0 6px rgba(52,211,153,0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(52,211,153,0);
  }
}

.hm-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
}

.hm-toggle {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition:
    background 0.2s,
    transform 0.15s;
  white-space: nowrap;
}

.hm-toggle:hover {
  background: var(--surface-2);
}

.hm-toggle:active {
  transform: scale(0.96);
}

.hm-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ORB */

.hm-orb {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex: none;

  background:
    radial-gradient(
      circle at 32% 30%,
      #ffffff 0%,
      var(--accent) 38%,
      var(--accent-2) 72%,
      #15121f 100%
    );

  box-shadow:
    0 0 18px
    color-mix(in oklab, var(--accent) 45%, transparent),
    0 0 42px
    color-mix(in oklab, var(--accent-2) 18%, transparent);

  animation: hm-pulse 3.4s ease-in-out infinite;
}

.hm-orb::after {
  content: "";
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1px solid
    color-mix(in oklab, var(--accent) 40%, transparent);
  border-top-color: transparent;
  animation: hm-spin 6s linear infinite;
}

.hm-orb.sm {
  width: 26px;
  height: 26px;
}

.hm-orb.lg {
  width: 76px;
  height: 76px;
}

@keyframes hm-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes hm-spin {
  to {
    transform: rotate(360deg);
  }
}

/* CHAT */

.hm-chat {
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: clamp(20px, 4vh, 48px) 0 8px;
  scroll-behavior: smooth;
  text-align: left;
}

/* WELCOME */

.hm-welcome {
  width: 100%;
  min-height: 100%;
  text-align: center;
  padding: clamp(5vh, 10vh, 12vh) 8px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
}

.hm-welcome h1 {
  font-size: clamp(25px, 3vw, 34px);
  margin: 8px 0 0;
  letter-spacing: -0.025em;
  font-weight: 700;
}

.hm-welcome p {
  margin: 0;
  color: var(--text-dim);
  font-size: clamp(13px, 1.5vw, 15px);
  max-width: 620px;
  line-height: 1.65;
}

.hm-sugg-label {
  margin-top: 18px;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-dim);
}

.hm-chips {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.hm-chip {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  border-radius: 999px;
  padding: 9px 14px;
  font-size: 13px;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s,
    transform 0.15s;
  max-width: 100%;
}

.hm-chip:hover:not(:disabled) {
  background: var(--surface-2);
  border-color: color-mix(
    in oklab,
    var(--accent) 45%,
    var(--border)
  );
}

.hm-chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* MESSAGES */

.hm-msg {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  text-align: left;
  animation: hm-fade 0.28s ease both;
}

@keyframes hm-fade {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.hm-msg.user {
  justify-content: flex-end;
}

.hm-bubble {
  background: var(--user-bubble);
  color: var(--user-text);
  padding: 11px 15px;
  border-radius: 18px 18px 4px 18px;
  max-width: min(78%, 900px);
  font-size: 15px;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  box-shadow: var(--shadow);
  text-align: left;
}

.hm-ai-body {
  min-width: 0;
  flex: 1 1 auto;
  width: 100%;
  max-width: 100%;
  font-size: 15px;
  line-height: 1.7;
  overflow-wrap: anywhere;
  text-align: left;
}

.hm-ai-body.err {
  color: #ff8080;
}

.hm-thinking {
  color: var(--text-dim);
  font-size: 14px;
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.hm-thinking i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--text-dim);
  display: inline-block;
  animation: hm-bounce 1.2s infinite;
}

.hm-thinking i:nth-child(2) {
  animation-delay: 0.15s;
}

.hm-thinking i:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes hm-bounce {
  0%,
  60%,
  100% {
    opacity: 0.3;
    transform: translateY(0);
  }

  30% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

.hm-caret {
  display: inline-block;
  width: 7px;
  height: 15px;
  background: var(--accent);
  margin-left: 2px;
  vertical-align: -2px;
  animation: hm-blink 1s steps(2) infinite;
}

@keyframes hm-blink {
  50% {
    opacity: 0;
  }
}

/* MARKDOWN */

.hm-ai-body h1,
.hm-ai-body h2,
.hm-ai-body h3 {
  font-size: 16px;
  margin: 16px 0 8px;
  letter-spacing: -0.01em;
  text-align: left;
}

.hm-ai-body p {
  margin: 0 0 10px;
  text-align: left;
}

.hm-ai-body ul,
.hm-ai-body ol {
  margin: 0 0 10px;
  padding-left: 20px;
  text-align: left;
}

.hm-ai-body li {
  margin: 4px 0;
  text-align: left;
}

.hm-ai-body strong {
  font-weight: 700;
  color: var(--text);
}

.hm-ai-body a {
  color: var(--accent);
  text-decoration: none;
}

.hm-ai-body a:hover {
  text-decoration: underline;
}

.hm-ai-body code {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 1px 5px;
  font-size: 13px;
  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    monospace;
}

.hm-ai-body pre {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  overflow-x: auto;
  max-width: 100%;
  text-align: left;
  margin: 12px 0;
}

.hm-ai-body pre code {
  background: none;
  border: none;
  padding: 0;
}

.hm-ai-body blockquote {
  margin: 0 0 10px;
  padding-left: 12px;
  border-left: 2px solid var(--border);
  color: var(--text-dim);
  text-align: left;
}

/* MARKDOWN TABLES */

.hm-ai-body table {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  margin: 14px 0;
  font-size: 14px;
  text-align: left;
  display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.hm-ai-body thead,
.hm-ai-body tbody {
  width: 100%;
}

.hm-ai-body th,
.hm-ai-body td {
  border: 1px solid var(--border);
  padding: 9px 12px;
  text-align: left;
  vertical-align: top;
  min-width: 120px;
}

.hm-ai-body th {
  background: var(--surface-2);
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
}

.hm-ai-body td {
  color: var(--text);
}

.hm-ai-body tr:nth-child(even) td {
  background: color-mix(
    in oklab,
    var(--surface-2) 35%,
    transparent
  );
}

/* HORIZONTAL RULE */

.hm-ai-body hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 16px 0;
}

/* COMPOSER */

.hm-composer-wrap {
  width: 100%;
  flex: none;
  padding: 10px 0 18px;
}

.hm-composer {
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 8px 8px 8px 14px;
  box-shadow: var(--shadow);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.hm-composer:focus-within {
  border-color: color-mix(
    in oklab,
    var(--accent) 60%,
    var(--border)
  );

  box-shadow:
    0 0 0 3px
    color-mix(in oklab, var(--accent) 18%, transparent);
}

.hm-composer textarea {
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 15px;
  line-height: 1.5;
  max-height: 140px;
  padding: 6px 0;
  min-width: 0;
  width: 100%;
  text-align: left;
}

.hm-composer textarea::placeholder {
  color: var(--text-dim);
}

.hm-send {
  border: none;
  cursor: pointer;
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    var(--accent),
    var(--accent-2)
  );
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    opacity 0.2s,
    transform 0.15s;
}

.hm-send:hover:not(:disabled) {
  transform: translateY(-1px);
}

.hm-send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.hm-hint {
  text-align: center;
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 8px;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* LARGE DESKTOP */

@media (min-width: 1400px) {
  .hm-shell {
    padding-left: clamp(32px, 5vw, 80px);
    padding-right: clamp(32px, 5vw, 80px);
  }

  .hm-welcome {
    padding-top: 10vh;
  }

  .hm-welcome h1 {
    font-size: 34px;
  }

  .hm-welcome p {
    font-size: 15px;
  }

  .hm-ai-body {
    font-size: 16px;
  }
}

/* TABLET / SMALL LAPTOP */

@media (max-width: 900px) {
  .hm-shell {
    padding: 0 20px;
  }

  .hm-welcome {
    padding-top: 6vh;
  }

  .hm-bubble {
    max-width: 85%;
  }

  .hm-ai-body table {
    font-size: 13px;
  }
}

/* MOBILE */

@media (max-width: 720px) {
  .hm-shell {
    padding: 0 12px;
  }

  .hm-header {
    padding: 12px 0 10px;
    gap: 10px;
  }

  .hm-title {
    font-size: 15px;
  }

  .hm-sub {
    font-size: 11px;
  }

  .hm-welcome {
    padding-top: 5vh;
  }

  .hm-welcome h1 {
    font-size: 21px;
  }

  .hm-welcome p {
    max-width: 90%;
    font-size: 13px;
  }

  .hm-bubble {
    max-width: 88%;
    font-size: 14.5px;
  }

  .hm-chip {
    font-size: 12.5px;
    padding: 8px 12px;
  }

  .hm-hint {
    display: none;
  }

  .hm-composer {
    border-radius: 16px;
  }

  .hm-ai-body table {
    font-size: 12.5px;
  }

  .hm-ai-body th,
  .hm-ai-body td {
    padding: 8px 9px;
    min-width: 110px;
  }
}

/* SMALL MOBILE */

@media (max-width: 500px) {
  .hm-toggle span {
    display: none;
  }

  .hm-toggle {
    padding: 8px 10px;
  }

  .hm-header-actions {
    gap: 6px;
  }

  .hm-brand {
    gap: 9px;
  }

  .hm-orb {
    width: 30px;
    height: 30px;
  }

  .hm-welcome {
    padding-top: 4vh;
  }

  .hm-welcome p {
    max-width: 100%;
  }

  .hm-chip {
    width: auto;
    max-width: 100%;
  }
}

/* VERY SMALL MOBILE */

@media (max-width: 400px) {
  .hm-shell {
    padding: 0 9px;
  }

  .hm-sub {
    display: none;
  }

  .hm-orb.lg {
    width: 58px;
    height: 58px;
  }

  .hm-welcome h1 {
    font-size: 20px;
  }

  .hm-chip {
    width: 100%;
  }

  .hm-ai-body table {
    font-size: 12px;
  }
}

/* REDUCE MOTION */

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
`;

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);
  const taRef = useRef(null);
  const stickRef = useRef(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hireme-theme");

      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      }
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("hireme-theme", theme);
    } catch (e) {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    const el = chatRef.current;

    if (el && stickRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const onScroll = () => {
    const el = chatRef.current;

    if (!el) return;

    stickRef.current =
      el.scrollHeight -
        el.scrollTop -
        el.clientHeight <
      90;
  };

  const autoGrow = () => {
    const el = taRef.current;

    if (!el) return;

    el.style.height = "auto";
    el.style.height =
      Math.min(el.scrollHeight, 140) + "px";
  };

  async function clearChat() {
    try {
      await fetch(
        "https://hireme-ai-backend-3oyh.onrender.com/reset",
        {
          method: "POST",
        }
      );
    } catch (e) {
      console.error(
        "Failed to reset conversation:",
        e
      );
    }

    setMessages([]);
    setInput("");

    if (taRef.current) {
      taRef.current.style.height = "auto";
    }

    stickRef.current = true;
  }

  async function send(raw) {
    const question = (raw ?? input).trim();

    if (!question || loading) return;

    setInput("");

    if (taRef.current) {
      taRef.current.style.height = "auto";
    }

    stickRef.current = true;
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
      {
        role: "ai",
        content: "",
        error: false,
      },
    ]);

    const update = (fn) =>
      setMessages((prev) => {
        const next = prev.slice();
        const last = next[next.length - 1];

        next[next.length - 1] = fn(last);

        return next;
      });

    try {
      const response = await fetch(
        "https://hireme-ai-backend-3oyh.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("bad response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullAnswer = "";

      while (true) {
        const { value, done } =
          await reader.read();

        if (done) {
          fullAnswer += decoder.decode();
          break;
        }

        const chunk = decoder.decode(value, {
          stream: true,
        });

        fullAnswer += chunk;

        update((m) => ({
          ...m,
          content: fullAnswer,
        }));
      }

      if (!fullAnswer.trim()) {
        update(() => ({
          role: "ai",
          content:
            "The agent returned an empty response. Please try again.",
          error: true,
        }));
      }
    } catch (e) {
      update(() => ({
        role: "ai",
        content:
          "Unable to connect to the AI agent.\n\nMake sure the FastAPI backend is running.",
        error: true,
      }));
    } finally {
      setLoading(false);
    }
  }

  const onKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      send();
    }
  };

  const lastIndex = messages.length - 1;

  return (
    <div
      className="hm-root"
      data-theme={theme}
    >
      <style>{CSS}</style>

      <div className="hm-shell">

        <header className="hm-header">

          <div className="hm-brand">

            <div
              className="hm-orb"
              aria-hidden="true"
            />

            <div>
              <div className="hm-title">
                A.R.I.A

                <span className="hm-status">
                  <span className="hm-dot" />
                  Online
                </span>
              </div>

              <div className="hm-sub">
                Ayush's AI Persona
              </div>
            </div>

          </div>

          <div className="hm-header-actions">

            <button
              className="hm-toggle"
              onClick={clearChat}
              disabled={loading}
              aria-label="Start a new chat"
            >
              ↻
              <span>New Chat</span>
            </button>

            <button
              className="hm-toggle"
              onClick={() =>
                setTheme((t) =>
                  t === "dark"
                    ? "light"
                    : "dark"
                )
              }
              aria-label={`Switch to ${
                theme === "dark"
                  ? "light"
                  : "dark"
              } mode`}
            >
              {theme === "dark"
                ? "☀"
                : "☾"}

              <span>
                {theme === "dark"
                  ? "Light"
                  : "Dark"}
              </span>
            </button>

          </div>

        </header>

        <main
          className="hm-chat"
          ref={chatRef}
          onScroll={onScroll}
          aria-live="polite"
        >

          {messages.length === 0 ? (

            <div className="hm-welcome">

              <div
                className="hm-orb lg"
                aria-hidden="true"
              />

              <h1>
                Hi, I'm A.R.I.A
              </h1>

              <p>
                I'm Ayush's AI persona. Ask me
                anything about my skills, projects,
                experience, education, or technical
                background.
              </p>

              <div className="hm-sugg-label">
                Suggested questions
              </div>

              <div className="hm-chips">

                {SUGGESTIONS.map((s) => (

                  <button
                    key={s}
                    className="hm-chip"
                    disabled={loading}
                    onClick={() => send(s)}
                  >
                    {s}
                  </button>

                ))}

              </div>

            </div>

          ) : (

            messages.map((m, i) =>
              m.role === "user" ? (

                <div
                  className="hm-msg user"
                  key={i}
                >
                  <div className="hm-bubble">
                    {m.content}
                  </div>
                </div>

              ) : (

                <div
                  className="hm-msg"
                  key={i}
                >

                  <div
                    className="hm-orb sm"
                    aria-hidden="true"
                  />

                  <div
                    className={
                      "hm-ai-body" +
                      (m.error
                        ? " err"
                        : "")
                    }
                  >

                    {m.content ? (

                      <>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                        >
                          {m.content}
                        </ReactMarkdown>

                        {loading &&
                          i === lastIndex && (
                            <span className="hm-caret" />
                          )}
                      </>

                    ) : (

                      <span className="hm-thinking">
                        A.R.I.A is thinking
                        <i />
                        <i />
                        <i />
                      </span>

                    )}

                  </div>

                </div>

              )
            )

          )}

        </main>

        <div className="hm-composer-wrap">

          <form
            className="hm-composer"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >

            <textarea
              ref={taRef}
              rows={1}
              value={input}
              placeholder="Ask A.R.I.A anything..."
              aria-label="Message A.R.I.A"
              disabled={loading}
              onChange={(e) => {
                setInput(e.target.value);
                autoGrow();
              }}
              onKeyDown={onKeyDown}
            />

            <button
              className="hm-send"
              type="submit"
              aria-label="Send message"
              disabled={
                loading ||
                !input.trim()
              }
            >

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 12l16-8-6 8 6 8-16-8z"
                  fill="currentColor"
                />
              </svg>

            </button>

          </form>

          <div className="hm-hint">
            Enter to send · Shift + Enter for a new line
          </div>

        </div>

      </div>
    </div>
  );
}
