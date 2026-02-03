
import { GoogleGenAI } from "@google/genai";
import { EVENT_DETAILS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
Você é o Assistente IA do CEITEC Itapipoca. 
Sua função é ajudar os pais com informações sobre a Reunião de Pais e Mestres.

Detalhes do Evento:
- Título: ${EVENT_DETAILS.title}
- Data: ${EVENT_DETAILS.date}
- Horário: ${EVENT_DETAILS.time}
- Local: ${EVENT_DETAILS.location}
- Descrição: ${EVENT_DETAILS.description}
- O que levar: ${EVENT_DETAILS.requirements}

Responda de forma educada, prestativa e concisa. Sempre em português do Brasil.
Se perguntarem sobre documentos, mencione o boletim impresso ou acesso ao portal.
`;

export async function sendMessageToAssistant(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, estou tendo dificuldades para processar sua mensagem agora. Por favor, tente novamente em alguns instantes.";
  }
}
