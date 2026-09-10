'use client';

import { useEffect, useState, useRef } from 'react';
import { MessageSquare, Send, X, Check, CheckCheck, Clock, User, Trash2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface ChatRoom {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  agent_id?: string;
  status: 'ACTIVE' | 'RESOLVED' | 'CLOSED';
  subject?: string;
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  sender_type: 'CUSTOMER' | 'AGENT';
  message: string;
  message_type: 'TEXT' | 'IMAGE' | 'FILE';
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://laundry.anushatechnologies.com/api';
const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export default function ChatManagementPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [connected, setConnected] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat rooms
  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/rooms`);
      const data = await res.json();
      if (data.success) {
        setRooms(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a room
  const fetchMessages = async (roomId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/messages/${roomId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data || []);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Initialize WebSocket
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Admin Chat] Connected to WebSocket');
      setConnected(true);
      
      // Authenticate as agent
      socket.emit('authenticate', { 
        userId: 'admin_agent', 
        userType: 'AGENT' 
      });
    });

    socket.on('authenticated', () => {
      console.log('[Admin Chat] Authenticated');
      // Join all active rooms
      rooms.forEach(room => {
        socket.emit('join_room', { roomId: room.id, userId: 'admin_agent' });
      });
    });

    socket.on('new_message', (message: ChatMessage) => {
      console.log('[Admin Chat] New message received:', message);
      
      // Add message to current conversation
      if (selectedRoom && message.room_id === selectedRoom.id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
      
      // Update room list
      fetchRooms();
    });

    socket.on('messages_cleared', (data: { roomId: string }) => {
      console.log('[Admin Chat] Messages cleared event received:', data);
      if (selectedRoom && data.roomId === selectedRoom.id) {
        setMessages([]);
      }
      fetchRooms();
    });

    socket.on('disconnect', () => {
      console.log('[Admin Chat] Disconnected');
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedRoom, rooms.length]);

  // Fetch rooms on mount and poll every 10s
  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages immediately when a room is selected, and join socket if connected
  useEffect(() => {
    if (!selectedRoom?.id) return;
    
    // Always fetch messages via HTTP API immediately
    fetchMessages(selectedRoom.id);

    if (socketRef.current?.connected) {
      socketRef.current.emit('join_room', { 
        roomId: selectedRoom.id, 
        userId: 'admin_agent' 
      });
    }
  }, [selectedRoom?.id]);

  // Poll messages for the active room every 3 seconds
  useEffect(() => {
    if (!selectedRoom?.id) return;

    const interval = setInterval(() => {
      fetchMessages(selectedRoom.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedRoom?.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedRoom) return;

    setSending(true);
    const messageText = messageInput.trim();
    setMessageInput('');

    try {
      // 1. Send via reliable HTTP REST API (persists in MySQL)
      const res = await fetch(`${API_BASE_URL}/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          senderId: 'admin_agent',
          senderType: 'AGENT',
          message: messageText,
          messageType: 'TEXT',
        }),
      });
      const data = await res.json();

      // 2. Also emit via WebSocket if connected
      if (socketRef.current?.connected) {
        socketRef.current.emit('send_message', {
          roomId: selectedRoom.id,
          senderId: 'admin_agent',
          senderType: 'AGENT',
          message: messageText,
          messageType: 'TEXT',
        });
      }

      // 3. Immediately refresh messages and room list
      await fetchMessages(selectedRoom.id);
      fetchRooms();
    } catch (error) {
      console.error('[Admin Chat] Error sending message:', error);
      alert('Failed to send message. Please try again.');
      setMessageInput(messageText);
    } finally {
      setSending(false);
    }
  };

  const clearConversation = async () => {
    if (!selectedRoom) return;

    const customerDisplayName = selectedRoom.customer_name || selectedRoom.customer_phone || `Customer ${selectedRoom.customer_id.slice(-4)}`;
    const confirmed = window.confirm(
      `Are you sure you want to CLEAR ALL MESSAGES for ${customerDisplayName}?\n\nThis will remove all message history for this chat session.`
    );
    if (!confirmed) return;

    setClearing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chat/rooms/${selectedRoom.id}/messages`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setMessages([]);
        fetchRooms();
      } else {
        alert(data.message || 'Failed to clear chat');
      }
    } catch (err: any) {
      console.error('[Admin Chat] Error clearing chat messages:', err);
      alert('Error clearing chat messages: ' + (err?.message || 'Network error'));
    } finally {
      setClearing(false);
    }
  };

  const sendOtpToCustomer = async () => {
    if (!selectedRoom || !selectedRoom.customer_phone) {
      alert('Customer phone number not available');
      return;
    }

    const confirmed = confirm(
      `Send OTP to ${selectedRoom.customer_name || 'Customer'}?\nPhone: ${selectedRoom.customer_phone}`
    );

    if (!confirmed) return;

    setSendingOtp(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: selectedRoom.customer_phone }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`✅ OTP sent successfully to ${data.data.phone} via ${data.data.gateway}`);
        
        // Save confirmation message to chat via HTTP REST
        const otpNotice = `✅ OTP has been sent to your registered mobile number ${data.data.phone}. Please check your SMS inbox. The code is valid for 10 minutes.`;
        await fetch(`${API_BASE_URL}/chat/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: selectedRoom.id,
            senderId: 'admin_agent',
            senderType: 'AGENT',
            message: otpNotice,
            messageType: 'TEXT',
          }),
        });

        // Also emit via WebSocket if connected
        if (socketRef.current?.connected) {
          socketRef.current.emit('send_message', {
            roomId: selectedRoom.id,
            senderId: 'admin_agent',
            senderType: 'AGENT',
            message: otpNotice,
            messageType: 'TEXT',
          });
        }

        await fetchMessages(selectedRoom.id);
        fetchRooms();
      } else {
        alert(`❌ Failed to send OTP: ${data.message}`);
      }
    } catch (error: any) {
      console.error('[Admin Chat] Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const closeRoom = async (roomId: string) => {
    try {
      await fetch(`${API_BASE_URL}/chat/rooms/${roomId}/close`, {
        method: 'PUT',
      });
      fetchRooms();
      if (selectedRoom?.id === roomId) {
        setSelectedRoom(null);
      }
    } catch (error) {
      console.error('Error closing room:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-gray-900">
      {/* Sidebar - Chat Rooms List */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Customer Chats
            </h2>
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} 
                 title={connected ? 'Connected' : 'Disconnected'} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {rooms.length} active conversation{rooms.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : rooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active chats</p>
            </div>
          ) : (
            rooms.map(room => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`w-full p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors ${
                  selectedRoom?.id === room.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {room.customer_name || `Customer ${room.customer_id.slice(-4)}`}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {room.last_message_at ? formatTime(room.last_message_at) : formatTime(room.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {room.last_message || room.subject || 'No messages yet'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        room.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {room.status}
                      </span>
                      {room.customer_phone && (
                        <span className="text-xs text-gray-500">{room.customer_phone}</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedRoom.customer_name || `Customer ${selectedRoom.customer_id.slice(-4)}`}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedRoom.customer_phone || selectedRoom.subject || 'Customer Support'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {selectedRoom.customer_phone && (
                  <button
                    onClick={sendOtpToCustomer}
                    disabled={sendingOtp}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    title="Send OTP to customer's phone"
                  >
                    {sendingOtp ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        Send OTP
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={clearConversation}
                  disabled={clearing}
                  className="px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors flex items-center gap-1.5 border border-red-200 dark:border-red-900/60 disabled:opacity-50"
                  title="Clear all messages in this conversation"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{clearing ? 'Clearing...' : 'Clear Chat'}</span>
                </button>

                <span className={`text-xs px-3 py-1 rounded-full ${
                  selectedRoom.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {selectedRoom.status}
                </span>
                {selectedRoom.status === 'ACTIVE' && (
                  <button
                    onClick={() => closeRoom(selectedRoom.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Close conversation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map(msg => {
                  const senderType = String(msg.sender_type || (msg as any).senderType || 'CUSTOMER').toUpperCase();
                  const isAgent = senderType.includes('AGENT') || senderType.includes('ADMIN');
                  const timeString = new Date(msg.created_at || (msg as any).createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const isRead = Boolean(msg.is_read ?? (msg as any).isRead);
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md rounded-lg px-4 py-2 ${
                        isAgent
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                        <div className={`flex items-center gap-1 justify-end mt-1 text-xs ${
                          isAgent ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{timeString}</span>
                          {isAgent && (
                            isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {/* Quick Response Buttons */}
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setMessageInput('Thank you for contacting LaundryFresh support. How can I help you today?')}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  👋 Greeting
                </button>
                <button
                  onClick={sendOtpToCustomer}
                  disabled={!selectedRoom.customer_phone || sendingOtp}
                  className="text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔐 Send OTP
                </button>
                <button
                  onClick={() => setMessageInput('Your order is being processed and will be ready soon. You can track it in the Orders section of the app.')}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  📦 Order Status
                </button>
                <button
                  onClick={() => setMessageInput('Our delivery partner will contact you shortly. Please keep your phone handy.')}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  🚚 Delivery
                </button>
                <button
                  onClick={() => setMessageInput('We apologize for the inconvenience. Our team will look into this immediately and get back to you.')}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  😔 Apology
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type your message..."
                  disabled={selectedRoom.status !== 'ACTIVE'}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim() || sending || selectedRoom.status !== 'ACTIVE'}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              {!connected && (
                <p className="text-xs text-red-500 mt-2">⚠️ Not connected to chat server</p>
              )}
              {selectedRoom.status !== 'ACTIVE' && (
                <p className="text-xs text-gray-500 mt-2">This conversation is {selectedRoom.status.toLowerCase()}</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
