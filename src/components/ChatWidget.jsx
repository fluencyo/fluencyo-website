import { useState, useEffect, useRef } from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://api.fluencyo.com/api";

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("intake");
  const [form, setForm] = useState({ name: "", email: "", country: "", uid: "", message: "" });
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [starting, setStarting] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const pollRef = useRef(null);
  const fileInputRef = useRef(null);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const canStart = form.name.trim() && form.email.trim() && form.message.trim();

  const startChat = async () => {
    if (!canStart) return;
    setStarting(true);
    try {
      const res = await fetch(`${API_URL}/website-chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setChatId(data.chatId);
      setStage("chat");
      setMessages([{ sender: "user", message: form.message }]);
    } catch {
      alert("Could not start chat — please try again.");
    } finally {
      setStarting(false);
    }
  };

  const sendReply = async () => {
    if ((!reply.trim() && !attachment) || !chatId) return;
    setSending(true);
    const text = reply.trim();
    const file = attachment;
    setReply("");
    setAttachment(null);
    setMessages((m) => [...m, { sender: "user", message: text, attachment_url: file ? URL.createObjectURL(file) : null, created_at: new Date().toISOString() }]);
    try {
      const fd = new FormData();
      fd.append("message", text);
      if (file) fd.append("attachment", file);
      await fetch(`${API_URL}/website-chat/${chatId}/message`, { method: "POST", body: fd });
    } catch {
      // local message still shows; next poll resyncs from server either way
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (stage !== "chat" || !chatId) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/website-chat/${chatId}/messages`);
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
      } catch {}
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [stage, chatId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const isImage = (file) => file && file.type.startsWith("image/");

  return (
    <>
      <button style={s.bubble} onClick={() => setOpen((o) => !o)}>
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div style={s.panel}>
          <div style={s.header}>
            <div style={s.headerTitle}>Chat with Fluencyo</div>
            <div style={s.headerSub}>We usually reply in a few minutes</div>
          </div>

          {stage === "intake" ? (
            <div style={s.body}>
              <input style={s.input} placeholder="Your name" value={form.name} onChange={update("name")} />
              <input style={s.input} placeholder="Email" value={form.email} onChange={update("email")} type="email" />
              <input style={s.input} placeholder="Country (optional)" value={form.country} onChange={update("country")} />
              <input style={s.input} placeholder="UID, if you have an account (optional)" value={form.uid} onChange={update("uid")} />
              <textarea style={{ ...s.input, minHeight: 70, resize: "vertical" }} placeholder="How can we help?" value={form.message} onChange={update("message")} />
              <button style={s.sendBtn} disabled={!canStart || starting} onClick={startChat}>
                {starting ? "Starting…" : "Start Chat"}
              </button>
            </div>
          ) : (
            <>
              <div style={s.messages} ref={scrollRef}>
                {messages.map((m, i) => (
                  <div key={i} style={m.sender === "admin" ? s.msgAdmin : s.msgUser}>
                    {m.attachment_url && (
                      m.attachment_url.match(/\.(jpg|jpeg|png|gif|webp)/i) || (attachment && isImage(attachment)) ? (
                        <img src={m.attachment_url} alt="attachment" style={s.attachImg} />
                      ) : (
                        <a href={m.attachment_url} target="_blank" rel="noreferrer" style={s.attachLink}>📎 Attachment</a>
                      )
                    )}
                    {m.message && <div>{m.message}</div>}
                  </div>
                ))}
              </div>

              {attachment && (
                <div style={s.attachPreview}>
                  📎 {attachment.name}
                  <button style={s.attachRemove} onClick={() => setAttachment(null)}>✕</button>
                </div>
              )}

              <div style={s.inputRow}>
                <button style={s.attachBtn} onClick={() => fileInputRef.current?.click()} title="Attach a file">📎</button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={(e) => setAttachment(e.target.files[0] || null)}
                />
                <input
                  style={{ ...s.input, marginBottom: 0, flex: 1 }}
                  placeholder="Type a message…"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendReply()}
                />
                <button style={s.sendIconBtn} onClick={sendReply} disabled={sending || (!reply.trim() && !attachment)}>→</button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

const s = {
  bubble: { position: "fixed", bottom: 24, right: 24, width: 58, height: 58, borderRadius: "50%", background: "#4A22CC", color: "#fff", border: "none", fontSize: 24, cursor: "pointer", boxShadow: "0 8px 24px rgba(74,34,224,.4)", zIndex: 999 },
  panel: { position: "fixed", bottom: 96, right: 24, width: 400, height: 640, maxHeight: "80vh", background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,.25)", display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 999, fontFamily: "Inter, sans-serif" },
  header: { background: "linear-gradient(135deg,#4A22CC,#6B2BE0)", color: "#fff", padding: "18px 20px", flexShrink: 0 },
  headerTitle: { fontFamily: "Nunito, sans-serif", fontSize: 15, fontWeight: 900 },
  headerSub: { fontSize: 11.5, opacity: 0.8, marginTop: 2 },
  body: { padding: 18, overflowY: "auto" },
  input: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #ECE7F8", fontSize: 13, marginBottom: 10, boxSizing: "border-box", fontFamily: "inherit" },
  sendBtn: { width: "100%", background: "#4A22CC", color: "#fff", border: "none", borderRadius: 100, padding: 12, fontWeight: 800, fontSize: 13.5, cursor: "pointer" },
  messages: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 8 },
  msgUser: { alignSelf: "flex-end", background: "#4A22CC", color: "#fff", padding: "9px 13px", borderRadius: "14px 14px 4px 14px", fontSize: 13, maxWidth: "80%" },
  msgAdmin: { alignSelf: "flex-start", background: "#F7F5FF", color: "#150636", padding: "9px 13px", borderRadius: "14px 14px 14px 4px", fontSize: 13, maxWidth: "80%" },
  attachImg: { maxWidth: "100%", borderRadius: 10, display: "block", marginBottom: 4 },
  attachLink: { color: "inherit", textDecoration: "underline", display: "block", marginBottom: 4, fontSize: 12.5 },
  attachPreview: { display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", fontSize: 12, color: "#5C5470", borderTop: "1px solid #ECE7F8" },
  attachRemove: { background: "none", border: "none", cursor: "pointer", color: "#E11D48", fontSize: 12, marginLeft: "auto" },
  inputRow: { display: "flex", gap: 8, padding: 14, borderTop: "1px solid #ECE7F8", alignItems: "center", flexShrink: 0 },
  attachBtn: { background: "#F7F5FF", border: "1.5px solid #ECE7F8", borderRadius: 10, width: 38, height: 38, fontSize: 16, cursor: "pointer", flexShrink: 0 },
  sendIconBtn: { background: "#4A22CC", color: "#fff", border: "none", borderRadius: 10, width: 38, height: 38, fontSize: 16, cursor: "pointer", flexShrink: 0 },
};

export default ChatWidget;