"use client";
import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { Send, X, MessageCircle } from "lucide-react";

interface ChatMessage {
  userId: string;
  userName: string;
  message: string;
}

interface ChatModalProps {
  socket: Socket;
  userName: string;
  forceInline: boolean;
}

export default function ChatModal({
  socket,
  userName,
  forceInline,
}: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(forceInline);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleReceive = (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [socket]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    socket.emit("chat_message", {
      userId: socket.id,
      userName,
      message: newMessage,
    });
    setNewMessage("");
  };

  return (
    <>
      {/* Floating Toggle Button for Small Screens Only */}
      {!forceInline && (
        <div className="fixed bottom-4 right-4 z-50 lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 shadow-xl transition-all"
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </button>
        </div>
      )}

      {/* Chat Box */}
      {(isOpen || forceInline) && (
        <div
          className={`${
            forceInline
              ? "w-full lg:w-[350px] h-[400px] max-h-[400px] border"
              : "fixed bottom-20 right-4 w-[90vw] sm:w-[300px] lg:w-[400px] z-50"
          } flex flex-col rounded-2xl shadow-2xl bg-gradient-to-br from-red-900 via-gray-900 to-orange-900 text-white border-gray-700 overflow-hidden`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-600">
            <h2 className="text-lg font-semibold">Live Chat</h2>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-300">Online</span>
              {!forceInline && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 scroll-smooth custom-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.userId === socket.id ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.userId === socket.id
                      ? "bg-orange-600 text-right rounded-br-none"
                      : "bg-gray-700 text-left rounded-bl-none"
                  } shadow`}
                >
                  <p className="text-xs text-gray-300 font-medium mb-1">
                    {msg.userName}
                  </p>
                  <p className="text-base break-words">{msg.message}</p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-700 px-4 py-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-gray-800 text-white text-sm lg:text-base rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-orange-600 hover:bg-red-700 rounded-full transition duration-200"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
