'use client';

import { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
import Image from "next/image";
import Link from "next/link";

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

type DiseasePrediction = {
  prediction: string;
  description: string;
};



export default function DiagnosaPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiseasePrediction | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !result) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsChatLoading(true);

    try {
      // Include the disease information in the prompt for context
      const prompt = `Penyakit: ${result.prediction}. ${inputMessage}`;
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Gagal mendapatkan respons dari chatbot');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Maaf, saya tidak dapat memproses permintaan Anda saat ini.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Maaf, terjadi kesalahan saat memproses pesan Anda.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleExampleClick = async (exampleNumber: number) => {
    // Clear previous state
    setSelectedImage(null);
    setResult(null);
    setMessages([]);
    
    // Simulate file selection for example images
    try {
      const response = await fetch(`/example_${exampleNumber}.jpg`);
      const blob = await response.blob();
      const file = new File([blob], `example_${exampleNumber}.jpg`, { type: 'image/jpeg' });
      
      // Trigger file change handler
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Simulate API call for classification
      setIsLoading(true);
      
      // Mock API response after a delay
      setTimeout(() => {
        const mockResponses = [
          { prediction: 'BacterialBlight', description: 'Penyakit akibat bakteri yang menyebabkan bercak air dan layu.' },
          { prediction: 'Blast', description: 'Penyakit jamur yang menyerang leher malai dan daun.' },
          { prediction: 'Brownspot', description: 'Terdapat bercak coklat bulat di permukaan daun.' },
        ];
        
        const mockResult = mockResponses[exampleNumber - 1] || 
          { prediction: 'Healthy', description: 'Tanaman padi dalam kondisi sehat tanpa gejala penyakit.' };
        
        setResult(mockResult);
        setIsLoading(false);
        
        // Add welcome message from bot
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: `Saya mendeteksi penyakit ${mockResult.prediction}. ${mockResult.description} Apakah Anda ingin mengetahui lebih lanjut tentang cara mengatasi penyakit ini?`,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }, 1500);
      
    } catch (error) {
      console.error('Error loading example image:', error);
      setIsLoading(false);
    }
  };

  const handleFileChange = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      alert('Hanya file gambar yang diizinkan');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    // Display preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload and classify
    try {
      setIsLoading(true);
      setResult(null);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal mengklasifikasikan gambar');
      }

      const data = await response.json();
      const prediction = data.prediction;
      const description = data.description;
      
      setResult({
        prediction,
        description
      });
      
      // Add welcome message from bot
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `Saya mendeteksi penyakit ${prediction}. ${description} Apakah Anda ingin mengetahui lebih lanjut tentang cara mengatasi penyakit ini?`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat memproses gambar');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };


  // Handle form submission for chat
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isChatLoading) {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <header className="px-8 md:px-20 lg:px-32 mb-8">
        <Link href="/">
          <h1 className="text-3xl font-bold text-green-400">AgroLens</h1>
        </Link>
      </header>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Upload Gambar untuk Diagnosa</h1>
        
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-green-500 bg-gray-700' : 'border-gray-600'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileInputChange}
            />
            <div className="flex flex-col items-center justify-center space-y-4">
              <svg 
                className={`w-12 h-12 ${isDragging ? 'text-green-500' : 'text-gray-400'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
              <div>
                <p className="text-gray-300 font-medium">
                  {isDragging ? 'Lepaskan gambar di sini' : 'Seret dan lepas gambar di sini'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  atau klik untuk memilih file (JPG, PNG, atau JPEG, maks. 5MB)
                </p>
              </div>
            </div>
          </div>

        {/* Example Images */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Contoh Gambar</h2>
            <p className="text-gray-400 mb-4">Klik pada gambar di bawah untuk mencoba dengan contoh:</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div 
                  key={item} 
                  className="cursor-pointer hover:opacity-90 transition-opacity group"
                  onClick={() => handleExampleClick(item)}
                >
                  <div className="relative aspect-[4/3] bg-gray-700 rounded-lg overflow-hidden">
                    <Image 
                      src={`/example_${item}.jpg`}
                      alt={`Contoh ${item}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>

          {/* Preview and Result Section */}
          {(selectedImage || isLoading || result) && (
            <div className="mt-8 bg-gray-700 p-6 rounded-lg">
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Preview */}
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    {selectedImage && (
                      <Image
                        src={selectedImage}
                        alt="Gambar yang diupload"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Result */}
                <div className="w-full md:w-1/2">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  ) : result ? (
                    <div className="space-y-4">
                      <div>
                      <h2 className="text-xl font-semibold mb-4">Hasil Diagnosa</h2>
                        <p className="text-2xl font-bold text-green-400 capitalize">
                          {result.prediction.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400">Deskripsi</h3>
                        <p className="text-gray-300">{result.description}</p>
                      </div>
                      <button 
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                        onClick={() => {
                          setSelectedImage(null);
                          setResult(null);
                          setMessages([]);
                        }}
                      >
                        Coba Lagi
                      </button>
                    </div>
                  ) : null}
                </div>
                
              </div>
            </div>
          )}

          {result && (
            <div className="mt-8 border-t border-gray-600 pt-6">
              {/* Chat Interface */}
              <h3 className="text-lg font-semibold mb-4">Tanya tentang penyakit ini</h3>

              {/* Messages */}
              <div className="mb-4 h-64 overflow-y-auto p-3 bg-gray-800 rounded-lg">
                    {messages.length > 0 ? (
                      <div className="space-y-3">
                        {messages.map((message) => (
                          <div 
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.sender === 'user' 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-gray-700 text-gray-200'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{message.text}</p>
                              <p className="text-xs opacity-70 mt-1 text-right">
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 h-full flex items-center justify-center">
                        <p>Tanyakan tentang penyakit ini atau cara penanganannya</p>
                      </div>
                    )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pertanyaan Anda..."
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isChatLoading}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isChatLoading}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isChatLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengirim...
                    </>
                  ) : (
                    'Kirim'
                  )}
                </button>
              </form>
              </div>
          )}

      </div>
    </div>
  );
}
