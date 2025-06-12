const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type ChatResponse = {
  response: string;
};

export const chatService = {
  async sendMessage(prompt: string): Promise<ChatResponse> {
    const response = await fetch(`${API_URL}/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
