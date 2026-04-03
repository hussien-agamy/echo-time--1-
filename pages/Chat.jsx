import React, { useState, useRef, useEffect } from 'react';
import { Send, Info, ArrowLeft, Search, CheckCheck, MessageSquare, CheckCircle, Star, Phone, Video, X } from 'lucide-react';
import { api } from '../services/api';

const Chat = ({ user, threads, setThreads }) => {
  const [activeThreadId, setActiveThreadId] = useState(threads[0]?.id || null);
  const [inputText, setInputText] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!activeThread?.requestId) return;
      
      // We only show loading state if it's the first time
      if (!threads.find(t => t.id === activeThreadId)?.messages?.length) {
        setIsLoadingMessages(true);
      }
      
      try {
        const response = await api.get(`/chat/${activeThread.requestId}`);
        if (!response.data || response.data.length === 0) {
          setIsLoadingMessages(false);
          return;
        }

        const backendMessages = response.data.map(m => ({
          id: m.id,
          senderId: m.sender_id,
          text: m.content,
          timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        
        setThreads(prev => prev.map(t => {
          if (t.id === activeThreadId) {
            // Only update if we actually have new messages to prevent UI flickering (input losing focus)
            if (t.messages.length !== backendMessages.length) {
              return { ...t, messages: backendMessages };
            }
          }
          return t;
        }));
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    // Fetch immediately on thread change
    fetchChatHistory();

    // Set up continuous polling every 3 seconds to simulate real-time for FREE
    const intervalId = setInterval(fetchChatHistory, 3000);

    return () => clearInterval(intervalId);
  }, [activeThreadId, activeThread?.requestId, setThreads]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeThread?.messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeThreadId || !activeThread?.requestId) return;

    const optimisticMsg = {
      id: 'temp_' + Date.now(),
      senderId: user.id,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setThreads((prev) => prev.map((t) =>
      t.id === activeThreadId ?
      { ...t, messages: [...t.messages, optimisticMsg], lastMessage: inputText } : t
    ));
    
    const sentText = inputText;
    setInputText('');

    try {
      await api.post('/chat/send', {
        taskId: activeThread.requestId,
        content: sentText
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      // Instead of deleting the message, we mark it as failed so you can see the error
      setThreads((prev) => prev.map((t) =>
        t.id === activeThreadId ?
        { 
          ...t, 
          messages: t.messages.map(m => m.id === optimisticMsg.id ? { ...m, failed: true } : m) 
        } : t
      ));
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-4 overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full md:w-80 bg-white rounded-[2.5rem] border border-blue-100 flex flex-col shadow-2xl ${activeThreadId && 'hidden md:flex'}`}>
        <div className="p-6 border-b border-blue-50 space-y-4">
          <h2 className="text-2xl font-black text-blue-900 tracking-tight">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" size={16} />
            <input
              type="text"
              placeholder="Search chat..."
              className="w-full bg-blue-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition-all font-bold text-blue-900 placeholder:text-blue-200" />
            
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {threads.length === 0 ?
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 opacity-50">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                <MessageSquare size={32} className="text-blue-300" />
              </div>
              <p className="font-black text-blue-300 uppercase tracking-widest text-[10px]">No messages yet</p>
            </div> :

          threads.map((t) =>
          <button
            key={t.id}
            onClick={() => setActiveThreadId(t.id)}
            className={`w-full p-5 flex gap-4 items-center hover:bg-blue-50 transition-all border-l-4 ${activeThreadId === t.id ? 'bg-blue-50 border-blue-600' : 'border-transparent'}`}>
            
                <img src={t.participantAvatar} className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white" alt="" />
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-blue-900 truncate tracking-tight">{t.participantName}</span>
                    <span className="text-[9px] text-blue-300 font-black uppercase">12:30 PM</span>
                  </div>
                  <p className="text-xs text-blue-400 truncate font-bold">{t.lastMessage || 'Click to chat'}</p>
                </div>
              </button>
          )
          }
        </div>
      </div>

      {/* Main Chat Area */}
      {activeThreadId ?
      <div className="flex-1 bg-white rounded-[2.5rem] border border-blue-100 flex flex-col shadow-2xl overflow-hidden">
        
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-blue-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveThreadId(null)} className="md:hidden text-blue-400 p-2 hover:bg-blue-50 rounded-xl transition-colors"><ArrowLeft size={24} /></button>
              <img src={activeThread?.participantAvatar} className="w-12 h-12 rounded-2xl object-cover shadow-sm border-2 border-blue-50" alt="" />
              <div>
                <h3 className="font-black text-blue-900 leading-tight tracking-tight">{activeThread?.participantName}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">Active</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowReviewModal(true); setSubmitted(false); setRating(0); setReviewText(''); }}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-emerald-200 transition-all active:scale-95"
              >
                <CheckCircle size={16} /> Finish Service
              </button>
              <button className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm bg-white"><Info size={18} /></button>
            </div>
          </div>

          {/* Messages List */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-blue-50/10">
            {isLoadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activeThread?.messages.map((m) =>
          <div key={m.id} className={`flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                <div
              className={`max-w-[75%] p-4 rounded-3xl shadow-sm ${
              m.senderId === user.id ?
              'bg-blue-600 text-white rounded-tr-none' :
              'bg-white text-blue-900 border border-blue-100 rounded-tl-none'}`
              }>
              
                  <p className="text-sm font-bold leading-relaxed">{m.text}</p>
                  <div className={`flex items-center gap-1 text-[8px] mt-2 font-black uppercase tracking-widest ${m.senderId === user.id ? 'text-blue-100' : 'text-blue-300'}`}>
                    {m.timestamp}
                    {m.failed ? <span className="text-red-300 flex items-center gap-1 ml-2"><X size={10} /> Failed (Backend Rejected)</span> : (m.senderId === user.id && <CheckCheck size={10} />)}
                  </div>
                </div>
              </div>
          )}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-white border-t border-blue-50 flex gap-3 items-center">
            <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            type="text"
            placeholder="Send a message..."
            className="flex-1 bg-blue-50 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold text-blue-900 placeholder:text-blue-200" />
          
            <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center">
            
              <Send size={24} />
            </button>
          </div>

          {/* Review Modal */}
            {showReviewModal && (
              <div
                className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowReviewModal(false)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-md shadow-2xl border border-blue-50 relative"
                >
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    <X size={20} />
                  </button>

                  {!submitted ? (
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-500 mb-2">
                          <CheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-blue-950 tracking-tight">Finish Service</h3>
                        <p className="text-sm font-medium text-slate-500">
                          Rate your experience with <span className="font-bold text-blue-600">{activeThread?.participantName}</span>
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="p-1 transition-all"
                          >
                            <Star
                              size={36}
                              className={`transition-colors duration-200 ${
                                star <= (hoverRating || rating)
                                  ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                                  : 'text-slate-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <div className="text-center text-xs font-black text-slate-400 uppercase tracking-widest">
                        {rating === 0 ? 'Tap a star to rate' : ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
                      </div>

                      {/* Review Input */}
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write a short review (optional)..."
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold text-blue-900 placeholder:text-slate-300 outline-none focus:border-blue-400 focus:bg-white transition-all resize-none h-28"
                      />

                      {/* Submit */}
                      <button
                        onClick={() => { if (rating > 0) setSubmitted(true); }}
                        disabled={rating === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95"
                      >
                        Submit Review
                      </button>
                    </div>
                  ) : (
                    <div
                      className="text-center space-y-4 py-4"
                    >
                      <div
                        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500"
                      >
                        <CheckCircle size={40} />
                      </div>
                      <h3 className="text-2xl font-black text-blue-950 tracking-tight">Thank You!</h3>
                      <p className="text-sm font-medium text-slate-500">Your review has been submitted successfully.</p>
                      <div className="flex justify-center gap-1 py-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={20} className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                        ))}
                      </div>
                      <button
                        onClick={() => setShowReviewModal(false)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-200 transition-all active:scale-95 hover:bg-blue-700"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

        </div> :

      <div className="flex-1 bg-white rounded-[2.5rem] border border-blue-100 flex flex-col items-center justify-center text-center p-12 space-y-6 shadow-2xl">
          <div
          className="w-32 h-32 bg-blue-50 text-blue-200 rounded-[3rem] flex items-center justify-center shadow-inner">
          
            <MessageSquare size={64} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-blue-900 tracking-tight">Open a Conversation</h2>
            <p className="text-blue-400 font-bold max-w-xs mx-auto leading-relaxed">Choose a chat from the left to start talking about your task and trading time.</p>
          </div>
        </div>
      }
    </div>);

};

export default Chat;