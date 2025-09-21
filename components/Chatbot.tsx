import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage } from '../types';
import { createChat } from '../services/geminiService';
import { useTranslations } from '../hooks/useTranslations';
import ChatIcon from './icons/ChatIcon';
import Loader from './Loader';
import { Chat } from '@google/genai';

interface ChatbotProps {
  athlete: User;
}

const Chatbot: React.FC<ChatbotProps> = ({ athlete }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const t = useTranslations();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the chat session
    const chatSession = createChat(athlete);
    setChat(chatSession);
  }, [athlete]);

  useEffect(() => {
    // Scroll to the bottom of the chat history when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chat || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: userInput };
    setHistory(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await chat.sendMessage({ message: userInput });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setHistory(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
      setHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <ChatIcon className="w-6 h-6 text-brand-primary" />
        {t('chatbotComponent.title')}
      </h2>
      <p className="text-medium-dark-text dark:text-medium-text mb-4 text-sm">{t('chatbotComponent.description')}</p>

      <div ref={chatContainerRef} className="flex-grow bg-light-bg dark:bg-gray-800 rounded-lg p-4 border border-light-border dark:border-dark-border overflow-y-auto mb-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${
              msg.role === 'user'
                ? 'bg-brand-primary text-white'
                : 'bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-dark-text dark:text-light-text'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
                <Loader message="Thinking..."/>
             </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={t('chatbotComponent.inputPlaceholder')}
          className="flex-grow p-3 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition text-dark-text dark:text-light-text"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!userInput.trim() || loading}
          className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {t('chatbotComponent.sendMessage')}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
