import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const model = 'gemini-2.5-flash-lite-preview-06-17';
// const model = 'gemini-2.5-pro';

const config = {
    temperature: 0.7,
    responseMimeType: 'application/json',
  };

const history = [];

export const createChatInstance = async () => {
  const chat = await ai.chats.create({
    model,
    config,
    history,
  });
  return chat;
};