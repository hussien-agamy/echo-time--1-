
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, X, Send, Sparkles, Loader2, Globe } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });








export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
  { role: 'assistant', content: "Hi! I'm Echo, your helper. Ask me about skills or find places with Maps mode!" }]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('thinking');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      if (mode === 'maps') {
        let latLng = { latitude: 0, longitude: 0 };
        try {
          const pos = await new Promise((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej)
          );
          latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        } catch (e) {
          console.warn("Location denied, using default");
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userMsg,
          config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
              retrievalConfig: { latLng }
            }
          }
        });

        const text = response.text || "I found some places for you.";
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const urls = groundingChunks.
        filter((c) => c.maps).
        map((c) => ({ title: c.maps.title, uri: c.maps.uri }));

        setMessages((prev) => [...prev, { role: 'assistant', content: text, type: 'maps', urls }]);
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: userMsg,
          config: {
            thinkingConfig: { thinkingBudget: 32768 },
            systemInstruction: "You are Echo, the AI assistant for 'Echo Time', a skill exchange platform. Help users trade time and build reputation. Keep it simple and helpful. English B1 level."
          }
        });

        setMessages((prev) => [...prev, { role: 'assistant', content: response.text || "Sorry, try again." }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: "Something went wrong. Try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ?
      <div className="bg-white w-[90vw] md:w-96 h-[500px] rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(30,64,175,0.4)] border border-blue-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="p-6 bg-blue-600 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest">Echo Assistant</h4>
                <div className="flex gap-2 mt-1">
                  <button
                  onClick={() => setMode('thinking')}
                  className={`text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded ${mode === 'thinking' ? 'bg-white text-blue-600 shadow-sm' : 'bg-blue-500 text-blue-100'}`}>
                  
                    Chat
                  </button>
                  <button
                  onClick={() => setMode('maps')}
                  className={`text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded ${mode === 'maps' ? 'bg-white text-blue-600 shadow-sm' : 'bg-blue-500 text-blue-100'}`}>
                  
                    Maps
                  </button>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-blue-50/20 custom-scrollbar">
            {messages.map((msg, i) =>
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm text-sm font-bold ${
            msg.role === 'user' ?
            'bg-blue-600 text-white rounded-tr-none' :
            'bg-white text-blue-900 border border-blue-50 rounded-tl-none'}`
            }>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  {msg.urls && msg.urls.length > 0 &&
              <div className="mt-3 pt-3 border-t border-blue-50 space-y-2">
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1">
                        <Globe size={10} /> Locations found
                      </p>
                      {msg.urls.map((u, j) =>
                <a key={j} href={u.uri} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-[10px] font-black truncate">
                          {u.title || u.uri}
                        </a>
                )}
                    </div>
              }
                </div>
              </div>
          )}
            {isLoading &&
          <div className="flex justify-start">
                <div className="bg-white border border-blue-100 p-4 rounded-3xl rounded-tl-none flex items-center gap-3">
                  <Loader2 size={16} className="animate-spin text-blue-500" />
                  <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Thinking...</span>
                </div>
              </div>
          }
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-blue-50 flex gap-2">
            <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={mode === 'maps' ? "Find local help..." : "Ask me anything..."}
            className="flex-1 bg-blue-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-400 transition-all placeholder:text-blue-200" />
          
            <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50">
            
              <Send size={18} />
            </button>
          </div>
        </div> :

      <button
        onClick={() => setIsOpen(true)}
        className="w-16 h-16 bg-blue-600 text-white rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center hover:scale-110 hover:-rotate-6 transition-all group relative">
        
          <MessageSquare size={28} />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full border-4 border-blue-600 animate-pulse"></div>
          <span className="absolute right-full mr-4 bg-white px-5 py-3 rounded-2xl text-blue-900 font-black text-xs shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest border border-blue-50">
            Need help?
          </span>
        </button>
      }
    </div>);

};