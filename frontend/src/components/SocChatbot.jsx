import { useMemo, useRef, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  Accept: "application/json",
  "Content-Type": "application/json",
});

const initialMessages = [
  {
    id: crypto.randomUUID(),
    sender: "bot",
    text: 'SOC assistant online. Try "hello", "any attacks today?", or "what should I do?"',
  },
];

export default function SocChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const pushMessage = (message) => {
    setMessages((current) => [...current, { id: crypto.randomUUID(), ...message }]);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    await submitMessage(input);
  };

  const submitMessage = async (rawText) => {
    if (loading) return;
    const text = rawText.trim();
    if (!text) return;

    setInput("");
    pushMessage({ sender: "user", text });
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE}/soc-chatbot/message`,
        { message: text },
        { headers: authHeaders() }
      );

      pushMessage({
        sender: "bot",
        text: data.message,
        action: data.action,
      });
    } catch (error) {
      const text =
        error.response?.data?.message ??
        "Unable to contact the SOC assistant. Please check your session and API server.";
      pushMessage({ sender: "bot", text });
    } finally {
      setLoading(false);
    }
  };

  const executeBlockIp = async (ip) => {
    pushMessage({ sender: "user", text: `Execute mitigation: block ${ip}` });
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE}/block-ip`,
        { ip },
        { headers: authHeaders() }
      );

      pushMessage({
        sender: "bot",
        text: data.message ?? `IP ${ip} has been successfully banned for 1 hour.`,
      });
    } catch (error) {
      const text =
        error.response?.data?.message ??
        `Failed to block IP ${ip}. Please try again or check server logs.`;
      pushMessage({ sender: "bot", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="soc-chatbot">
      {open && (
        <section className="soc-chatbot-panel">
          <header className="soc-chatbot-header">
            <div>
              <h2>AI SOC Chatbot</h2>
              <p>Threat triage and mitigation assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="soc-chatbot-close"
              aria-label="Close SOC chatbot"
            >
              X
            </button>
          </header>

          <div className="soc-chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`soc-chatbot-row ${message.sender === "user" ? "user" : "bot"}`}
              >
                <div className={`soc-chatbot-bubble ${message.sender}`}>
                  <p>{message.text}</p>
                  {message.action?.action === "BLOCK_IP" && (
                    <button
                      type="button"
                      onClick={() => executeBlockIp(message.action.ip)}
                      disabled={loading}
                      className="soc-chatbot-mitigation"
                    >
                      🛡️ Execute Mitigation: Block IP {message.action.ip}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="soc-chatbot-row bot">
                <div className="soc-chatbot-bubble bot">
                  Analyzing security telemetry...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={sendMessage} className="soc-chatbot-form">
            <div className="soc-chatbot-input-row">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about incidents..."
                className="soc-chatbot-input"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="soc-chatbot-send"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="soc-chatbot-toggle"
        aria-label="Open AI SOC chatbot"
      >
        🛡️
      </button>
    </div>
  );
}
