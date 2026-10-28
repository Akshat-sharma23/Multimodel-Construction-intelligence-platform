import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Loader2,
  AlertTriangle,
  RotateCcw,
  Tag,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';

export const AssistantPage: React.FC = () => {
  const { forceDemoMode, showToast } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hello! I am your AI Construction Intelligence Assistant. I can assist with concrete mix design, curing standards (ASTM/IS), site safety regulations (OSHA 1926), structural defect diagnostics, and daily site report formatting. How can I support your project today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [followups, setFollowups] = useState<string[]>([
    'What is the standard curing time for M30 concrete slabs?',
    'Explain OSHA scaffolding guardrail height requirements',
    'How do I distinguish structural shear cracks from shrinkage?',
    'What are the key causes of construction schedule delays?'
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      setLoading(true);
      const res = await api.chatAssistant(text, messages, forceDemoMode);
      setSessionId(res.session_id);

      const botMsg: ChatMessage = {
        role: 'assistant',
        content: res.response_text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      if (res.technical_concepts && res.technical_concepts.length > 0) {
        setConcepts(res.technical_concepts);
      }
      if (res.suggested_followups && res.suggested_followups.length > 0) {
        setFollowups(res.suggested_followups);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to communicate with AI Assistant.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat history cleared. How can I assist with your construction engineering tasks?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setConcepts([]);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-7.5rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-brand-600" />
            AI Construction Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Engineering consultation for specifications, OSHA/HSE standards, materials, and delay management.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* Messages Container */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? 'bg-brand-600 text-white'
                      : 'bg-navy-900 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-brand-400" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  <div className={`text-[10px] ${isUser ? 'text-brand-200 text-right' : 'text-slate-400'}`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-3xl mr-auto">
              <div className="w-8 h-8 rounded-full shrink-0 bg-navy-900 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 text-brand-400" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                <span>Reviewing civil engineering standards and synthesis...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Technical Concepts Badges */}
        {concepts.length > 0 && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
              <Tag className="w-3 h-3" /> Core Concepts:
            </span>
            {concepts.map((c, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shrink-0">
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Suggested Prompt Chips */}
        {followups.length > 0 && (
          <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 text-[11px] font-medium shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Suggested:
            </span>
            {followups.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-brand-50 hover:text-brand-700 hover:border-brand-300 border border-slate-200 text-slate-600 text-[11px] shrink-0 transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about concrete curing, excavation safety, rebar spacing, schedule delay mitigations..."
            className="flex-1 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <button
            type="button"
            disabled={!input.trim() || loading}
            onClick={() => handleSend()}
            className="p-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white transition shadow"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advisory Footer */}
      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 px-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>
          AI responses provide preliminary decision-support. Safety-critical construction practices and structural repairs must be verified by licensed civil engineers.
        </span>
      </div>
    </div>
  );
};
