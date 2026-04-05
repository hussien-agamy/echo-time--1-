import React, { useState, useRef, useEffect } from 'react';
import { Send, Info, ArrowLeft, Search, CheckCheck, MessageSquare, CheckCircle, Star, X } from 'lucide-react';
import { api, API_URL } from '../services/api';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';

// Use the same base URL as the API, but strip the /api suffix if it exists
const SOCKET_URL = API_URL.replace('/api', '');

const Chat = ({ user }) => {
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const socketRef = useRef(null);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  // 1. Initialize Socket.io Connection
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to Chat Server');
    });

    socket.on('receive_message', (message) => {
      setThreads(prev => prev.map(t => {
        if ('chat_' + activeThread?.requestId === 'chat_' + activeThread?.requestId) { // Should check message taskId
          // We find which thread this message belongs to
          const threadId = 'chat_' + message.taskId; // We need to make sure the backend sends taskId or similar
          // Wait, the backend formattedMsg I wrote earlier didn't include taskId. Let me check.
          // Actually, the socket broadcast logic in server.js: io.to(data.taskId).emit('receive_message', formattedMsg);
          // I should update server.js to include taskId in the broadcast so frontend knows where to put it.
        }
        
        // Simplified for now: if we are in the room, we likely get the message
        if (activeThread?.requestId) {
           // We'll update the active thread if the message matches (or any thread)
           // To be safe, we'll try to match by taskId if possible
           return t;
        }
        return t;
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 2. Load Conversations (Sidebar)
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get('/chat/conversations');
        const convos = (response.data || []).map(c => ({
          id: 'chat_' + c.taskId,
          requestId: c.taskId,
          participantId: c.participant?.id,
          participantName: c.participant?.full_name || 'Unknown User',
          participantAvatar: c.participant?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.participant?.full_name || 'U')}&background=3b82f6&color=fff`,
          lastMessage: c.lastMessage,
          lastMessageTime: c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          taskTitle: c.taskTitle,
          taskStatus: c.taskStatus,
          messages: []
        }));
        setThreads(convos);
        if (convos.length > 0 && !activeThreadId) {
          setActiveThreadId(convos[0].id);
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setIsLoadingThreads(false);
      }
    };
    fetchConversations();
  }, []);

  // 3. Load Message History (with 3s secret polling as backup to Socket.io)
  useEffect(() => {
    const fetchChatHistory = async (isInitial = false) => {
      if (!activeThread?.requestId) return;
      
      if (isInitial) setIsLoadingMessages(true);
      
      // Join the socket room for this task (on initial join)
      if (isInitial && socketRef.current) {
        socketRef.current.emit('join_task_chat', activeThread.requestId);
      }

      try {
        const response = await api.get(`/chat/history/${activeThread.requestId}`);
        const backendMessages = (response.data || []).map(m => ({
          id: m.id,
          senderId: m.sender_id,
          text: m.content,
          senderProfile: m.sender,
          timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        
        setThreads(prev => prev.map(t => {
          if (t.id === activeThreadId) {
            // Merge logic: keep new messages from backend, avoid duplicates with local/socket messages
            const existingIds = new Set(t.messages.map(m => m.id));
            const newMessages = backendMessages.filter(m => !existingIds.has(m.id));

            if (newMessages.length === 0 && !isInitial) return t;

            // If it's a completely fresh load or we have new messages
            return { 
              ...t, 
              messages: isInitial ? backendMessages : [...t.messages, ...newMessages],
              lastMessage: backendMessages[backendMessages.length - 1]?.text || t.lastMessage
            };
          }
          return t;
        }));
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        if (isInitial) setIsLoadingMessages(false);
      }
    };

    fetchChatHistory(true);
    const interval = setInterval(() => fetchChatHistory(false), 3000);
    return () => clearInterval(interval);
  }, [activeThreadId, activeThread?.requestId]);

  // 4. Handle incoming real-time messages properly
  useEffect(() => {
    if (!socketRef.current) return;

    const handleNewMessage = (message) => {
      // The backend message now includes taskId
      setThreads(prev => prev.map(t => {
        // Match the message to the correct thread
        if (t.requestId === message.taskId) {
           if (t.messages.find(m => m.id === message.id)) return t;

           return {
             ...t,
             messages: [...t.messages, message],
             lastMessage: message.text,
             lastMessageTime: message.timestamp
           };
        }
        return t;
      }));
    };

    const handleTaskCompleted = (data) => {
      // Use String() for safe comparison
      if (activeThread?.requestId && String(data.taskId) === String(activeThread.requestId)) {
        setThreads(prev => prev.map(t => 
          String(t.requestId) === String(data.taskId) ? { ...t, taskStatus: 'completed' } : t
        ));
        setShowReviewModal(true);
        setSubmitted(false);
      }
    };

    socketRef.current.off('receive_message');
    socketRef.current.on('receive_message', handleNewMessage);
    
    socketRef.current.off('task_completed');
    socketRef.current.on('task_completed', handleTaskCompleted);

    return () => {
      socketRef.current?.off('receive_message', handleNewMessage);
      socketRef.current?.off('task_completed', handleTaskCompleted);
    };
  }, [activeThread?.requestId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeThread?.messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeThreadId || !activeThread?.requestId) return;

    const messageData = {
      taskId: activeThread.requestId,
      senderId: user.id,
      content: inputText
    };

    // Send via socket
    if (socketRef.current) {
      socketRef.current.emit('send_message', messageData);
    }
    
    setInputText('');
  };

  const handleFinishService = async () => {
    if (!activeThread?.requestId) return;
    try {
      await api.patch(`/tasks/${activeThread.requestId}/complete`);
      
      // Notify both users via socket (including self)
      if (socketRef.current) {
        socketRef.current.emit('finish_task', { taskId: activeThread.requestId, userId: user.id });
      }
      // Note: setShowReviewModal(true) is now handled by handleTaskCompleted for everyone
    } catch (err) {
      console.error('Failed to complete task:', err);
      alert('Failed to complete task: ' + err.message);
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0 || !activeThread?.requestId) return;
    try {
      await api.post('/reviews', {
        taskId: activeThread.requestId,
        rating,
        comment: reviewText
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review: ' + err.message);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-4 overflow-hidden">
      {/* Sidebar - Same as before */}
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
          {isLoadingThreads ? (
            <div className="flex flex-col items-center justify-center p-12 gap-3">
              <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-black text-blue-300 uppercase tracking-widest text-[10px]">Loading chats...</span>
            </div>
          ) : threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 opacity-50">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                <MessageSquare size={32} className="text-blue-300" />
              </div>
              <p className="font-black text-blue-300 uppercase tracking-widest text-[10px]">No conversations yet</p>
              <p className="text-xs text-blue-300">Accept a task from the Market to start chatting</p>
            </div>
          ) : (
            threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`w-full p-5 flex gap-4 items-center hover:bg-blue-50 transition-all border-l-4 ${activeThreadId === t.id ? 'bg-blue-50 border-blue-600' : 'border-transparent'}`}>
                <img src={t.participantAvatar} className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white" alt="" />
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-blue-900 truncate tracking-tight">{t.participantName}</span>
                    <span className="text-[9px] text-blue-300 font-black uppercase">{t.lastMessageTime || ''}</span>
                  </div>
                  <p className="text-xs text-blue-400 truncate font-bold">{t.lastMessage || 'Click to chat'}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area - Updated for Real-time */}
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
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Real-time Connected</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {activeThread?.taskStatus !== 'completed' && (
                <button
                  onClick={handleFinishService}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                  <CheckCircle size={16} /> Finish Service
                </button>
              )}
              <button className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-sm bg-white"><Info size={18} /></button>
            </div>
          </div>

          {/* Messages List */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-blue-50/10">
            {isLoadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activeThread?.messages.map((m) => {
              const isMe = m.senderId === user.id;
              const senderName = isMe ? 'You' : (m.senderProfile?.full_name || activeThread?.participantName || 'User');

              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                  {!isMe && (
                    <img
                      src={m.senderProfile?.avatar_url || activeThread?.participantAvatar}
                      className="w-8 h-8 rounded-xl object-cover border border-blue-100 self-end"
                      alt=""
                    />
                  )}
                  <div className={`max-w-[70%]`}>
                    <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isMe ? 'text-right text-blue-300' : 'text-blue-400'}`}>
                      {senderName}
                    </div>
                    <div className={`p-4 rounded-3xl shadow-sm ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-blue-900 border border-blue-100 rounded-tl-none'
                    }`}>
                      <p className="text-sm font-bold leading-relaxed">{m.text}</p>
                      <div className={`flex items-center gap-1 text-[8px] mt-2 font-black uppercase tracking-widest ${isMe ? 'text-blue-100' : 'text-blue-300'}`}>
                        {m.timestamp}
                        {isMe && <CheckCheck size={10} />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-white border-t border-blue-50 flex gap-3 items-center">
            <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-blue-50 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold text-blue-900 placeholder:text-blue-200" />
          
            <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center">
              <Send size={24} />
            </button>
          </div>
      </div> :

      <div className="flex-1 bg-white rounded-[2.5rem] border border-blue-100 flex flex-col items-center justify-center text-center p-12 space-y-6 shadow-2xl">
          <div className="w-32 h-32 bg-blue-50 text-blue-200 rounded-[3rem] flex items-center justify-center shadow-inner">
            <MessageSquare size={64} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-blue-900 tracking-tight">Open a Conversation</h2>
            <p className="text-blue-400 font-bold max-w-xs mx-auto leading-relaxed">Choose a chat to start real-time messaging.</p>
          </div>
        </div>
      }

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-[0_50px_100px_-20px_rgba(30,64,175,0.4)] border border-blue-50 relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50" />
            
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-6 right-6 p-3 hover:bg-blue-50 rounded-2xl transition-all text-blue-300 hover:text-blue-600"
            >
              <X size={24} />
            </button>

            {!submitted ? (
              <div className="space-y-8 relative z-10">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner mb-4">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-4xl font-black text-blue-950 tracking-tight">Mission Accomplished!</h2>
                  <p className="text-blue-400 font-bold">How was your experience working with {activeThread?.participantName}?</p>
                </div>

                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-all hover:scale-125 active:scale-95"
                    >
                      <Star
                        size={48}
                        className={`transition-colors duration-300 ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-blue-100'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share some feedback (optional)..."
                    className="w-full bg-blue-50/50 rounded-3xl p-6 h-32 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold text-blue-900 placeholder:text-blue-300 resize-none"
                  />
                  
                  <button
                    onClick={handleSubmitReview}
                    disabled={rating === 0}
                    className={`w-full py-6 rounded-[2rem] font-black text-2xl transition-all shadow-2xl flex items-center justify-center gap-3 ${
                      rating > 0 
                        ? 'bg-blue-600 text-white shadow-blue-200 hover:scale-[1.02] active:scale-95' 
                        : 'bg-blue-100 text-blue-300 cursor-not-allowed shadow-none'
                    }`}
                  >
                    Post Review
                    <Send size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200 animate-bounce">
                  <CheckCircle size={48} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-blue-950 tracking-tight">Review Submitted!</h2>
                  <p className="text-blue-400 text-xl font-bold">Your feedback helps the RE-GEN community stay trustworthy.</p>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="bg-blue-900 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-black transition-all shadow-xl"
                >
                  Back to Chat
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>);
};

export default Chat;