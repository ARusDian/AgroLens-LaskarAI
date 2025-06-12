import { useState, useCallback } from 'react';
import { chatService } from '../services/chatService';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const sendMessage = useCallback(async (text: string, diseaseInfo?: string) => {
    if (!text.trim()) return;

    const prompt = diseaseInfo ? `Penyakit: ${diseaseInfo}. ${text}` : text;
    
    try {
      setIsLoading(true);
      setError(null);
      
      addMessage(text, 'user');
      
      const response = await chatService.sendMessage(prompt);
      const botMessage = response.response || 'Maaf, saya tidak dapat memproses permintaan Anda saat ini.';
      
      addMessage(botMessage, 'bot');
      return botMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = 'Maaf, terjadi kesalahan saat memproses pesan Anda.';
      addMessage(errorMessage, 'bot');
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
};
