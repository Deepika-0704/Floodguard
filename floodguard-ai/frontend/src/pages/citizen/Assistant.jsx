import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, Bot, User } from "lucide-react";
import api from "../../services/api";
import { Card, SimBadge } from "../../components/ui";

const SUGGESTIONS_EN = ["What's the safe route?", "Nearest shelter?", "Current flood risk?"];
const SUGGESTIONS_HI = ["Safe route kaunsa hai?", "Nearest shelter kahan hai?", "Abhi flood risk kya hai?"];

export default function Assistant() {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "I'm the FloodGuard AI assistant. You can ask me about the safe route, nearest shelter, or the current flood risk in your area." },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(text) {
    const msg = text ?? input;
    if (!msg.trim()) return;
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    const res = await api.assistant({ message: msg, lang }, { reply: "Sorry, I couldn't reach the assistant service right now." });
    setMessages((m) => [...m, { role: "assistant", text: res.reply }]);
  }

  function toggleMic() {
    setListening((v) => !v);
    if (!listening) {
      // Prototype voice UI — simulates a captured voice query (no real speech recognition wired up)
      setTimeout(() => {
        setListening(false);
        send(lang === "hi" ? "Mere area mein safe route kaunsa hai?" : "What's the safe route in my area?");
      }, 1200);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold">🗣️ FloodGuard Assistant</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang("en")} className={`text-xs font-medium px-2.5 py-1 rounded-md ${lang === "en" ? "bg-flood-teal text-white" : "bg-slate-100 text-slate-500"}`}>EN</button>
          <button onClick={() => setLang("hi")} className={`text-xs font-medium px-2.5 py-1 rounded-md ${lang === "hi" ? "bg-flood-teal text-white" : "bg-slate-100 text-slate-500"}`}>हिं</button>
        </div>
      </div>
      <SimBadge>Prototype assistant — generated from application data, no paid LLM required</SimBadge>

      <Card className="p-4 h-[420px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-flood-teal/10 text-flood-teal" : "bg-slate-100 text-slate-500"}`}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`rounded-2xl px-3.5 py-2 text-sm max-w-[80%] ${m.role === "user" ? "bg-flood-teal text-white" : "bg-slate-100 text-slate-700"}`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="flex flex-wrap gap-2 my-2">
          {(lang === "hi" ? SUGGESTIONS_HI : SUGGESTIONS_EN).map((s) => (
            <button key={s} onClick={() => send(s)} className="text-xs bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-slate-600 hover:bg-slate-100">
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <button onClick={toggleMic} className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${listening ? "bg-flood-coral text-white animate-pulse" : "bg-slate-100 text-slate-500"}`}>
            <Mic className="h-4 w-4" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={lang === "hi" ? "Apna sawaal likhein..." : "Type your question..."}
            className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-flood-teal/40"
          />
          <button onClick={() => send()} className="h-9 w-9 rounded-full bg-flood-teal text-white flex items-center justify-center shrink-0">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}
