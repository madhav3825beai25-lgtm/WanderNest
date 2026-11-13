import { useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import "./TravelChat.css";

const api = import.meta.env.VITE_CHAT_API_URL ||
  (import.meta.env.DEV ? import.meta.env.VITE_API_URL || "http://localhost:5000" : "");
const suggestions = ["Plan a weekend in Goa", "Compare Rajasthan and Kashmir packages"];

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
    if (open && log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [open, messages, pending, error]);

  useEffect(() => () => request.current?.abort(), []);

  function close() {
    setOpen(false);
    launcher.current?.focus();
  }

  async function send(text) {
    const question = text.trim();
    if (!question || request.current) return;
    const userMessage = { role: "user", text: question };
    const controller = new AbortController();
    request.current = controller;
    setPending(question);
    setError("");
    setDraft("");

    try {
      const response = await fetch(`${api}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages.slice(-8), userMessage] }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(30_000)]),
      });
      const result = await response.json();
      if (!response.ok || typeof result.reply !== "string") {
        setError(result.error || "Couldn't get a reply. Try again.");
        setDraft(question);
        return;
      }
      setMessages([...messages, userMessage, { role: "assistant", text: result.reply }]);
    } catch {
      if (!controller.signal.aborted) {
        setError("Couldn't reach the travel assistant. Try again.");
        setDraft(question);
      }
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setPending("");
    }
  }

  return (
    <div className="travel-chat" onKeyDown={(event) => {
      if (open && event.key === "Escape") close();
    }}>
      {open && (
        <section className="travel-chat__panel" id="travel-chat-panel" aria-labelledby="travel-chat-title">
          <header className="travel-chat__header">
            <h2 id="travel-chat-title">WanderNest AI travel assistant</h2>
            <button type="button" aria-label="Close travel chat" onClick={close}><FiX /></button>
          </header>
          <div className="travel-chat__log" ref={log} role="log" aria-label="Chat messages">
            <p className="travel-chat__message">Where would you like to go? Ask me for trip ideas, itineraries, or help comparing packages.</p>
            {messages.map(({ role, text }, index) => (
              <p key={index} className={`travel-chat__message travel-chat__message--${role}`}>
                <span className="travel-chat__speaker">{role === "user" ? "You" : "Assistant"}</span>
                {text}
              </p>
            ))}
            {pending && (
              <>
                <p className="travel-chat__message travel-chat__message--user">
                  <span className="travel-chat__speaker">You</span>{pending}
                </p>
                <p className="travel-chat__status">Assistant is typing…</p>
              </>
            )}
            {error && <p role="alert" className="travel-chat__error">{error}</p>}
            {!messages.length && !pending && !error && (
              <div className="travel-chat__suggestions">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => {
                    input.current?.focus();
                    send(suggestion);
                  }}>{suggestion}</button>
                ))}
              </div>
            )}
          </div>
          <form className="travel-chat__form" onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}>
            <input ref={input} aria-label="Travel question" placeholder="Ask a travel question" value={draft}
              onChange={(event) => setDraft(event.target.value)} maxLength={1000} readOnly={Boolean(pending)} />
            <button type="submit" disabled={Boolean(pending) || !draft.trim()} aria-label="Send message"><FiSend /></button>
          </form>
        </section>
      )}
      <button className="travel-chat__launcher" ref={launcher} type="button" aria-expanded={open}
        aria-controls={open ? "travel-chat-panel" : undefined} onClick={() => open ? close() : setOpen(true)}>
        <FiMessageCircle aria-hidden="true" /> Ask WanderNest
      </button>
    </div>
  );
}
