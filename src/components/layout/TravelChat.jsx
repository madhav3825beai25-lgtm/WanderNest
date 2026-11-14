import { useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import "../../styles/TravelChat.css";

const apiBase =
  import.meta.env.VITE_CHAT_API_URL ||
  (import.meta.env.DEV
    ? import.meta.env.VITE_API_URL || "http://localhost:5000"
    : "");

const chatUrl = `${apiBase.replace(/\/+$/, "")}/api/chat`;

const suggestions = [
  "Plan a weekend in Goa",
  "Compare Rajasthan and Kashmir packages",
];

export default function TravelChat() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");

  const launcher = useRef(null);
  const input = useRef(null);
  const log = useRef(null);
  const request = useRef(null);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open && log.current) {
      log.current.scrollTop = log.current.scrollHeight;
    }
  }, [open, messages, pending, error]);

  useEffect(() => () => request.current?.abort(), []);

  function closeChat() {
    setOpen(false);
    launcher.current?.focus();
  }

  async function sendMessage(text) {
    const question = text.trim();
    if (!question || request.current) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 30_000);
    const userMessage = { role: "user", text: question };

    request.current = controller;
    setPending(question);
    setDraft("");
    setError("");

    try {
      const response = await fetch(chatUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages.slice(-8), userMessage],
        }),
        signal: controller.signal,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || typeof result?.reply !== "string") {
        setError(result?.error || "Couldn't get a reply. Please try again.");
        setDraft(question);
        return;
      }

      setMessages((previous) => [
        ...previous,
        userMessage,
        { role: "assistant", text: result.reply },
      ]);
    } catch {
      setError("Couldn't reach the travel assistant. Please try again.");
      setDraft(question);
    } finally {
      window.clearTimeout(timer);
      request.current = null;
      setPending("");
    }
  }

  return (
    <div
      className="travel-chat"
      onKeyDown={(event) => {
        if (open && event.key === "Escape") closeChat();
      }}
    >
      {open && (
        <section
          id="travel-chat-panel"
          className="travel-chat__panel"
          aria-labelledby="travel-chat-title"
        >
          <header className="travel-chat__header">
            <h2 id="travel-chat-title">WanderNest AI travel assistant</h2>
            <button type="button" onClick={closeChat} aria-label="Close chat">
              <FiX aria-hidden="true" />
            </button>
          </header>

          <div className="travel-chat__log" ref={log} role="log" aria-label="Chat messages">
            <p className="travel-chat__message">
              Where would you like to go? Ask me for trip ideas, itineraries,
              or help comparing packages.
            </p>

            {messages.map((message, index) => (
              <p
                key={index}
                className={`travel-chat__message travel-chat__message--${message.role}`}
              >
                <strong>{message.role === "user" ? "You" : "Assistant"}</strong>
                {message.text}
              </p>
            ))}

            {pending && (
              <>
                <p className="travel-chat__message travel-chat__message--user">
                  <strong>You</strong>
                  {pending}
                </p>
                <p className="travel-chat__status">Assistant is typing…</p>
              </>
            )}

            {error && <p className="travel-chat__error" role="alert">{error}</p>}

            {!messages.length && !pending && !error && (
              <div className="travel-chat__suggestions">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      input.current?.focus();
                      sendMessage(suggestion);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="travel-chat__form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(draft);
            }}
          >
            <input
              ref={input}
              aria-label="Travel question"
              placeholder="Ask a travel question"
              maxLength={1000}
              value={draft}
              readOnly={Boolean(pending)}
              onChange={(event) => setDraft(event.target.value)}
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={Boolean(pending) || !draft.trim()}
            >
              <FiSend aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        ref={launcher}
        className="travel-chat__launcher"
        type="button"
        aria-expanded={open}
        aria-controls={open ? "travel-chat-panel" : undefined}
        onClick={() => {
          if (open) closeChat();
          else setOpen(true);
        }}
      >
        <FiMessageCircle aria-hidden="true" />
        Ask WanderNest
      </button>
    </div>
  );
}