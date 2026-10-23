import { useEffect, useRef, useState, type FormEvent } from "react";
import Icon from "../components/Icon";
import { createMessage, sendChatMessage, usesMockApi } from "../services/api";
import type { ChatMessage } from "../types/insurance";

const suggestedQuestions = [
  "What plans can I compare?",
  "How do I check renewal eligibility?",
  "Can I update my policy address?",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", "Hi! I’m your HealthBridge guide. I can help you find demo plans, look up a fictional policy, or explain how the renewal check works. What can I help with?"),
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = async (text = draft) => {
    const content = text.trim();
    if (!content || loading) return;
    setDraft("");
    setError("");
    setMessages((current) => [...current, createMessage("user", content)]);
    setLoading(true);
    try {
      const reply = await sendChatMessage(content);
      setMessages((current) => [...current, createMessage("assistant", reply)]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The assistant couldn't respond. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section assistant-page">
      <div className="page-heading">
        <div className="eyebrow">A FRIENDLY PLACE TO START</div>
        <h1>Ask HealthBridge AI</h1>
        <p>Get help finding your way around the HealthBridge demo.</p>
      </div>
      <div className="chat-layout">
        <div className="chat-card">
          <div className="chat-header">
            <div className="assistant-avatar"><Icon name="sparkles" size={21} /></div>
            <div><strong>HealthBridge guide</strong><span><i /> Here to help</span></div>
            <span className="chat-demo-chip">{usesMockApi ? "DEMO MODE" : "CONNECTED"}</span>
          </div>
          <div className="chat-messages" role="log" aria-live="polite" aria-label="Conversation">
            {messages.map((message) => (
              <div className={`message-row ${message.role}`} key={message.id}>
                {message.role === "assistant" && <div className="message-avatar"><Icon name="sparkles" size={15} /></div>}
                <div className="message-bubble">
                  {message.role === "assistant" && <span className="message-sender">HealthBridge AI</span>}
                  <p>{message.content}</p>
                </div>
                {message.role === "user" && <div className="message-user-avatar">Y</div>}
              </div>
            ))}
            {loading && <div className="message-row assistant"><div className="message-avatar"><Icon name="sparkles" size={15} /></div><div className="message-bubble typing-bubble"><span /><span /><span /><span className="visually-hidden">Assistant is responding</span></div></div>}
            <div ref={bottomRef} />
          </div>
          {messages.length === 1 && <div className="suggested-prompts"><span>TRY ASKING</span>{suggestedQuestions.map((question) => <button key={question} onClick={() => send(question)}>{question}<Icon name="arrow" size={14} /></button>)}</div>}
          {error && <div className="chat-error" role="alert"><Icon name="alert" size={16} /><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss error"><Icon name="close" size={15} /></button></div>}
          <form className="chat-input-area" onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void send(); }}>
            <label className="visually-hidden" htmlFor="chat-input">Your message</label>
            <input id="chat-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask me anything about this demo…" disabled={loading} />
            <button className="chat-send" type="submit" disabled={!draft.trim() || loading} aria-label="Send message"><Icon name="send" size={18} /></button>
          </form>
          <div className="chat-disclaimer"><Icon name="lock" size={13} /> Please don't share real personal, policy, or health information.</div>
        </div>
        <aside className="chat-side-info">
          <div className="chat-side-card"><span className="eyebrow">WHAT I CAN HELP WITH</span><div><Icon name="shield" size={18} /><span>Compare fictional health plans</span></div><div><Icon name="file" size={18} /><span>Find your way to policy details</span></div><div><Icon name="refresh" size={18} /><span>Understand the renewal demo</span></div></div>
          <div className="chat-side-note"><Icon name="alert" size={17} /><p>I’m a demo assistant, not a healthcare professional, insurer, or source of medical advice.</p></div>
        </aside>
      </div>
    </section>
  );
}
