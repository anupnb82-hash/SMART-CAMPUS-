import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2, 
  RefreshCw, 
  GraduationCap, 
  Code2, 
  Zap, 
  User, 
  Cpu, 
  Check, 
  ChevronDown,
  Layers,
  MessageSquare
} from 'lucide-react';
import { 
  ChatMessage, 
  GeminiModelType, 
  CAMPUS_AI_PERSONAS, 
  ChatRolePersona, 
  sendGeminiChatMessage 
} from '../services/geminiService';
import { auth, db } from '../firebase/config';
import { collection, addDoc, doc, setDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

interface GeminiCampusBotProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: { id: number | string; username: string; email: string; role?: string } | null;
}

export const GeminiCampusBot: React.FC<GeminiCampusBotProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [selectedPersona, setSelectedPersona] = useState<ChatRolePersona>(CAMPUS_AI_PERSONAS[0]);
  const [selectedModel, setSelectedModel] = useState<GeminiModelType>(CAMPUS_AI_PERSONAS[0].recommendedModel);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Conversation History
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: `Hello! I am your **${CAMPUS_AI_PERSONAS[0].name}** powered by **${CAMPUS_AI_PERSONAS[0].recommendedModel}**.\n\nI can analyze waitlist queues, solve concurrency challenges, recommend alternative classrooms, and explain our 15-minute grace period scanner. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: CAMPUS_AI_PERSONAS[0].recommendedModel,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // When persona changes, update selected model to its recommendation
  const handleSelectPersona = (persona: ChatRolePersona) => {
    setSelectedPersona(persona);
    setSelectedModel(persona.recommendedModel);
    
    // Add persona transition message
    const transitionMsg: ChatMessage = {
      id: `persona-${Date.now()}`,
      role: 'model',
      text: `Switched persona to **${persona.name}** using **${persona.recommendedModel}**.\n*System Instruction:* "${persona.systemInstruction.slice(0, 120)}..."\n\nAsk me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: persona.recommendedModel,
    };
    setMessages(prev => [...prev, transitionMsg]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const replyText = await sendGeminiChatMessage({
        model: selectedModel,
        systemInstruction: selectedPersona.systemInstruction,
        history: [...messages, userMsg],
        message: text.trim(),
      });

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      };

      setMessages(prev => [...prev, modelMsg]);

      // If user is authenticated with Firebase Auth, optionally persist thread to Firestore
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const sessionsCol = collection(userDocRef, 'chat_sessions');
          await addDoc(sessionsCol, {
            userQuery: userMsg.text,
            aiReply: replyText,
            persona: selectedPersona.name,
            model: selectedModel,
            createdAt: serverTimestamp(),
          });
        } catch (fErr) {
          console.warn('Firestore chat history sync notice:', fErr);
        }
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          text: `Error contacting Gemini API: ${err?.message || 'Could not reach model.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Conversation reset. Active persona is **${selectedPersona.name}** powered by **${selectedModel}**. How can I assist you?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${
      isExpanded 
        ? 'inset-4 md:inset-10 rounded-2xl' 
        : 'bottom-4 right-4 w-[95vw] sm:w-[460px] h-[640px] rounded-2xl'
    }`}>
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                Gemini Campus AI
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Multi-Turn
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-[220px]">
              {selectedPersona.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearHistory}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Reset conversation history"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title={isExpanded ? 'Restore window' : 'Expand window'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Close chatbot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Persona and Model Selectors Bar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 space-y-2">
        {/* Persona Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {CAMPUS_AI_PERSONAS.map(persona => {
            const isSelected = selectedPersona.id === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => handleSelectPersona(persona)}
                className={`px-2.5 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {persona.id === 'rescue-specialist' && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                {persona.id === 'academic-advisor' && <GraduationCap className="w-3.5 h-3.5 text-sky-400" />}
                {persona.id === 'oop-mentor' && <Code2 className="w-3.5 h-3.5 text-purple-400" />}
                {persona.id === 'quick-concierge' && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{persona.name.replace('Smart Campus ', '')}</span>
              </button>
            );
          })}
        </div>

        {/* Explicit Model Selector as requested */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/80 text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            Gemini Engine:
          </span>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedModel('gemini-4-argon')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                selectedModel === 'gemini-4-argon'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="gemini-4-argon: For particularly complex tasks"
            >
              gemini-4-argon (Complex)
            </button>
            <button
              onClick={() => setSelectedModel('gemini-3.8-flash')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                selectedModel === 'gemini-3.8-flash'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="gemini-3.8-flash: For general tasks"
            >
              gemini-3.8-flash (General)
            </button>
            <button
              onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                selectedModel === 'gemini-3.1-flash-lite'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="gemini-3.1-flash-lite: For tasks that should happen fast"
            >
              gemini-3.1-flash-lite (Fast)
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                isUser 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
              }`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1.5 shadow-xs ${
                isUser 
                  ? 'bg-indigo-600 text-white rounded-tr-xs' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-tl-xs'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div className={`flex items-center justify-between gap-3 text-[10px] pt-1 border-t ${
                  isUser ? 'border-white/20 text-indigo-200' : 'border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  <span>{msg.timestamp}</span>
                  {!isUser && msg.modelUsed && (
                    <span className="font-mono bg-white/40 dark:bg-slate-900/60 px-1.5 py-0.5 rounded">
                      {msg.modelUsed}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-mono text-slate-400 ml-1">Thinking with {selectedModel}...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          <span className="text-slate-400 shrink-0 font-medium">Try:</span>
          {selectedPersona.suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 rounded-lg whitespace-nowrap transition-colors cursor-pointer"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Ask ${selectedPersona.name}...`}
          className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isTyping}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-sm cursor-pointer"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
